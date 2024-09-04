package main

import (
	"archive/zip"
	"bytes"
	"fmt"
	"image/jpeg"
	_ "image/png"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/nfnt/resize"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
)

func (app *App) UploadTOKEN(w http.ResponseWriter, r *http.Request, parent *Internals, user *User) {

	log.Println("PARSING FORM")
	if err := r.ParseMultipartForm(300 << 20); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}

	files := r.MultipartForm.File["files"]

	newFileObjects := []*TOKEN{}

	for n, fileHeader := range files{

		log.Println("HANDLING FILE", n)

		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, fmt.Sprintf("Unable to open file: %s", fileHeader.Filename), http.StatusInternalServerError)
			return
		}
		defer file.Close()

		buf := bytes.NewBuffer(nil)
		// Copy the uploaded file to the created file on the filesystem
		if n, err := io.Copy(buf, file); err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return
		} else {
			log.Println("copy: wrote", n, "bytes")
		}

		if !strings.Contains(strings.ToLower(fileHeader.Filename), "zip") {

			obj, err := app.newUploadObjectTOKEN(parent, user, 0, fileHeader.Filename, buf.Bytes())
			if err != nil {
				log.Println(err)
				return
			}

			newFileObjects = append(newFileObjects, obj)

		} else {

			log.Println("HANDLING ZIP")

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
		
				extractedContent, err := readZipFileTOKEN(zipFile)
				if err != nil {
					log.Println(err)
					continue
				}
		
				obj, err := app.newUploadObjectTOKEN(parent, user, n, zipFile.Name, extractedContent)
				if err != nil {
					log.Println(err)
					continue
				}

				newFileObjects = append(newFileObjects, obj)
			}
		}
	}
	// make the documents proper
	for _, obj := range newFileObjects {
		if err := app.CreateDocumentTOKEN(parent, obj); err != nil {
			cloudfunc.HttpError(w, err, http.StatusInternalServerError)
			return		
		}
	}

	return
}

func (app *App) newUploadObjectTOKEN(parent *Internals, user *User, n int, name string, b []byte) (*TOKEN, error) {
	fields := FieldsTOKEN{}
	object := user.NewTOKEN(parent, fields)
	object.Meta.Name = name
	object.Meta.Context.Order = n
	// generate a new URI
	uri := object.Meta.NewURI()
	log.Println(name, "URI", uri)

	// check if it is an image
	img, err := object.ValidateImageTOKEN(b)
	if err != nil {
		fmt.Errorf("skipping file that cannot be decoded: %s", name)
		return nil, err
	}

	if err := app.writeTokenFile(CONST_BUCKET_UPLOADS, uri, b); err != nil {
		return nil, err
	}

	buf := bytes.NewBuffer(b)
	// write new image to file
	if err := jpeg.Encode(buf, resize.Resize(1000, 0, img, resize.Lanczos3), nil); err != nil {
		return nil, err
	}

	// update uri
	uri += "/preview"

	if err := app.writeTokenFile(CONST_BUCKET_UPLOADS, uri, buf.Bytes()); err != nil {
		return nil, err
	}

	object.Meta.Media.Preview = "https://storage.googleapis.com/go-gen-test-uploads/" + uri

	return object, nil
}

func readZipFileTOKEN(zipFile *zip.File) ([]byte, error) {
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

func (app *App) writeTokenFile(bucketName, objectName string, content []byte) error {
	writer := app.GCPClients.GCS().Bucket(bucketName).Object(objectName).NewWriter(app.Context())
	//writer.ObjectAttrs.CacheControl = "no-store"
	defer writer.Close()
	n, err := writer.Write(content)
	fmt.Printf("wrote %s %d bytes to bucket: %s \n", objectName, n, bucketName)
	return err
}
