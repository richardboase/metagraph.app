package main

import (
	"encoding/json"
	"log"
	"os"

	"github.com/golangdaddy/leap"
	"github.com/golangdaddy/leap/models"
	"github.com/otiai10/copy"
)

func main() {

	tree := models.Stack{
		WebsocketHost: "rescue-center-go-gen-test-host.com",
		WebAPI:        "https://rescuecenterapi.example.com/",
		HostAPI:       "https://rescue-center-go-gen-test-host.com/",
		RepoURI:       "github.com/yourusername/rescuecenter",
		SiteName:      "RescueCenter",
		ProjectID:     "rescue-center-proj",
		ProjectName:   "rescue-center-management",
		ProjectRegion: "us-central1",
		Options: models.StackOptions{
			ChatGPT: true, // Optional, for AI integrations
		},
	}

	pet := &models.Object{
		Context: "details about a pet in the rescue center",
		Mode:    "root",
		Parents: []string{},
		Name:    "pet",
		Fields: []*models.Field{
			{
				Name:     "name",
				JSON:     "string_30",
				Required: true,
			},
			{
				Name:     "species",
				JSON:     "string_30",
				Required: true,
			},
			{
				Name:     "breed",
				JSON:     "string_60",
				Required: true,
			},
			{
				Name:     "age",
				JSON:     "number_int",
				Required: true,
			},
			{
				Name:     "medicalHistory",
				JSON:     "array_csv",
				Required: true,
			},
			{
				Name:     "adoptionStatus",
				JSON:     "string_30",
				Required: true,
			},
		},
		Options: models.Options{},
	}

	adopter := &models.Object{
		Context: "information about an adopter",
		Mode:    "root",
		Parents: []string{},
		Name:    "adopter",
		Fields: []*models.Field{
			{
				Name:     "fullName",
				JSON:     "string_100",
				Required: true,
			},
			{
				Name:     "contactInfo",
				JSON:     "string_1000",
				Required: true,
			},
			{
				Name:     "address",
				JSON:     "string_1000",
				Required: true,
			},
		},
		Options: models.Options{},
	}

	donation := &models.Object{
		Context: "record of a donation made to the rescue center",
		Mode:    "root",
		Parents: []string{},
		Name:    "donation",
		Fields: []*models.Field{
			{
				Name:     "amount",
				JSON:     "number_float",
				Required: true,
			},
			{
				Name:     "donorName",
				JSON:     "string_100",
				Required: true,
			},
		},
		Options: models.Options{},
	}

	tree.Objects = append(tree.Objects, pet, adopter, donation)

	if err := models.Prepare(&tree); err != nil {
		panic(err)
	}

	if err := leap.Build(&tree); err != nil {
		panic(err)
	}

	if err := copy.Copy("node_modules", "build/app/node_modules"); err != nil {
		log.Println(err)
	}

	// export debug json
	b, err := json.Marshal(tree)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile("../out.json", b, 0755); err != nil {
		panic(err)
	}
}
