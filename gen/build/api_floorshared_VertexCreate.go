package main

import (
	"fmt"
	// "io"
	//	"log"
	"errors"
	"encoding/json"

	//a	"github.com/sashabaranov/go-openai"

	"github.com/kr/pretty"
)

func (app *App) floorVertexCreate(user *User, parent *FLOOR, prompt string) error {

	fmt.Println("prompt with parent", parent.Meta.ID, prompt)

	b, _ := app.MarshalJSON(parent.Fields)
	parentString := string(b)

	system := `Your role is a helpful preprocessor that follows the prompt to create one or more JSON objects, ultimately outputting raw valid JSON array.

We want to create one or more of these data objects: A level or floor of a building where rooms or spaces are located.

...for this parent object: ` + parentString + `

{

	// the identifier of the floor  (THIS FIELD IS REQUIRED)
	name (string)

	//   (THIS FIELD IS REQUIRED)
	rooms (int)

}

The response should be a raw JSON array with one or more objects, based on the user prompt: `

	println(system+prompt)

	_, resp, err := app.GCPClients.GenerateContent(system+prompt, 0.9)
	if err != nil {
		err = fmt.Errorf("ChatCompletion error: %v\n", err)
		return err
	}

	c := resp.Candidates[0].Content.Parts[0]

	pretty.Println(c)

	reply, _ := app.MarshalJSON(c)

	newResults := []interface{}{}
	replyBytes := []byte(reply)
	if err := app.ParseContentForArray(string(replyBytes), &newResults); err != nil {
		newResult := map[string]interface{}{}
		if err := json.Unmarshal(replyBytes, &newResult); err != nil {
			return err
		}
		newResults = append(newResults, newResult)
	}

	for _, r := range newResults {
		result, ok := r.(map[string]interface{})
		if !ok {
			return errors.New("array item is not a map")
		}
		// remove any empty fields
		for k, v := range result {
			vv, ok := v.(string)
			if ok && vv == "" {
				delete(result, k)
			}
		}
		object := user.NewFLOOR(&parent.Meta, FieldsFLOOR{})
		if err := object.ValidateObject(result); err != nil {
			return err
		}
		if err := app.CreateDocumentFLOOR(&parent.Meta, object); err != nil {
			return err
		}
		app.SendMessageToUser(user, "create", object)
	}

	return nil
}
