package functions

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"

	"github.com/richardboase/npgpublic/sdk/cloudfunc"
	"github.com/richardboase/npgpublic/utils"

	"github.com/golangdaddy/leap/build/models"
)

// api-quarter
func (app *App) EntrypointQUARTER(w http.ResponseWriter, r *http.Request) {

	if cloudfunc.HandleCORS(w, r, "*") {
		return
	}

	_, err := utils.GetSessionUser(app.App, r)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusUnauthorized)
		return
	}

	// get quarter
	id, err := cloudfunc.QueryParam(r, "id")
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}
	quarter := &models.QUARTER{}
	if err := utils.GetDocument(app.App, id, quarter); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}

	switch r.Method {
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

			if !quarter.ValidateInput(w, m) {
				return
			}

			if err := quarter.Meta.SaveToFirestore(app.App, quarter); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}

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
			objectName := quarter.Meta.NewURI()
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
			if err := quarter.Meta.SaveToFirestore(app.App, quarter); err != nil {
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

		// return a specific quarter object by id
		case "object":

			cloudfunc.ServeJSON(w, quarter)
			return

		default:
			err := fmt.Errorf("function not found: %s", function)
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

	case "DELETE":

		_, err := quarter.Meta.Firestore(app.App).Delete(app.Context())
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

func (app *App) getQuarterList(subject *models.QUARTER) []*models.QUARTER {
	list := []*models.QUARTER{}
	class := subject.Meta.Class
	var ref *firestore.CollectionRef
	if len(subject.Meta.Context.Parent) > 0 {
		ref = models.Internal(subject.Meta.Context.Parent).Firestore(app.App).Collection(class)
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
		object := &models.QUARTER{}
		if err := doc.DataTo(object); err != nil {
			log.Println(err)
			continue
		}
		list = append(list, object)
	}
	log.Println(len(list))
	return list
}