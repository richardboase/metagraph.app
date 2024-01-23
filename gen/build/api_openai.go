package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"

	"cloud.google.com/go/firestore"
	"github.com/golangdaddy/leap/sdk/cloudfunc"
	"github.com/golangdaddy/leap/utils"
	"github.com/kr/pretty"
	"github.com/richardboase/npgpublic/models"
	"github.com/sashabaranov/go-openai"
	"google.golang.org/api/iterator"
)

// api-openai
func (app *App) EntrypointOPENAI(w http.ResponseWriter, r *http.Request) {

	if cloudfunc.HandleCORS(w, r, "*") {
		return
	}

	_, err := utils.GetSessionUser(app.App, r)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusUnauthorized)
		return
	}

	// get collection metadata
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

	// get function
	collection, err := cloudfunc.QueryParam(r, "collection")
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}

	switch r.Method {

	case "POST":

		println("grabbing results for prompt:", collection)

		var list []map[string]interface{}
		iter := parent.Firestore(app.App).Collection(collection).OrderBy("Meta.Created", firestore.Asc).Documents(app.Context())
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				log.Println(err)
				break
			}
			m := map[string]interface{}{}
			if err := doc.DataTo(&m); err != nil {
				log.Println(err)
				continue
			}
			m["_"] = m["Meta"].(map[string]interface{})["ID"].(string)
			// prune metadata
			delete(m, "Meta")

			pretty.Println(m)

			list = append(list, m)
		}

		switch function {

		case "collectionprompt":

			m := map[string]interface{}{}
			if err := cloudfunc.ParseJSON(r, &m); err != nil {
				cloudfunc.HttpError(w, err, http.StatusBadRequest)
				return
			}

			prompt, ok := models.AssertKeyValueSTRING(w, m, "prompt")
			if !ok {
				return
			}

			fmt.Println("prompt with parent", parent.ID, prompt)

			b, err := json.Marshal(list)
			if err != nil {
				cloudfunc.HttpError(w, err, http.StatusBadRequest)
				return
			}

			prompt = fmt.Sprintf(`
This JSON represents the current state of items in a database table:
%s

MY PROMPT: %s

REPLY ONLY WITH A JSON ENCODED ARRAY OF THE END RESULT
`,
				string(b),
				prompt,
			)

			println(prompt)

			resp, err := app.ChatGPT().CreateChatCompletion(
				app.Context(),
				openai.ChatCompletionRequest{
					Model: openai.GPT3Dot5Turbo,
					Messages: []openai.ChatCompletionMessage{
						{
							Role:    openai.ChatMessageRoleUser,
							Content: prompt,
						},
					},
				},
			)
			if err != nil {
				err = fmt.Errorf("ChatCompletion error: %v\n", err)
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}

			updates := []firestore.Update{}
			for _, item := range list {
				for field, value := range item["fields"].(map[string]interface{}) {
					updates = append(updates, firestore.Update{
						Path:  "fields." + strings.ToLower(field),
						Value: value,
					})
				}
				docID := item["_"].(string)
				log.Println("updating firestore doc:", docID)
				if updateInfo, err := parent.Firestore(app.App).Collection(collection).Doc(docID).Update(
					app.Context(),
					updates,
				); err != nil {
					cloudfunc.HttpError(w, err, http.StatusInternalServerError)
					return
				} else {
					log.Println(updateInfo)
				}
			}

			if err := cloudfunc.ServeJSON(w, resp.Choices[0].Message.Content); err != nil {
				cloudfunc.HttpError(w, err, http.StatusInternalServerError)
				return
			}

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
