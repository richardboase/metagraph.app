
package main

import (
	"fmt"
	"errors"
	"net/http"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
)

type STREET struct {
	Meta    Internals
	Fields FieldsSTREET `json:"fields" firestore:"fields"`
}

func NewSTREET(parent *Internals, fields FieldsSTREET) *STREET {
	var object *STREET
	if parent == nil {
		object = &STREET{
			Meta: (Internals{}).NewInternals("streets"),
			Fields: fields,
		}
	} else {
		object = &STREET{
			Meta: parent.NewInternals("streets"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		"building",
		
	}
	return object
}

type FieldsSTREET struct {
	Name string `json:"name" firestore:"name"`
	
}

func (x *STREET) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *STREET) ValidateObject(m map[string]interface{}) error {

	var err error
	
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
		
		if err := assertRangeMin(min, x.Fields.Name); err != nil {
			return err
		}
		if err := assertRangeMax(30, x.Fields.Name); err != nil {
			return err
		}
		
	}
	

	x.Meta.Modify()

	return nil
}

func (x *STREET) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

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
	
	if !AssertRangeMax(w, 30, x.Fields.Name) {
		return false
	}
	

	x.Meta.Modify()

	return counter == count
}