package main

import (
	"fmt"
	"log"
	"reflect"
	"errors"
	"encoding/json"

	"github.com/sashabaranov/go-openai"
)

func (app *App) buildingChatGPTCreate(user *User, parent *BUILDING, prompt string) error {

	fmt.Println("prompt with parent", parent.Meta.ID, prompt)

    v := reflect.ValueOf(parent.Fields)
    t := reflect.TypeOf(parent.Fields)

	var parentString string

    for i := 0; i < t.NumField(); i++ {
        name := t.Field(i)
        value := v.Field(i)
		parentString += fmt.Sprintln("%s: %v", name, value)
	}

	system := `Your role is a helpful preprocessor that follows the prompt to create one or more JSON objects, ultimately outputting raw valid JSON array.

We want to create one or more of these data objects: A building which exists in a street, could be residential, commercial, or industrial.

...for this parent object: ` + parentString + `

{

	//  
	name (string)

	// A description of the building 
	description (string)

	// Street number(s) of the building 
	number (int)

	//   (THIS FIELD IS REQUIRED)
	xunits (float64)

	//   (THIS FIELD IS REQUIRED)
	yunits (float64)

	// Number of floors this building has  (THIS FIELD IS REQUIRED)
	floors (int)

	// Number of ground floor entrances or exits  (THIS FIELD IS REQUIRED)
	doors (int)

}

The response should be a raw JSON array with one or more objects, based on the user prompt: `

	println(prompt)

	resp, err := app.ChatGPT().CreateChatCompletion(
		app.Context(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo1106,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: system+prompt,
				},
			},
		},
	)
	if err != nil {
		err = fmt.Errorf("ChatCompletion error: %v\n", err)
		return err
	}

	reply := resp.Choices[0].Message.Content
	log.Println("reply >>", reply)

	newResults := []interface{}{}
	replyBytes := []byte(reply)
	if err := json.Unmarshal(replyBytes, &newResults); err != nil {
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
		object := user.NewBUILDING(&parent.Meta, FieldsBUILDING{})
		if err := object.ValidateObject(result); err != nil {
			return err
		}
		if err := app.CreateDocumentBUILDING(&parent.Meta, object); err != nil {
			return err
		}
		app.SendMessageToUser(user, "create", object)
	}

	return nil
}
