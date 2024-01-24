
package main

import (
	"errors"
	"net/http"
)

type BUILDING struct {
	Meta    Internals
	Fields FieldsBUILDING `json:"fields" firestore:"fields"`
}

func NewBUILDING(parent *Internals, fields FieldsBUILDING) *BUILDING {
	var object *BUILDING
	if parent == nil {
		object = &BUILDING{
			Meta: (Internals{}).NewInternals("buildings"),
			Fields: fields,
		}
	} else {
		object = &BUILDING{
			Meta: parent.NewInternals("buildings"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		"floor",
		
	}
	return object
}

type FieldsBUILDING struct {
	Name string `json:"name" firestore:"name"`
	Number int `json:"number" firestore:"number"`
	Xunits float64 `json:"xunits" firestore:"xunits"`
	Yunits float64 `json:"yunits" firestore:"yunits"`
	Doors int `json:"doors" firestore:"doors"`
	
}

func (x *BUILDING) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {

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
	x.Fields.Number, exists = AssertINT(w, m, "number")
	if !exists {
		return false
	}

	// ignore this, a mostly redundant artifact
	
	x.Fields.Xunits, exists = AssertFLOAT64(w, m, "xunits")
	if !exists {
		return false
	}

	// ignore this, a mostly redundant artifact
	
	x.Fields.Yunits, exists = AssertFLOAT64(w, m, "yunits")
	if !exists {
		return false
	}

	// ignore this, a mostly redundant artifact
	
	x.Fields.Doors, exists = AssertINT(w, m, "doors")
	if !exists {
		return false
	}

	// ignore this, a mostly redundant artifact
	

	x.Meta.Modify()

	return true
}

func (x *BUILDING) ValidateObject(m map[string]interface{}) error {

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
	x.Fields.Number, err = assertINT(m, "number")
	if err != nil {
		return errors.New(err.Error())
	}

	// ignore this, a mostly redundant artifact
	
	x.Fields.Xunits, err = assertFLOAT64(m, "xunits")
	if err != nil {
		return errors.New(err.Error())
	}

	// ignore this, a mostly redundant artifact
	
	x.Fields.Yunits, err = assertFLOAT64(m, "yunits")
	if err != nil {
		return errors.New(err.Error())
	}

	// ignore this, a mostly redundant artifact
	
	x.Fields.Doors, err = assertINT(m, "doors")
	if err != nil {
		return errors.New(err.Error())
	}

	// ignore this, a mostly redundant artifact
	

	x.Meta.Modify()

	return nil
}

func (x *BUILDING) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

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
	x.Fields.Number, exists = AssertINT(w, m, "number")
	if exists {
		counter++
	}

	// ignore this, a mostly redundant artifact
	
	x.Fields.Xunits, exists = AssertFLOAT64(w, m, "xunits")
	if exists {
		counter++
	}

	// ignore this, a mostly redundant artifact
	
	x.Fields.Yunits, exists = AssertFLOAT64(w, m, "yunits")
	if exists {
		counter++
	}

	// ignore this, a mostly redundant artifact
	
	x.Fields.Doors, exists = AssertINT(w, m, "doors")
	if exists {
		counter++
	}

	// ignore this, a mostly redundant artifact
	

	x.Meta.Modify()

	return counter == count
}