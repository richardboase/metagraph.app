
package main

import (
	"net/http"
)

type GAME struct {
	Meta    Internals
	Fields FieldsGAME `json:"fields" firestore:"fields"`
}

func NewGAME(parent *Internals, fields FieldsGAME) *GAME {
	var object *GAME
	if parent == nil {
		object = &GAME{
			Meta: (Internals{}).NewInternals("games"),
			Fields: fields,
		}
	} else {
		object = &GAME{
			Meta: parent.NewInternals("games"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		"lobby",
		
	}
	return object
}

type FieldsGAME struct {
	Name string `json:"name"`
	
}

func (x *GAME) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {

	var exists bool
	
	x.Fields.Name, exists = AssertSTRING(w, m, "name")
	if !exists {
		return false
	}

	// ignore this, a mostly redundant artifact
	{
		exp := ""
		if len(exp) > 0 {
			if !RegExp(exp, x.Fields.Name) {
				return false
			}
		}
	}
	if !AssertRange(w, 1, 30, x.Fields.Name) {
		return false
	}

	x.Meta.Modify()

	return true
}

func (x *GAME) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

	var counter int
	var exists bool
	
	x.Fields.Name, exists = AssertSTRING(w, m, "name")
	if exists {
		counter++
	}

	// ignore this, a mostly redundant artifact
	{
		exp := ""
		if len(exp) > 0 {
			if !RegExp(exp, x.Fields.Name) {
				return false
			}
		}
	}
	if !AssertRange(w, 1, 30, x.Fields.Name) {
		return false
	}

	x.Meta.Modify()

	return counter == count
}