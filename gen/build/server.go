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
	log.Println("Starting Application", "npg-generic", "go-gen-test")

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
	


	http.HandleFunc("/api/user", app.UserEntrypoint)
	http.HandleFunc("/api/users", app.UsersEntrypoint)
	http.HandleFunc("/api/auth", app.AuthEntrypoint)
	http.HandleFunc("/api/mail", app.MailEntrypoint)
	http.HandleFunc("/api/assetlayer", app.EntrypointASSETLAYER)
	
	http.HandleFunc("/api/creator", app.EntrypointCREATOR)
	http.HandleFunc("/api/creators", app.EntrypointCREATORS)
	println("registering handlers for creators")
	http.HandleFunc("/api/token", app.EntrypointTOKEN)
	http.HandleFunc("/api/tokens", app.EntrypointTOKENS)
	println("registering handlers for tokens")
	http.HandleFunc("/api/musicdetails", app.EntrypointMUSICDETAILS)
	http.HandleFunc("/api/musicdetailss", app.EntrypointMUSICDETAILSS)
	println("registering handlers for musicdetailss")
	http.HandleFunc("/api/picturedetails", app.EntrypointPICTUREDETAILS)
	http.HandleFunc("/api/picturedetailss", app.EntrypointPICTUREDETAILSS)
	println("registering handlers for picturedetailss")
	http.HandleFunc("/api/gamingcarddetails", app.EntrypointGAMINGCARDDETAILS)
	http.HandleFunc("/api/gamingcarddetailss", app.EntrypointGAMINGCARDDETAILSS)
	println("registering handlers for gamingcarddetailss")

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
