
package main

import (
	"errors"
	"net/http"
)

type ROOM struct {
	Meta    Internals
	Fields FieldsROOM `json:"fields" firestore:"fields"`
}

func NewROOM(parent *Internals, fields FieldsROOM) *ROOM {
	var object *ROOM
	if parent == nil {
		object = &ROOM{
			Meta: (Internals{}).NewInternals("rooms"),
			Fields: fields,
		}
	} else {
		object = &ROOM{
			Meta: parent.NewInternals("rooms"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		
	}
	return object
}

type FieldsROOM struct {
	Name string `json:"name" firestore:"name`
	
}

func (x *ROOM) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {

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

func (x *ROOM) ValidateObject(m map[string]interface{}) error {

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

func (x *ROOM) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

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