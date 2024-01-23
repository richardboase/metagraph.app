package main

import (
	"fmt"
	"log"
	"archive/zip"
	"bytes"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"net/http"
	"encoding/json"

	"github.com/sashabaranov/go-openai"

	//"google.golang.org/api/iterator"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
)

func (app *App) CreateDocumentLOBBY(parent *Internals, object *LOBBY) error {
	log.Println(*object)

	/*
	var order int
	iter := parent.Firestore(app.App).Collection(object.Meta.Class).Documents(app.Context())
	for {
		_, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Println(err)
			break
		}
		order++
	}
	object.Meta.Context.Order = order
	*/

	
	// create app wallet
	{
		log.Println("CREATING WALLET")
		wallerUserID, err := app.Assetlayer().NewAppWallet(object.Meta.AssetlayerWalletID())
		if err != nil {
			return err
		}
		object.Meta.Wallet = wallerUserID
	}
	

	/*
	// create asset
	{
		log.Println("CREATING TOKEN")
		assetID, err := app.Assetlayer().MintAssetWithProperties(object.Meta.AssetlayerCollectionID(), object)
		if err != nil {
			return err
		}
		object.Meta.Asset = assetID
		if err := app.Assetlayer().SendAsset(assetID, "$"+object.Meta.AssetlayerWalletID()); err != nil {
			return err
		}
	}
	*/
	
	// write new LOBBY to the DB
	if err := object.Meta.SaveToFirestore(app.App, object); err != nil {
		return err
	}

	/*
	b, err := app.MarshalJSON(object)
	if err != nil {
		return err
	}
	topicID := ""
	result := app.PubSub().Topic(topicID).Publish(
		app.Context(),
		&pubsub.Message{Data: b},
	)
	msgID, err := result.Get(app.Context())
	if err != nil {
		return err
	}
	log.Println("PUBLISHED JOB TO TOPIC", topicID, msgID)
	*/

	return nil
}

func (app *App) UploadLOBBY(w http.ResponseWriter, r *http.Request, parent *Internals) {

	log.Println("PARSING FORM")
	if err := r.ParseMultipartForm(300 << 20); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}

	// Get handler for filename, size and headers
	file, handler, err := r.FormFile("file")
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}

	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)

	buf := bytes.NewBuffer(nil)
	// Copy the uploaded file to the created file on the filesystem
	if n, err := io.Copy(buf, file); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	} else {
		log.Println("copy: wrote", n, "bytes")
	}

	/*
	if err := checkImageLOBBY(buf.Bytes()); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}
	*/
	log.Println("creating new lobby:", handler.Filename)
	fields := FieldsLOBBY{}
	lobby := NewLOBBY(parent, fields)

	// hidden line here if noparent: lobby.Fields.Filename = zipFile.Name
	

	// generate a new URI
	uri := lobby.Meta.NewURI()
	println ("URI", uri)

	bucketName := "go-gen-test-uploads"
	if err := app.writeLobbyFile(bucketName, uri, buf.Bytes()); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}

	// reuse document init create code
	if err := app.CreateDocumentLOBBY(parent, lobby); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return		
	}
	return
}

func (app *App) ArchiveUploadLOBBY(w http.ResponseWriter, r *http.Request, parent *Internals) {

	log.Println("PARSING FORM")
	if err := r.ParseMultipartForm(300 << 20); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}

	// Get handler for filename, size and headers
	file, handler, err := r.FormFile("file")
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}

	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)

	buf := bytes.NewBuffer(nil)
	// Copy the uploaded file to the created file on the filesystem
	if n, err := io.Copy(buf, file); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	} else {
		log.Println("copy: wrote", n, "bytes")
	}

	// Open the zip archive from the buffer
	zipReader, err := zip.NewReader(bytes.NewReader(buf.Bytes()), int64(buf.Len()))
	if err != nil {
		err = fmt.Errorf("Error opening zip archive: %v", err)
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return 
	}

	// Extract each file from the zip archive
	for n, zipFile := range zipReader.File {

		extractedContent, err := readZipFileLOBBY(zipFile)
		if err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		}

		/*
		if err := checkImageLOBBY(extractedContent); err != nil {
			log.Println("skipping file that cannot be decoded:", zipFile.Name)
			continue
		}
		*/
		log.Println("creating new lobby:", zipFile.Name)
		fields := FieldsLOBBY{}
		lobby := NewLOBBY(parent, fields)

		// hidden line here if noparent: lobby.Fields.Filename = zipFile.Name
		

		lobby.Meta.Context.Order = n

		// generate a new URI
		uri := lobby.Meta.NewURI()
		println ("URI", uri)

		bucketName := "go-gen-test-uploads"
		if err := app.writeLobbyFile(bucketName, uri, extractedContent); err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		}

		// reuse document init create code
		if err := app.CreateDocumentLOBBY(parent, lobby); err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return		
		}

	}
	return
}

// assert file is an image because of .Object.Options.Image
func checkImageLOBBY(fileBytes []byte) error {
	_, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	return err
}

func readZipFileLOBBY(zipFile *zip.File) ([]byte, error) {
	// Open the file from the zip archive
	zipFileReader, err := zipFile.Open()
	if err != nil {
		return nil, fmt.Errorf("Error opening zip file entry: %v", err)
	}
	defer zipFileReader.Close()

	// Read the content of the file from the zip archive
	var extractedContent bytes.Buffer
	if _, err := io.Copy(&extractedContent, zipFileReader); err != nil {
		return nil, fmt.Errorf("Error reading zip file entry content: %v", err)
	}

	return extractedContent.Bytes(), nil
}

func (app *App) writeLobbyFile(bucketName, objectName string, content []byte) error {
	writer := app.GCPClients.GCS().Bucket(bucketName).Object(objectName).NewWriter(app.Context())
	//writer.ObjectAttrs.CacheControl = "no-store"
	defer writer.Close()
	n, err := writer.Write(content)
	fmt.Printf("wrote %s %d bytes to bucket: %s \n", objectName, n, bucketName)
	return err
}

func (app *App) lobbyChatGPT(parent *Internals, collection, prompt string) error {

	fmt.Println("prompt with parent", parent.ID, prompt)

	prompt = fmt.Sprintf(`
We want to create one or more of these data objects: 

Its schema is:
{
name (string)
}

MY PROMPT: %s

REPLY ONLY WITH A JSON ENCODED ARRAY OF THE GENERATED OBJECTS.
`,
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
		return err
	}

	reply := resp.Choices[0].Message.Content
	log.Println("reply >>", reply)

	newResults := []interface{}{}
	if err := json.Unmarshal([]byte(reply), &newResults); err != nil {
		return err
	}

	for _, result := range newResults {
		object := NewLOBBY(parent, FieldsLOBBY{})
		if err := object.ValidateObject(result.(map[string]interface{})); err != nil {
			return err
		}
		if err := object.Meta.SaveToFirestore(app.App, object); err != nil {
			return err
		}
	}

	return nil
}