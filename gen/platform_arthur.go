package main

import (
	"github.com/golangdaddy/leap/models"
)

func arthur() []*models.Object {

	arthur := &models.Object{
		Context: "arthurs space",
		Mode:    "root",
		Name:    "arthur",
		Fields: []*models.Field{
			{
				Name:     "name",
				JSON:     "string_30",
				Required: true,
			},
		},
		Options: models.Options{
			Admin: true,
		},
	}

	jelly := &models.Object{
		Context: "arthurs ",
		Parents: []string{
			arthur.Name,
		},
		Name:   "jelly",
		Plural: "jellies",
		Fields: []*models.Field{
			{
				Context:  "the name of the unique character",
				Name:     "name",
				JSON:     "string_30",
				Required: true,
			},
			{
				Context:  "either male or female",
				Name:     "gender",
				JSON:     "gender",
				Required: true,
			},
			{
				Name:           "element",
				Type:           "string",
				Input:          "select",
				InputReference: "jellynames",
				Filter:         true,
			},
			{
				Context:  "health points",
				Name:     "hp",
				JSON:     "number_int",
				Required: true,
			},
		},
		Options: models.Options{
			File:  true,
			Image: true,
		},
	}

	jellyname := &models.Object{
		Context: "arthurs ",
		Parents: []string{
			arthur.Name,
		},
		Name: "jellyname",
		Fields: []*models.Field{
			{
				Context:  "the elemental name of the jelly",
				Name:     "name",
				JSON:     "string_30",
				Required: true,
			},
		},
	}

	objects := []*tree.Objects
	objects = append(objects, arthur)
	objects = append(objects, jelly)
	objects = append(objects, jellyname)

	return objects
}
