package project

import (
	"github.com/golangdaddy/leap/models"
)

func buildStructure(config models.Config) *models.Stack {

	tree := &models.Stack{
		WebsiteName: "MetaGraph.app",
		Config:      config,
		Options: models.StackOptions{
			ChatGPT: false,
			Handcash: &models.OptionsHandcash{
				AppID:     "660c209b9295c1bcf6312def",
				AppSecret: "7b7489072ece66e7f93867ba6ff638a1f80943ebb51629e6bfc6b17d85dbb1b1",
			},
		},
	}

	// Define the animal object with context for each field
	animal := &models.Object{
		Context: "Define the main object for storing information about each rescued animal",
		Plural:  "animals",
		Parents: []string{},
		Name:    "animal",
		Fields: []*models.Field{
			models.Required("string", "30").SetName("name").SetCtx("The name of the animal"),
			models.Required("string", "30").SetName("species").SetCtx("The species of the animal"),
			models.Required("uint").SetName("age").SetCtx("The age of the animal"),
			models.Required("date").SetName("birthday").SetCtx("The D.O.B. of the animal"),
			models.Required("address").SetName("address").SetCtx("The D.O.B. of the animal"),
		},
		Options: models.Options{
			Admin: true,
		},
	}

	// Define the health checkup object with context for each field
	healthCheckup := &models.Object{
		Plural:  "checkups",
		Context: "A record of each health checkup per animal, detailing health-related observations",
		Parents: []string{animal.Name},
		Name:    "healthCheckup",
		Fields: []*models.Field{
			models.Required("string", "10000").SetName("notes").SetCtx("notes about the animal's health checkup"),
		},
		Options: models.Options{},
	}

	// Define the adopter object with context for each field
	adopter := &models.Object{
		Context: "Stores information about individuals who adopt animals",
		Plural:  "adopters",
		Parents: []string{},
		Name:    "adopter",
		Fields: []*models.Field{
			models.Required("person.name").SetName("adopter name").SetCtx("The name of the adopter"),
			models.Required("phone").SetName("adopter phone number").SetCtx("The phone number of the adopter"),
		},
		Options: models.Options{
			Admin: true,
		},
	}

	// Add all objects to the tree
	tree.Objects = append(tree.Objects, animal, healthCheckup, adopter)

	return tree
}
