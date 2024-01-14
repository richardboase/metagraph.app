
package models

import (
	"net/http"
	"regexp"
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
	Xunits float64 `json:"xunits"`
	Yunits float64 `json:"yunits"`
	Doors int `json:"doors"`
	
}

func (x *BUILDING) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {

	var exists bool
	
	x.Fields.Xunits, exists = AssertFLOAT64(w, m, "xunits")
	if !exists {
		return false
	}
	
	x.Fields.Yunits, exists = AssertFLOAT64(w, m, "yunits")
	if !exists {
		return false
	}
	
	x.Fields.Doors, exists = AssertINT(w, m, "doors")
	if !exists {
		return false
	}
	

	return true
}
