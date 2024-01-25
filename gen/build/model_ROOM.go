
package main

import (
	"fmt"
	"errors"
	"net/http"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
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
	Name string `json:"name" firestore:"name"`
	
}

func (x *ROOM) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *ROOM) ValidateObject(m map[string]interface{}) error {

	var err error
	var exists bool
	

	_, exists = m["name"]
	if true && !exists {
		return errors.New("required field 'name' not supplied")
	}
	if true && exists {
		x.Fields.Name, err = assertSTRING(m, "name")
		if err != nil {
			return errors.New(err.Error())
		} else {
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Name)) {
					return errors.New("failed to regexp")
				}
			}
			
			var min float64
			min = 1
			if err := assertRangeMin(min, x.Fields.Name); err != nil {
				return err
			}
			if err := assertRangeMax(30, x.Fields.Name); err != nil {
				return err
			}
			
		}
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
	
	if !AssertRangeMin(w, 1, x.Fields.Name) {
		return false
	}
	
	if !AssertRangeMax(w, 30, x.Fields.Name) {
		return false
	}
	

	x.Meta.Modify()

	return counter == count
}