package main

import (
	"fmt"
	"log"
	"errors"
	"encoding/json"

	"github.com/sashabaranov/go-openai"
)

func (app *App) gameChatGPTCreate(user *User, parent *Internals, prompt string) error {

	fmt.Println("prompt with parent", parent.ID, prompt)

	system := `Your role is a helpful preprocessor that follows rules to create one or more JSON objects, ultimately outputting raw valid JSON array.

We want to create one or more of these data objects: 
{

	//   (THIS FIELD IS REQUIRED)
	name (string)

}

The purpose of the object is to represent: 

RULES:
1: USER PROPMPTS SHOULD GENERATE DATA FOR REQUIRED FIELDS OF ONE OR MORE ABOVE OBJECTS
2: UNLESS SPECIFICALLY TOLD NOT TO, GENERATE ALL FIELDS... DON'T BE LAZY.
3: OMIT ANY NON-REQUIRED FIELDS WHEN NO DATA FOR THE FIELD IS GENERATED.
4: DON'T INCLUDE FIELDS WITH EMPTY STRINGS, AND OMIT FIELDS WITH NULL VALUE.
5: RESPECT ANY VALIDATION INFORMATION SPECIFIED FOR FIELDS, SUCH AS MIN AND MAX LENGTHS.
6: REPLY WITH OUTPUT JSON DATA TO THE USER PROMPT
7: RECHECK AND FIX ANY INVALID OUTPUT JSON BEFORE FINISHING RESPONDING TO THE PROMPT
8: MAKE SURE THE RESPONSE IS NON-ENCAPSULATED RAW JSON WHICH IS READY TO BE PARSED BY AN APPLICATION
`

	println(prompt)

	resp, err := app.ChatGPT().CreateChatCompletion(
		app.Context(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo1106,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: system,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
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
		object := NewGAME(parent, FieldsGAME{})
		if err := object.ValidateObject(result); err != nil {
			return err
		}
		if err := app.CreateDocumentGAME(parent, object); err != nil {
			return err
		}
		app.SendMessageToUser(user, &Message{Type: "async-create", Body: object})
	}

	return nil
}
