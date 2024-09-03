package main

import (
	"fmt"
	"strconv"
	"net/http"
	"os"
	"log"
)

func main() {
	log.Println("Starting Application", "npg-generic", "go-gen-test")

	// handle local dev
	if os.Getenv("ENVIRONMENT") != "production" {
		os.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "/Users/"+os.Getenv("USER")+"/npg-generic-d0985a6033b3.json")
	}

	app := NewApp()

	// init openai
	
	app.UseVertex("europe-west2-b")
	app.UseChatGPT(os.Getenv("OPENAI_KEY"))
	

	// init pusher
	

	// init handcash
	


	http.HandleFunc("/api/user", app.UserEntrypoint)
	http.HandleFunc("/api/users", app.UsersEntrypoint)
	http.HandleFunc("/api/auth", app.AuthEntrypoint)
	http.HandleFunc("/api/mail", app.MailEntrypoint)
	http.HandleFunc("/api/assetlayer", app.EntrypointASSETLAYER)
	
	http.HandleFunc("/api/dns", app.EntrypointDNS)
	http.HandleFunc("/api/dnss", app.EntrypointDNSS)
	println("registering handlers for dnss")
	http.HandleFunc("/api/book", app.EntrypointBOOK)
	http.HandleFunc("/api/books", app.EntrypointBOOKS)
	println("registering handlers for books")
	http.HandleFunc("/api/bookcharacter", app.EntrypointBOOKCHARACTER)
	http.HandleFunc("/api/bookcharacters", app.EntrypointBOOKCHARACTERS)
	println("registering handlers for bookcharacters")
	http.HandleFunc("/api/chapter", app.EntrypointCHAPTER)
	http.HandleFunc("/api/chapters", app.EntrypointCHAPTERS)
	println("registering handlers for chapters")
	http.HandleFunc("/api/paragraph", app.EntrypointPARAGRAPH)
	http.HandleFunc("/api/paragraphs", app.EntrypointPARAGRAPHS)
	println("registering handlers for paragraphs")

	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		port = 8080
	}
	addr := fmt.Sprintf(":%d", port)
	fmt.Printf("Server is running on http://localhost:%d\n", port)
	if err := http.ListenAndServe(addr, nil); err != nil {
		fmt.Println("Error:", err)
	}
}
