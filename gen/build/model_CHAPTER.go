
package main

import (
	"fmt"
	"errors"
	"net/http"
	"encoding/hex"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
)

func init() {
	// template race fix
	hex.DecodeString("FF")
}

type CHAPTER struct {
	Meta    Internals
	Fields FieldsCHAPTER `json:"fields" firestore:"fields"`
}

func NewCHAPTER(parent *Internals, fields FieldsCHAPTER) *CHAPTER {
	var object *CHAPTER
	if parent == nil {
		object = &CHAPTER{
			Meta: (Internals{}).NewInternals("chapters"),
			Fields: fields,
		}
	} else {
		object = &CHAPTER{
			Meta: parent.NewInternals("chapters"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		"paragraph",
		
	}
	return object
}

type FieldsCHAPTER struct {
	Name string `json:"name" firestore:"name"`
	
}

func (x *CHAPTER) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *CHAPTER) ValidateObject(m map[string]interface{}) error {

	var err error
	var exists bool
	

	_, exists = m["name"]
	if true && !exists {
		return errors.New("required field 'name' not supplied")
	}
	if exists {
		x.Fields.Name, err = assertSTRING(m, "name")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Name)) {
						return errors.New("failed to regexp")
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Name)) {
						return errors.New("failed to regexpHex")
					}
				}
			}
			
			if err := assertRangeMin(1, x.Fields.Name); err != nil {
				return err
			}
			if err := assertRangeMax(60, x.Fields.Name); err != nil {
				return err
			}
			
		}
	}
	

	x.Meta.Modify()

	return nil
}

func (x *CHAPTER) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

	var counter int
	var exists bool
	
	x.Fields.Name, exists = AssertSTRING(w, m, "name")
	if exists {
		counter++
	}

	{
		// handle basic regexp
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, x.Fields.Name) {
					return false
				}
			}
		}
		// handle regexp that cannot be encoded as a JSON field
		{
			exp := ""
			if len(exp) > 0 {
				b, _ := hex.DecodeString(exp)
				if !RegExp(string(b), x.Fields.Name) {
					return false
				}
			}
		}
	}
	
	if !AssertRangeMin(w, 1, x.Fields.Name) {
		return false
	}
	
	if !AssertRangeMax(w, 60, x.Fields.Name) {
		return false
	}
	

	x.Meta.Modify()

	return counter == count
}