package main

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"log"

	"cloud.google.com/go/firestore"
	"github.com/richardboase/npgpublic/sdk/cloudfunc"
	"github.com/richardboase/npgpublic/utils"
	"google.golang.org/api/iterator"
)

// api-streets
func (app *App) EntrypointSTREETS(w http.ResponseWriter, r *http.Request) {

	if cloudfunc.HandleCORS(w, r, "*") {
		return
	}

	_, err := utils.GetSessionUser(app.App, r)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusUnauthorized)
		return
	}

	// get quarter metadata
	parentID, err := cloudfunc.QueryParam(r, "parent")
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}
	parent, err := GetMetadata(app.App, parentID)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusNotFound)
		return
	}

	// get function
	function, err := cloudfunc.QueryParam(r, "function")
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "POST":

		log.Println("SWITCH FUNCTION", function)

		switch function {

		case "init":

			m := map[string]interface{}{}
			if err := cloudfunc.ParseJSON(r, &m); err != nil {
				cloudfunc.HttpError(w, err, http.StatusBadRequest)
				return
			}

			fields := FieldsSTREET{}
			street := NewSTREET(parent, fields)
			if !street.ValidateInput(w, m) {
				return
			}

			// reuse document init create code
			if err := app.CreateDocumentSTREET(parent, street); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return				
			}

			// finish the request
			if err := cloudfunc.ServeJSON(w, street); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}
			return

		/*
		case "initupload":
			// reuse code
			app.UploadSTREET(w, r, parent)
			return
		*/

		/*
		case "inituploads":
			// reuse code
			app.ArchiveUploadSTREET(w, r, parent)
			return
		*/

		default:
			err := fmt.Errorf("function not found: %s", function)
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

	case "GET":

		switch function {

		// return the total amount of streets
		case "count":

			data := map[string]int{
				"count": parent.FirestoreCount(app.App, "streets"),
			}
			if err := cloudfunc.ServeJSON(w, data); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}
			return

		// return a list of streets in a specific parent
		case "list", "altlist":

			var limit int
			limitString, _ := cloudfunc.QueryParam(r, "limit")
			if n, err := strconv.Atoi(limitString); err == nil {
				limit = n
			}

			list := []*STREET{}

			// handle objects that need to be ordered
			
			q := parent.Firestore(app.App).Collection("streets").OrderBy("Meta.Modified", firestore.Desc)
			

			if limit > 0 {
				q = q.Limit(limit)
			}
			iter := q.Documents(app.Context())
			for {
				doc, err := iter.Next()
				if err == iterator.Done {
					break
				}
				if err != nil {
					log.Println(err)
					break
				}
				street := &STREET{}
				if err := doc.DataTo(street); err != nil {
					log.Println(err)
					continue
				}
				list = append(list, street)
			}

			if err := cloudfunc.ServeJSON(w, list); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}

			return

		default:
			err := fmt.Errorf("function not found: %s", function)
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

	default:
		err := errors.New("method not allowed: " + r.Method)
		cloudfunc.HttpError(w, err, http.StatusMethodNotAllowed)
		return
	}
}