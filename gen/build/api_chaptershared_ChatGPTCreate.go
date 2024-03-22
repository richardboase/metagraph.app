package main

import (
	"fmt"
	"log"
	"reflect"
	"errors"
	"encoding/json"

	"github.com/sashabaranov/go-openai"
)

func (app *App) chapterChatGPTCreate(user *User, parent *CHAPTER, prompt string) error {

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

We want to create one or more of these data objects: a chapter of the book

...for this parent object: ` + parentString + `

{

	//   (THIS FIELD IS REQUIRED)
	name (string)

}

The response should be a raw JSON array with one or more objects, based on the user prompt: `

	println(system+prompt)

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
		object := user.NewCHAPTER(&parent.Meta, FieldsCHAPTER{})
		if err := object.ValidateObject(result); err != nil {
			return err
		}
		if err := app.CreateDocumentCHAPTER(&parent.Meta, object); err != nil {
			return err
		}
		app.SendMessageToUser(user, "create", object)
	}

	return nil
}
