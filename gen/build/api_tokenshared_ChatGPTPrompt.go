package main

import (
	"fmt"
	"log"

	"github.com/sashabaranov/go-openai"
)

func (app *App) tokenChatGPTPrompt(user *User, object *TOKEN, prompt string) (string, error) {

	system := `Your role is a helpful preprocessor that follows rules to create one or more JSON objects, ultimately outputting raw valid JSON array.

We want to create one or more of these data objects: 
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

The purpose of the object is to represent: Information about the token being minted

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
