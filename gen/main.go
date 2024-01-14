package main

import (
	"github.com/golangdaddy/leap/models"
)

func main() {

	tree := models.Stack{
		ProjectID: "npg-generic",
		DatabaseID: "go-gen-test",	
	}

	town := &models.Object{
		Parents: []string{},
		Name: "town",
		Fields: []*Field{

		},
		Options: Options{
			Token: true,
		}
	}

	tree..Objects = append(tree.Objects, town)

}
