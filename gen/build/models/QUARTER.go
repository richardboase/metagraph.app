
package models

import (
	"net/http"
	"regexp"
)

type QUARTER struct {
	Meta    Internals
	Fields FieldsQUARTER `json:"fields" firestore:"fields"`
}

func NewQUARTER(parent *Internals, fields FieldsQUARTER) *QUARTER {
	var object *QUARTER
	if parent == nil {
		object = &QUARTER{
			Meta: (Internals{}).NewInternals("quarters"),
			Fields: fields,
		}
	} else {
		object = &QUARTER{
			Meta: parent.NewInternals("quarters"),
			Fields: fields,
		}
	}
	return object
}

type FieldsQUARTER struct {
	Name string `json:"name"`
	
}

func (x *QUARTER) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {

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
