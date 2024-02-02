
package main

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"log"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
)

// api-lobbys
func (app *App) EntrypointLOBBYS(w http.ResponseWriter, r *http.Request) {

	if cloudfunc.HandleCORS(w, r, "*") {
		return
	}

	user, err := app.GetSessionUser(r)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusUnauthorized)
		return
	}

	// get game metadata
	parentID, err := cloudfunc.QueryParam(r, "parent")
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}
	parent, err := app.GetMetadata(parentID)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusNotFound)
		return
	}

	// security
	if !app.IsAdmin(parent, user) {
		err := fmt.Errorf("USER %s IS NOT AN ADMIN", user.Username)
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

		log.Println("SWITCH FUNCTION", function)

		switch function {

		case "openai":

			// get openai command
			mode, err := cloudfunc.QueryParam(r, "mode")
			if err != nil {
				cloudfunc.HttpError(w, err, http.StatusBadRequest)
				return
			}

			m := map[string]interface{}{}
			if err := cloudfunc.ParseJSON(r, &m); err != nil {
				cloudfunc.HttpError(w, err, http.StatusBadRequest)
				return
			}
			prompt, ok := AssertSTRING(w, m, "prompt")
			if !ok {
				return
			}

			object := &LOBBY{}
			if err := app.GetDocument(parent.ID, object); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}

			switch mode {
			case "prompt":

				reply, err := app.lobbyChatGPTPrompt(user, object, prompt)
				if err != nil {
					cloudfunc.HttpError(w, err, http.StatusInternalServerError)
					return
				}

				if err := cloudfunc.ServeJSON(w, reply); err != nil {
					cloudfunc.HttpError(w, err, http.StatusInternalServerError)
					return
				}

			case "create":

				if err := app.lobbyChatGPTCreate(user, object, prompt); err != nil {
					cloudfunc.HttpError(w, err, http.StatusInternalServerError)
					return
				}

			case "modify":

				if err := app.lobbyChatGPTModify(user, object, prompt); err != nil {
					cloudfunc.HttpError(w, err, http.StatusInternalServerError)
					return
				}

			default:
				
				panic("openai")
			}

			return

		case "init":

			m := map[string]interface{}{}
			if err := cloudfunc.ParseJSON(r, &m); err != nil {
				cloudfunc.HttpError(w, err, http.StatusBadRequest)
				return
			}

			fields := FieldsLOBBY{}
			object := user.NewLOBBY(parent, fields)
			if !object.ValidateInput(w, m) {
				return
			}

			// reuse document init create code
			if err := app.CreateDocumentLOBBY(parent, object); err != nil {
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
			app.UploadLOBBY(w, r, parent, user)
			return
		*/

		/*
		case "inituploads":
			// reuse code
			app.ArchiveUploadLOBBY(w, r, parent, user)
			return
		*/

		default:
			err := fmt.Errorf("function not found: %s", function)
			cloudfunc.HttpError(w, err, http.StatusBadRequest)
			return
		}

	case "GET":

		switch function {

		// return the total amount of lobbys
		case "count":

			data := map[string]int{
				"count": parent.FirestoreCount(app.App, "lobbys"),
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

			app.lobbyLists(w, user, parent, mode, limit)

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