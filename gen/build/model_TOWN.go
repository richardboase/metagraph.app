
package main

import (
	"fmt"
	"errors"
	"net/http"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
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
	Name string `json:"name" firestore:"name"`
	
}

func (x *TOWN) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *TOWN) ValidateObject(m map[string]interface{}) error {

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
	
	if !AssertRangeMin(w, 1, x.Fields.Name) {
		return false
	}
	
	if !AssertRangeMax(w, 30, x.Fields.Name) {
		return false
	}
	

	x.Meta.Modify()

	return counter == count
}