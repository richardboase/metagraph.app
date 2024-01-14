
package models

import (
	"net/http"
	"regexp"
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
	return object
}

type FieldsSTREET struct {
	Name string `json:"name"`
	
}

func (x *STREET) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {

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
