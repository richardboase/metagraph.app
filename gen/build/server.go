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
		os.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "../../../npg-generic-d0985a6033b3.json")
	}

	app := NewApp()
	app.UseGCP("npg-generic")
	app.UseGCPFirestore("go-gen-test")
	app.UseAssetlayer(
		os.Getenv("ASSETLAYERAPPID"),
		os.Getenv("ASSETLAYERSECRET"),
		os.Getenv("DIDTOKEN"),
	)
	app.UseChatGPT(os.Getenv("OPENAI_KEY"))

	slotID, err := app.Assetlayer().EnsureSlotExists("go-gen-test-models", "description...", "")
	if err != nil {
		panic(err)
	}
	os.Setenv("SLOTID", slotID)

	
	{
		collectionID, err := app.Assetlayer().EnsureCollectionExists(slotID, "Unique", "games", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_GAMES", collectionID)
	}
	{
		collectionID, err := app.Assetlayer().EnsureCollectionExists(slotID, "Unique", "lobbys", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_LOBBYS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer().EnsureCollectionExists(slotID, "Unique", "characters", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_CHARACTERS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer().EnsureCollectionExists(slotID, "Unique", "towns", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_TOWNS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer().EnsureCollectionExists(slotID, "Unique", "teststreets", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_TESTSTREETS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer().EnsureCollectionExists(slotID, "Unique", "quarters", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_QUARTERS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer().EnsureCollectionExists(slotID, "Unique", "streets", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_STREETS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer().EnsureCollectionExists(slotID, "Unique", "buildings", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_BUILDINGS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer().EnsureCollectionExists(slotID, "Unique", "floors", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_FLOORS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer().EnsureCollectionExists(slotID, "Unique", "rooms", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_ROOMS", collectionID)
	}

	

	http.HandleFunc("/api/user", app.UserEntrypoint)
	http.HandleFunc("/api/users", app.UsersEntrypoint)
	http.HandleFunc("/api/auth", app.AuthEntrypoint)
	http.HandleFunc("/api/assetlayer", app.EntrypointASSETLAYER)
	http.HandleFunc("/api/asyncjob", app.EntrypointASYNCJOB)
	http.HandleFunc("/api/openai", app.EntrypointOPENAI)
	
	http.HandleFunc("/api/game", app.EntrypointGAME)
	http.HandleFunc("/api/games", app.EntrypointGAMES)
	println("registering handlers for games")
	http.HandleFunc("/api/lobby", app.EntrypointLOBBY)
	http.HandleFunc("/api/lobbys", app.EntrypointLOBBYS)
	println("registering handlers for lobbys")
	http.HandleFunc("/api/character", app.EntrypointCHARACTER)
	http.HandleFunc("/api/characters", app.EntrypointCHARACTERS)
	println("registering handlers for characters")
	http.HandleFunc("/api/town", app.EntrypointTOWN)
	http.HandleFunc("/api/towns", app.EntrypointTOWNS)
	println("registering handlers for towns")
	http.HandleFunc("/api/teststreet", app.EntrypointTESTSTREET)
	http.HandleFunc("/api/teststreets", app.EntrypointTESTSTREETS)
	println("registering handlers for teststreets")
	http.HandleFunc("/api/quarter", app.EntrypointQUARTER)
	http.HandleFunc("/api/quarters", app.EntrypointQUARTERS)
	println("registering handlers for quarters")
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

	http.HandleFunc("/ws", app.HandleConnections)

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


