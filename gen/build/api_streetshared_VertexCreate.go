package main

import (
	"fmt"
//	"log"
//	"errors"
//	"encoding/json"

//a	"github.com/sashabaranov/go-openai"

	"github.com/kr/pretty"
)

func (app *App) streetVertexCreate(user *User, parent *STREET, prompt string) error {

	fmt.Println("prompt with parent", parent.Meta.ID, prompt)

	b, _ := app.MarshalJSON(parent.Fields)
	parentString := string(b)

	system := `Your role is a helpful preprocessor that follows the prompt to create one or more JSON objects, ultimately outputting raw valid JSON array.

We want to create one or more of these data objects: A street, part of the transaportation network of a town or city.

...for this parent object: ` + parentString + `

{

	// The street name 
	name (string)

	// the general zoning type of the street 
	zoning (string)

	// the length in meters of the street 
	length (int)

}

The response should be a raw JSON array with one or more objects, based on the user prompt: `

	println(system+prompt)

	_, resp, err := app.GCPClients.GenerateContent(system+prompt, 0.9)
	if err != nil {
		err = fmt.Errorf("ChatCompletion error: %v\n", err)
		return err
	}

	pretty.Println(resp)
/*
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
		object := user.NewSTREET(&parent.Meta, FieldsSTREET{})
		if err := object.ValidateObject(result); err != nil {
			return err
		}
		if err := app.CreateDocumentSTREET(&parent.Meta, object); err != nil {
			return err
		}
		app.SendMessageToUser(user, "create", object)
	}
*/
	return nil
}
