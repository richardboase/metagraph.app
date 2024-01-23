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
		WebAPI:     "https://newtown.vercel.app/",
		HostAPI:    "https://server-go-gen-test-da7z6jf32a-nw.a.run.app/",
		RepoURI:    "github.com/golangdaddy/newtown",
		SiteName:   "NewTown",
		ProjectID:  "npg-generic",
		DatabaseID: "go-gen-test",
		Entrypoints: []string{
			"town",
			"game",
		},
	}

	game := &models.Object{
		Mode:    "root",
		Parents: []string{},
		Name:    "game",
		Fields: []*models.Field{
			{
				Name:     "name",
				JSON:     "string_30",
				Required: true,
			},
		},
		Options: models.Options{
			Assetlayer: models.Assetlayer{},
		},
	}

	lobby := &models.Object{
		Parents: []string{
			game.Name,
		},
		Name: "lobby",
		Fields: []*models.Field{
			{
				Name: "name",
				JSON: "string_30",
			},
		},
		Options: models.Options{
			Assetlayer: models.Assetlayer{
				Wallet: true,
			},
		},
	}

	town := &models.Object{
		Context: "A town where people live.",
		Mode:    "root",
		Parents: []string{},
		Name:    "town",
		Fields: []*models.Field{
			{
				Name:     "name",
				JSON:     "string_30",
				Required: true,
			},
		},
		Options: models.Options{
			Assetlayer: models.Assetlayer{
				Wallet: true,
			},
		},
	}

	quarter := &models.Object{
		Context: "A quarter, or part of a city; a region defined by its a generalisation of its purpose or activities partaken within.",
		Parents: []string{
			town.Name,
		},
		Name: "quarter",
		Fields: []*models.Field{
			{
				Name: "name",
				JSON: "string_30",
			},
		},
		Options: models.Options{
			Assetlayer: models.Assetlayer{
				Wallet: true,
			},
		},
	}

	street := &models.Object{
		Context: "A street, part of the transaportation network of a town or city.",
		Parents: []string{
			quarter.Name,
		},
		Name: "street",
		Fields: []*models.Field{
			{
				Name: "name",
				JSON: "string_30",
			},
		},
		Options: models.Options{
			Assetlayer: models.Assetlayer{
				Wallet: true,
				Token:  true,
			},
		},
	}

	building := &models.Object{
		Context: "A building which exists in a street, could be residential, commercial, or industrial.",
		Parents: []string{
			street.Name,
		},
		Name: "building",
		Fields: []*models.Field{
			{
				Name: "name",
				JSON: "string_30",
			},
			{
				Name: "number",
				JSON: "number_int",
			},
			{
				Name:     "xunits",
				JSON:     "number_float",
				Required: true,
			},
			{
				Name:     "yunits",
				JSON:     "number_float",
				Required: true,
			},
			{
				Name:     "doors",
				JSON:     "number_int",
				Required: true,
			},
		},
		Options: models.Options{
			Assetlayer: models.Assetlayer{
				Wallet: true,
			},
		},
	}

	floor := &models.Object{
		Context: "A level or floor of a building where rooms or spaces are located.",
		Parents: []string{
			building.Name,
		},
		Name: "floor",
		Fields: []*models.Field{
			// using order from context
			{
				Name:     "rooms",
				JSON:     "number_int",
				Required: true,
			},
		},
		Options: models.Options{
			Assetlayer: models.Assetlayer{
				Wallet: true,
			},
		},
	}

	room := &models.Object{
		Parents: []string{
			floor.Name,
		},
		Name: "room",
		Fields: []*models.Field{
			{
				Name:     "name",
				JSON:     "string_30",
				Required: true,
			},
		},
		Options: models.Options{
			Assetlayer: models.Assetlayer{
				Wallet: true,
			},
		},
	}

	tree.Objects = append(tree.Objects, game)
	tree.Objects = append(tree.Objects, lobby)

	tree.Objects = append(tree.Objects, town)
	tree.Objects = append(tree.Objects, quarter)
	tree.Objects = append(tree.Objects, street)
	tree.Objects = append(tree.Objects, building)
	tree.Objects = append(tree.Objects, floor)
	tree.Objects = append(tree.Objects, room)

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
