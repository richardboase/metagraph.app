
package main

import (
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
	return object
}

type FieldsBUILDING struct {
	Name string `json:"name"`
	Number int `json:"number"`
	Xunits float64 `json:"xunits"`
	Yunits float64 `json:"yunits"`
	Doors int `json:"doors"`
	
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
	

	return true
}
