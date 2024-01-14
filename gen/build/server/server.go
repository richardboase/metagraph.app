package main

import (
	"fmt"
	"net/http"
	"os"
	"log"

	"github.com/golangdaddy/newtown/gen/build/functions"
)

func main() {

	os.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "../../../npg-generic-d0985a6033b3.json")

	app := functions.NewApp()
	app.UseGCP("npg-generic")
	app.UseGCPFirestore("go-gen-test")

	slotID, err := app.Assetlayer.EnsureSlotExists("go-gen-test-models", "description...", "")
	if err != nil {
		panic(err)
	}
	os.Setenv("SLOTID", slotID)

	
	{
		collectionID, err := app.Assetlayer.EnsureCollectionExists(slotID, "Unique", "towns", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_TOWNS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer.EnsureCollectionExists(slotID, "Unique", "quarters", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_QUARTERS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer.EnsureCollectionExists(slotID, "Unique", "streets", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_STREETS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer.EnsureCollectionExists(slotID, "Unique", "buildings", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_BUILDINGS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer.EnsureCollectionExists(slotID, "Unique", "floors", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_FLOORS", collectionID)
	}
	{
		collectionID, err := app.Assetlayer.EnsureCollectionExists(slotID, "Unique", "rooms", "description...", "", 1000000, nil)
		if err != nil {
			panic(err)
		}
		os.Setenv("MODEL_ROOMS", collectionID)
	}

	

	http.HandleFunc("/api/user", app.UserEntrypoint)
	http.HandleFunc("/api/users", app.UsersEntrypoint)
	http.HandleFunc("/api/auth", app.AuthEntrypoint)
	
	http.HandleFunc("/api/town", app.EntrypointTOWN)
	http.HandleFunc("/api/towns", app.EntrypointTOWNS)
	println("registering handlers for towns")
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

	port := 8080
	addr := fmt.Sprintf(":%d", port)
	fmt.Printf("Server is running on http://localhost:%d\n", port)
	if err := http.ListenAndServe(addr, nil); err != nil {
		fmt.Println("Error:", err)
	}
}


