
package models

import (
	"net/http"
	"regexp"
)

type FLOOR struct {
	Meta    Internals
	Fields FieldsFLOOR `json:"fields" firestore:"fields"`
}

func NewFLOOR(parent *Internals, fields FieldsFLOOR) *FLOOR {
	var object *FLOOR
	if parent == nil {
		object = &FLOOR{
			Meta: (Internals{}).NewInternals("floors"),
			Fields: fields,
		}
	} else {
		object = &FLOOR{
			Meta: parent.NewInternals("floors"),
			Fields: fields,
		}
	}
	return object
}

type FieldsFLOOR struct {
	Rooms int `json:"rooms"`
	
}

func (x *FLOOR) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {

	var exists bool
	
	x.Fields.Rooms, exists = AssertINT(w, m, "rooms")
	if !exists {
		return false
	}
	

	return true
}
