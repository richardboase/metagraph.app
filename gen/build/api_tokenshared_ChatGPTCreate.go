package main

import (
	"fmt"
	"log"
	"errors"
	"encoding/json"

	"github.com/sashabaranov/go-openai"
)

func (app *App) tokenChatGPTCreate(user *User, parent *TOKEN, prompt string) error {

	fmt.Println("prompt with parent", parent.Meta.ID, prompt)

	b, _ := app.MarshalJSON(parent.Fields)
	parentString := string(b)

	system := `Your role is a helpful preprocessor that follows the prompt to create one or more JSON objects, ultimately outputting raw valid JSON array.

We want to create one or more of these data objects: Information about the token being minted

...for this parent object: ` + parentString + `

{

	// Type of token (Music Track, Picture, Gaming Card)  (THIS FIELD IS REQUIRED)
	tokentype (string)

	// Supply of the token  (THIS FIELD IS REQUIRED)
	supply (int)

	// Whether the token offers dividends  (THIS FIELD IS REQUIRED)
	hasdividend (string)

	// Website associated with the token 
	website (string)

	// Twitter handle associated with the token 
	twitter (string)

	// Telegram handle associated with the token 
	telegram (string)

	// Liquidity address for the token 
	liquidityaddress (string)

	// Amount to burn for liquidity 
	burnamount (float64)

	// Mint location address  (THIS FIELD IS REQUIRED)
	mintlocation (string)

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
		object := user.NewTOKEN(&parent.Meta, FieldsTOKEN{})
		if err := object.ValidateObject(result); err != nil {
			return err
		}
		if err := app.CreateDocumentTOKEN(&parent.Meta, object); err != nil {
			return err
		}
		app.SendMessageToUser(user, "create", object)
	}

	return nil
}
