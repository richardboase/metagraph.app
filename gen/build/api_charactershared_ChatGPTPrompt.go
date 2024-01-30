package main

import (
	"fmt"
	"log"

	"github.com/sashabaranov/go-openai"
)

func (app *App) characterChatGPTPrompt(object *CHARACTER, prompt string) (string, error) {

	system := `Your role is a helpful preprocessor that follows rules to create one or more JSON objects, ultimately outputting raw valid JSON array.

We want to create one or more of these data objects: 
{

	// the name of the unique character  (THIS FIELD IS REQUIRED)
	name (string)

	// the age in years of the character  (THIS FIELD IS REQUIRED)
	age (int)

	// either male or female  (THIS FIELD IS REQUIRED)
	gender (string)

	// health issues affecting the character  (THIS FIELD IS REQUIRED)
	diseases (string)

	// primary job or ocuupation of the character  (THIS FIELD IS REQUIRED)
	profession (string)

	// the social class of the character (upper, middle, working, lower)  (THIS FIELD IS REQUIRED)
	socialclass (string)

	// a short synopis of the full life story of the character  (THIS FIELD IS REQUIRED)
	backstory (string)

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
		return "", err
	}

	reply := resp.Choices[0].Message.Content
	log.Println("reply >>", reply)
	
	return reply, nil
}
