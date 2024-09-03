package structure

import (
	"github.com/golangdaddy/leap/models"
)

func buildStructure(config models.Config) *models.Stack {

	tree := &models.Stack{
		Config: config,
		Options: models.StackOptions{
			ChatGPT: true,
		},
	}

	// Define the animal object with context for each field
	animal := &models.Object{
		Context: "Define the main object for storing information about each rescued animal",
		Mode:    "root",
		Parents: []string{},
		Name:    "animal",
		Fields: []*models.Field{
			{
				Context:  "The name of the animal, must be a string up to 30 characters",
				Name:     "name",
				JSON:     "string_30",
				Required: true,
			},
			{
				Context:  "Species of the animal, must be a string up to 30 characters",
				Name:     "species",
				JSON:     "string_30",
				Required: true,
			},
			{
				Context:  "Age of the animal, integer, not required",
				Name:     "age",
				JSON:     "number_int",
				Required: false,
			},
		},
		Options: models.Options{
			Admin: true,
		},
	}

	// Define the health checkup object with context for each field
	healthCheckup := &models.Object{
		Context: "A record of each health checkup per animal, detailing health-related observations",
		Mode:    "many",
		Parents: []string{animal.Name},
		Name:    "healthCheckup",
		Fields: []*models.Field{
			{
				Context:  "Detailed notes from the health checkup, up to 1000 characters",
				Name:     "notes",
				JSON:     "string_1000",
				Required: true,
			},
		},
		Options: models.Options{},
	}

	// Define the adopter object with context for each field
	adopter := &models.Object{
		Context: "Stores information about individuals who adopt animals",
		Mode:    "root",
		Parents: []string{},
		Name:    "adopter",
		Fields: []*models.Field{
			{
				Context:  "Full name of the adopter, must be a string up to 60 characters",
				Name:     "name",
				JSON:     "string_60",
				Required: true,
			},
			{
				Context:  "Contact number of the adopter, must be a string up to 20 characters",
				Name:     "contactNumber",
				JSON:     "string_20",
				Required: true,
			},
			{
				Context:  "Address of the adopter, up to 200 characters",
				Name:     "address",
				JSON:     "string_200",
				Required: true,
			},
		},
		Options: models.Options{
			Admin: true,
		},
	}

	// Add all objects to the tree
	tree.Objects = append(tree.Objects, animal, healthCheckup, adopter)

	return tree
}
