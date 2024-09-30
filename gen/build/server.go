package main

import (
	"fmt"
	"strconv"
	"net/http"
	"os"
	"log"
	"strings"
)

func main() {
	log.Println("Starting Application", "npg-generic", "metagraphapp")

	// handle local dev
	if strings.ToLower(os.Getenv("ENVIRONMENT")) != "production" {
		os.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "/Users/"+os.Getenv("USER")+"/npg-generic-d0985a6033b3.json")
	}

	app := NewApp()

	// init openai
	
	app.UseVertex("europe-west2-b")
	app.UseChatGPT(os.Getenv("OPENAI_KEY"))
	

	// init pusher
	

	// init handcash
	
	http.HandleFunc("/handcash/success", app.HandcashEntrypointSuccess)
	


	http.HandleFunc("/api/user", app.UserEntrypoint)
	http.HandleFunc("/api/users", app.UsersEntrypoint)
	http.HandleFunc("/api/auth", app.AuthEntrypoint)
	http.HandleFunc("/api/mail", app.MailEntrypoint)
	http.HandleFunc("/api/assetlayer", app.EntrypointASSETLAYER)
	
	http.HandleFunc("/api/classofthings", app.EntrypointCLASSOFTHINGS)
	http.HandleFunc("/api/classofthingss", app.EntrypointCLASSOFTHINGSS)
	println("registering handlers for classofthingss")
	http.HandleFunc("/api/healthcheckup", app.EntrypointHEALTHCHECKUP)
	http.HandleFunc("/api/healthcheckups", app.EntrypointHEALTHCHECKUPS)
	println("registering handlers for healthcheckups")
	http.HandleFunc("/api/adopter", app.EntrypointADOPTER)
	http.HandleFunc("/api/adopters", app.EntrypointADOPTERS)
	println("registering handlers for adopters")

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
