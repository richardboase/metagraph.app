
package main

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
)

// api-character
func (app *App) EntrypointCHARACTER(w http.ResponseWriter, r *http.Request) {

	if cloudfunc.HandleCORS(w, r, "*") {
		return
	}

	_, err := GetSessionUser(app.App, r)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusUnauthorized)
		return
	}

	// get character
	id, err := cloudfunc.QueryParam(r, "id")
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}
	object := &CHARACTER{}
	if err := GetDocument(app.App, id, object); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}

	switch r.Method {

	case "PATCH":

		// KV params for opject update
		m := map[string]interface{}{}
		if err := cloudfunc.ParseJSON(r, &m); err != nil {
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}
		field, ok := m["field"].(string)
		if !ok {
			err := errors.New("'field' parameter is not a string")
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}
		if len(field) < 1 {
			err := errors.New("'field' parameter must be non-zero length")
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}
		if m["value"] == nil {
			err := errors.New("'value' parameter must not be nil")
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

		bb, err := app.MarshalJSON(object.Fields)
		if err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		}
		fields := map[string]interface{}{}
		if err := app.UnmarshalJSON(bb, &fields);err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		}
		fields[field] = m["value"]

		updateBytes, err := app.MarshalJSON(fields)
		if err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		}
		if err := app.UnmarshalJSON(updateBytes, &object.Fields); err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		}

		/*
		updates := []firestore.Update{
			{
				Path: "Meta.Modified",
				Value: app.TimeNow().Unix(),
			},
			{
				Path: fmt.Sprintf("fields.%s", strings.ToLower(field)),
				Value: m["value"],
			},
		}
		for _, update := range updates {
			println(update.Path, update.Value)
		}
		if _, err := object.Meta.Firestore(app.App).Update(context.Background(), updates); err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		}
		*/

		object.Meta.Modify()
		if err := object.Meta.SaveToFirestore(app.App, object); err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		}
		return


	case "POST":

		// get function
		function, err := cloudfunc.QueryParam(r, "function")
		if err != nil {
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

		switch function {

		// update the subject
		case "update":

			m := map[string]interface{}{}
			if err := cloudfunc.ParseJSON(r, &m); err != nil {
				cloudfunc.HttpError(w, err, http.StatusBadRequest)
				return
			}

			if !object.ValidateInput(w, m) {
				return
			}

			/*
			updates := []firestore.Update{
				{
					Path: "Meta.Modified",
					Value: app.TimeNow().Unix(),
				},
				{
					Path: "fields.name",
					Value: object.Fields.Name,
				},{
					Path: "fields.age",
					Value: object.Fields.Age,
				},{
					Path: "fields.gender",
					Value: object.Fields.Gender,
				},{
					Path: "fields.diseases",
					Value: object.Fields.Diseases,
				},{
					Path: "fields.profession",
					Value: object.Fields.Profession,
				},{
					Path: "fields.socialclass",
					Value: object.Fields.Socialclass,
				},{
					Path: "fields.backstory",
					Value: object.Fields.Backstory,
				},
			}
			for _, update := range updates {
				println(update.Path, update.Value)
			}
			if _, err := object.Meta.Firestore(app.App).Update(app.Context(), updates); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}
			*/

			if err := object.Meta.SaveToFirestore(app.App, object); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}

			if err := cloudfunc.ServeJSON(w, object); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}
			return

		case "upload":

			log.Println("PARSING FORM")
			r.ParseMultipartForm(10 << 20)
		
			// Get handler for filename, size and headers
			file, handler, err := r.FormFile("file")
			if err != nil {
				cloudfunc.HttpError(w, err, http.StatusBadRequest)
				return
			}
		
			defer file.Close()
			fmt.Printf("Uploaded File: %+v\n", handler.Filename)
			fmt.Printf("File Size: %+v\n", handler.Size)
			fmt.Printf("MIME Header: %+v\n", handler.Header)

			// prepare upload with a new URI
			objectName := object.Meta.NewURI()
			writer := app.GCPClients.GCS().Bucket("npg-generic-uploads").Object(objectName).NewWriter(app.Context())
			//writer.ObjectAttrs.CacheControl = "no-store"
			defer writer.Close()
		
			buf := bytes.NewBuffer(nil)

			// Copy the uploaded file to the created file on the filesystem
			n, err := io.Copy(buf, file)
			if err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}
			log.Println("UPLOAD copytobuffer: wrote", n, "bytes")

			if _, err := writer.Write(buf.Bytes()); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}
		
			// update file with new URI value
			if err := object.Meta.SaveToFirestore(app.App, object); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}

			return
		

		default:
			err := fmt.Errorf("function not found: %s", function)
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

	case "GET":

		// get function
		function, err := cloudfunc.QueryParam(r, "function")
		if err != nil {
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

		switch function {

		// return a specific object object by id
		case "object":

			cloudfunc.ServeJSON(w, object)
			return

		default:
			err := fmt.Errorf("function not found: %s", function)
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

	case "DELETE":

		_, err := object.Meta.Firestore(app.App).Delete(app.Context())
		if err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		}
		return

	default:
		err := errors.New("method not allowed: " + r.Method)
		cloudfunc.HttpError(w, err, http.StatusMethodNotAllowed)
		return
	}
}

func (app *App) getCharacterList(subject *CHARACTER) []*CHARACTER {
	list := []*CHARACTER{}
	class := subject.Meta.Class
	var ref *firestore.CollectionRef
	if len(subject.Meta.Context.Parent) > 0 {
		ref = Internal(subject.Meta.Context.Parent).Firestore(app.App).Collection(class)
	} else {
		ref = app.Firestore().Collection(class)
	}
	iter := ref.OrderBy("Meta.Context.Order", firestore.Asc).Documents(app.Context())
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Println(err)
			break
		}
		object := &CHARACTER{}
		if err := doc.DataTo(object); err != nil {
			log.Println(err)
			continue
		}
		list = append(list, object)
	}
	log.Println(len(list))
	return list
}