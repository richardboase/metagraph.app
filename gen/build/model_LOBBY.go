
package main

import (
	"errors"
	"net/http"
)

type LOBBY struct {
	Meta    Internals
	Fields FieldsLOBBY `json:"fields" firestore:"fields"`
}

func NewLOBBY(parent *Internals, fields FieldsLOBBY) *LOBBY {
	var object *LOBBY
	if parent == nil {
		object = &LOBBY{
			Meta: (Internals{}).NewInternals("lobbys"),
			Fields: fields,
		}
	} else {
		object = &LOBBY{
			Meta: parent.NewInternals("lobbys"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		
	}
	return object
}

type FieldsLOBBY struct {
	Name string `json:"name" firestore:"name`
	
}

func (x *LOBBY) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {

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

func (x *LOBBY) ValidateObject(m map[string]interface{}) error {

	var err error
	
	x.Fields.Name, err = assertSTRING(m, "name")
	if err != nil {
		return errors.New(err.Error())
	}

	// ignore this, a mostly redundant artifact
	{
		exp := ""
		if len(exp) > 0 {
			if !RegExp(exp, x.Fields.Name) {
				return errors.New("failed to regexp")
			}
		}
	}
	if err := assertRange(1, 30, x.Fields.Name); err != nil {
		return err
	}

	x.Meta.Modify()

	return nil
}

func (x *LOBBY) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

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