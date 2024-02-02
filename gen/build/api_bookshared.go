package main

import (
	"fmt"
	"log"
	"strings"
	"archive/zip"
	"bytes"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"net/http"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
)

func (app *App) UploadBOOK(w http.ResponseWriter, r *http.Request, parent *Internals, user *User) {

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
	if err := checkImageBOOK(buf.Bytes()); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}
	*/
	log.Println("creating new book:", handler.Filename)
	fields := FieldsBOOK{}
	book := user.NewBOOK(parent, fields)

	// hidden line here if noparent: book.Fields.Filename = zipFile.Name
	

	// generate a new URI
	uri := book.Meta.NewURI()
	println ("URI", uri)

	bucketName := "go-gen-test-uploads"
	if err := app.writeBookFile(bucketName, uri, buf.Bytes()); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}

	// reuse document init create code
	if err := app.CreateDocumentBOOK(parent, book); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return		
	}
	return
}

func (app *App) ArchiveUploadBOOK(w http.ResponseWriter, r *http.Request, parent *Internals, user *User) {

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

		extractedContent, err := readZipFileBOOK(zipFile)
		if err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		}

		/*
		if err := checkImageBOOK(extractedContent); err != nil {
			log.Println("skipping file that cannot be decoded:", zipFile.Name)
			continue
		}
		*/
		log.Println("creating new book:", zipFile.Name)
		fields := FieldsBOOK{}
		book := user.NewBOOK(parent, fields)

		// hidden line here if noparent: book.Fields.Filename = zipFile.Name
		

		book.Meta.Context.Order = n

		// generate a new URI
		uri := book.Meta.NewURI()
		println ("URI", uri)

		bucketName := "go-gen-test-uploads"
		if err := app.writeBookFile(bucketName, uri, extractedContent); err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		}

		// reuse document init create code
		if err := app.CreateDocumentBOOK(parent, book); err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return		
		}

	}
	return
}

// assert file is an image because of .Object.Options.Image
func checkImageBOOK(fileBytes []byte) error {
	_, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	return err
}

func readZipFileBOOK(zipFile *zip.File) ([]byte, error) {
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

func (app *App) writeBookFile(bucketName, objectName string, content []byte) error {
	writer := app.GCPClients.GCS().Bucket(bucketName).Object(objectName).NewWriter(app.Context())
	//writer.ObjectAttrs.CacheControl = "no-store"
	defer writer.Close()
	n, err := writer.Write(content)
	fmt.Printf("wrote %s %d bytes to bucket: %s \n", objectName, n, bucketName)
	return err
}

func (app *App) addBookAdmin(object *BOOK, admin string) error {

	filter := map[string]bool{}
	for _, username := range strings.Split(admin, ",") {
		newAdmin, err := app.GetUserByUsername(username)
		if err != nil {
			log.Println("could not get username:", username)
			return err
		}
		filter[newAdmin.Meta.ID] = true
	}
	for _, admin := range object.Meta.Moderation.Admins {
		if len(admin) == 0 {
			continue
		}
		filter[admin] = true
	}
	object.Meta.Moderation.Admins = make([]string, len(filter))
	var x int
	for k, _ := range filter {
		object.Meta.Moderation.Admins[x] = k
		x++
	}

	object.Meta.Modify()

	log.Println("ADMINS", strings.Join(object.Meta.Moderation.Admins, " "))

	return object.Meta.SaveToFirestore(app.App, object)
}

func (app *App) removeBookAdmin(object *BOOK, admin string) error {

	filter := map[string]bool{}
	for _, a := range object.Meta.Moderation.Admins {
		if a == admin {
			continue
		}
		if len(a) == 0 {
			continue
		}
		filter[a] = true
	}
	object.Meta.Moderation.Admins = make([]string, len(filter))
	var x int
	for k, _ := range filter {
		object.Meta.Moderation.Admins[x] = k
		x++
	}

	object.Meta.Modify()

	log.Println("ADMINS", strings.Join(object.Meta.Moderation.Admins, " "))

	return object.Meta.SaveToFirestore(app.App, object)
}