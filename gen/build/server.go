package main

import (
	"fmt"
	"strconv"
	"net/http"
	"os"
	"log"
)

func main() {
	log.Println("Starting Application", "rescue-center-proj", "rescue-center-management")

	// handle local dev
	if os.Getenv("ENVIRONMENT") != "production" {
		os.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "/Users/"+os.Getenv("USER")+"/npg-generic-d0985a6033b3.json")
	}

	app := NewApp()

	// init openai
	
	app.UseVertex("us-central1")
	app.UseChatGPT(os.Getenv("OPENAI_KEY"))
	

	// init pusher
	

	// init handcash
	


	http.HandleFunc("/api/user", app.UserEntrypoint)
	http.HandleFunc("/api/users", app.UsersEntrypoint)
	http.HandleFunc("/api/auth", app.AuthEntrypoint)
	http.HandleFunc("/api/mail", app.MailEntrypoint)
	http.HandleFunc("/api/assetlayer", app.EntrypointASSETLAYER)
	
	http.HandleFunc("/api/pet", app.EntrypointPET)
	http.HandleFunc("/api/pets", app.EntrypointPETS)
	println("registering handlers for pets")
	http.HandleFunc("/api/adopter", app.EntrypointADOPTER)
	http.HandleFunc("/api/adopters", app.EntrypointADOPTERS)
	println("registering handlers for adopters")
	http.HandleFunc("/api/donation", app.EntrypointDONATION)
	http.HandleFunc("/api/donations", app.EntrypointDONATIONS)
	println("registering handlers for donations")

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
