package main

import (
	"fmt"
	"strconv"
	"net/http"
	"html/template"
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
	

	/*
	
	*/

	http.HandleFunc("/api/user", app.UserEntrypoint)
	http.HandleFunc("/api/users", app.UsersEntrypoint)
	http.HandleFunc("/api/auth", app.AuthEntrypoint)
	http.HandleFunc("/api/mail", app.MailEntrypoint)
	http.HandleFunc("/api/assetlayer", app.EntrypointASSETLAYER)
	
	http.HandleFunc("/api/thing", app.EntrypointTHING)
	http.HandleFunc("/api/things", app.EntrypointTHINGS)
	println("registering handlers for things")
	http.HandleFunc("/api/furnishing", app.EntrypointFURNISHING)
	http.HandleFunc("/api/furnishings", app.EntrypointFURNISHINGS)
	println("registering handlers for furnishings")
	http.HandleFunc("/api/arthur", app.EntrypointARTHUR)
	http.HandleFunc("/api/arthurs", app.EntrypointARTHURS)
	println("registering handlers for arthurs")
	http.HandleFunc("/api/jelly", app.EntrypointJELLY)
	http.HandleFunc("/api/jellys", app.EntrypointJELLYS)
	println("registering handlers for jellys")
	http.HandleFunc("/api/jellyname", app.EntrypointJELLYNAME)
	http.HandleFunc("/api/jellynames", app.EntrypointJELLYNAMES)
	println("registering handlers for jellynames")
	http.HandleFunc("/api/game", app.EntrypointGAME)
	http.HandleFunc("/api/games", app.EntrypointGAMES)
	println("registering handlers for games")
	http.HandleFunc("/api/lobby", app.EntrypointLOBBY)
	http.HandleFunc("/api/lobbys", app.EntrypointLOBBYS)
	println("registering handlers for lobbys")
	http.HandleFunc("/api/character", app.EntrypointCHARACTER)
	http.HandleFunc("/api/characters", app.EntrypointCHARACTERS)
	println("registering handlers for characters")
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
	http.HandleFunc("/api/town", app.EntrypointTOWN)
	http.HandleFunc("/api/towns", app.EntrypointTOWNS)
	println("registering handlers for towns")
	http.HandleFunc("/api/teststreet", app.EntrypointTESTSTREET)
	http.HandleFunc("/api/teststreets", app.EntrypointTESTSTREETS)
	println("registering handlers for teststreets")
	http.HandleFunc("/api/street", app.EntrypointSTREET)
	http.HandleFunc("/api/streets", app.EntrypointSTREETS)
	println("registering handlers for streets")
	http.HandleFunc("/api/building", app.EntrypointBUILDING)
	http.HandleFunc("/api/buildings", app.EntrypointBUILDINGS)
	println("registering handlers for buildings")
	http.HandleFunc("/api/floor", app.EntrypointFLOOR)
	http.HandleFunc("/api/floors", app.EntrypointFLOORS)
	println("registering handlers for floors")
	http.HandleFunc("/api/room", app.EntrypointROOM)
	http.HandleFunc("/api/rooms", app.EntrypointROOMS)
	println("registering handlers for rooms")

	http.HandleFunc("/htmx/hello", htmx_hello)
	http.HandleFunc("/htmx/world", htmx_world)

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

func htmx_hello(w http.ResponseWriter, r *http.Request) {
	htmlTemplate := `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Hello World</title>
		<script src="https://cdn.jsdelivr.net/npm/htmx.org/dist/htmx.js"></script>
	</head>
	<body>
		<h1 id="hello" hx-put="/htmx/world" hx-target="this" hx-swap="outerHTML"></h1>
		<button hx-get="/world" hx-trigger="click" hx-swap="outerHTML">Refresh</button>
	</body>
	</html>
	`

	// Parse the HTML template
	tmpl, err := template.New("hello").Parse(htmlTemplate)
	if err != nil {
		log.Fatal("Error parsing template:", err)
	}

	// Execute the template and write the output to os.Stdout
	err = tmpl.Execute(w, nil)
	if err != nil {
		log.Fatal("Error executing template:", err)
	}
}

func htmx_world(w http.ResponseWriter, r *http.Request) {
	htmlTemplate := `
		<h1 id="hello">hello the world</h1>
`

	// Parse the HTML template
	tmpl, err := template.New("hello").Parse(htmlTemplate)
	if err != nil {
		log.Fatal("Error parsing template:", err)
	}

	// Execute the template and write the output to os.Stdout
	err = tmpl.Execute(w, nil)
	if err != nil {
		log.Fatal("Error executing template:", err)
	}
}