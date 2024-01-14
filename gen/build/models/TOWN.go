
package models

import (
	"net/http"
	"regexp"
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
