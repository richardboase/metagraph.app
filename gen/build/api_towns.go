
package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
)

// api-towns
func (app *App) EntrypointTOWNS(w http.ResponseWriter, r *http.Request) {

	if cloudfunc.HandleCORS(w, r, "*") {
		return
	}

	user, err := app.GetSessionUser(r)
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

			fields := FieldsTOWN{}
			object := user.NewTOWN(nil, fields)
			if !object.ValidateInput(w, m) {
				return
			}

			// reuse document init create code
			if err := app.CreateDocumentTOWN(nil, object); err != nil {
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
			app.UploadTOWN(w, r, parent)
			return
		*/

		/*
		case "initarchiveupload":
			// reuse code
			app.ArchiveUploadTOWN(w, r, parent)
			return
		*/

		default:
			err := fmt.Errorf("function not found: %s", function)
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

	case "GET":

		switch function {

		// return the total amount of towns
		case "count":

			data := map[string]int{
				"count": FirestoreCount(app.App, "towns"),
			}
			if err := cloudfunc.ServeJSON(w, data); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}
			return

		case "list":

			// get function
			mode, err := cloudfunc.QueryParam(r, "mode")
			if err != nil {
				cloudfunc.HttpError(w, err, http.StatusBadRequest)
				return
			}

			var limit int
			limitString, _ := cloudfunc.QueryParam(r, "limit")
			if n, err := strconv.Atoi(limitString); err == nil {
				limit = n
			}

			app.townLists(w, user, nil, mode, limit)

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
