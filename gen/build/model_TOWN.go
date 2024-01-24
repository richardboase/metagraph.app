
package main

import (
	"errors"
	"net/http"
)

type TOWN struct {
	Meta    Internals
	Fields FieldsTOWN `json:"fields" firestore:"fields"`
}

func NewTOWN(parent *Internals, fields FieldsTOWN) *TOWN {
	var object *TOWN
	if parent == nil {
		object = &TOWN{
			Meta: (Internals{}).NewInternals("towns"),
			Fields: fields,
		}
	} else {
		object = &TOWN{
			Meta: parent.NewInternals("towns"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		"teststreet",
		"quarter",
		
	}
	return object
}

type FieldsTOWN struct {
	Name string `json:"name"`
	
}

func (x *TOWN) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {

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

func (x *TOWN) ValidateObject(m map[string]interface{}) error {

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

func (x *TOWN) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

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