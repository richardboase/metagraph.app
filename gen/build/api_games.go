
package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"cloud.google.com/go/firestore"
	"github.com/golangdaddy/leap/sdk/cloudfunc"
	"github.com/richardboase/npgpublic/utils"
	"google.golang.org/api/iterator"
)

// api-games
func (app *App) EntrypointGAMES(w http.ResponseWriter, r *http.Request) {

	if cloudfunc.HandleCORS(w, r, "*") {
		return
	}

	_, err := utils.GetSessionUser(app.App, r)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusUnauthorized)
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

		m := map[string]interface{}{}
		if err := cloudfunc.ParseJSON(r, &m); err != nil {
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

		log.Println("SWITCH FUNCTION", function)

		switch function {

		case "init":

			fields := FieldsGAME{}
			object := NewGAME(nil, fields)
			if !object.ValidateInput(w, m) {
				return
			}

			// reuse document init create code
			if err := app.CreateDocumentGAME(nil, object); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return				
			}

			// finish the request
			if err := cloudfunc.ServeJSON(w, object); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}
			return

		/*
		case "initupload":
			// reuse code
			app.UploadGAME(w, r, parent)
			return
		*/

		/*
		case "initarchiveupload":
			// reuse code
			app.ArchiveUploadGAME(w, r, parent)
			return
		*/


		default:
			err := fmt.Errorf("function not found: %s", function)
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

	case "GET":

		switch function {

		// return the total amount of games
		case "count":

			data := map[string]int{
				"count": FirestoreCount(app.App, "games"),
			}
			if err := cloudfunc.ServeJSON(w, data); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}
			return

		// return a list of games in a specific parent
		case "list", "altlist":

			var limit int
			limitString, _ := cloudfunc.QueryParam(r, "limit")
			if n, err := strconv.Atoi(limitString); err == nil {
				limit = n
			}

			list := []*GAME{}

			// handle objects that need to be ordered
			
			q := app.Firestore().Collection("games").OrderBy("Meta.Modified", firestore.Desc)
			
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
				object := &GAME{}
				if err := doc.DataTo(object); err != nil {
					log.Println(err)
					continue
				}
				list = append(list, object)
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
