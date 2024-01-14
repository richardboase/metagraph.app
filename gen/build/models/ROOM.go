
package models

import (
	"net/http"
	"regexp"
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
	return object
}

type FieldsROOM struct {
	Name string `json:"name"`
	
}

func (x *ROOM) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {

	var exists bool
	
	x.Fields.Name, exists = AssertSTRING(w, m, "name")
	if !exists {
		return false
	}
	
	{
		exp := ""
		if len(exp) > 0 {
			if !regexp.MustCompile(exp).MatchString(x.Fields.Name) {
				return false
			}
		}
	}
	if !AssertRange(w, 1, 30, x.Fields.Name) {
		return false
	}

	return true
}
