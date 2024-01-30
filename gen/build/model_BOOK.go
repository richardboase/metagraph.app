
package main

import (
	"log"
	"fmt"
	"errors"
	"net/http"
	"encoding/hex"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
)

func init() {
	// template race fix
	log.Flags()
	hex.DecodeString("FF")
}

type BOOK struct {
	Meta    Internals
	Fields FieldsBOOK `json:"fields" firestore:"fields"`
}

func NewBOOK(parent *Internals, fields FieldsBOOK) *BOOK {
	var object *BOOK
	if parent == nil {
		object = &BOOK{
			Meta: (Internals{}).NewInternals("books"),
			Fields: fields,
		}
	} else {
		object = &BOOK{
			Meta: parent.NewInternals("books"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		"bookcharacter",
		"chapter",
		
	}
	return object
}

type FieldsBOOK struct {
	Name string `json:"name" firestore:"name"`
	
}

func (x *BOOK) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *BOOK) ValidateObject(m map[string]interface{}) error {

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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Name)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Name)
				}
			}
		}
		{
			exp := ""
			if len(exp) > 0 {
				log.Println("EXPR", exp)
				b, err := hex.DecodeString(exp)
				if err != nil {
					log.Println(err)
				}
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Name)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Name)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.Name); err != nil {
			return err
		}
		if err := assertRangeMax(30, x.Fields.Name); err != nil {
			return err
		}
		
	}
	

	x.Meta.Modify()

	return nil
}
/*
func (x *BOOK) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

	var counter int
	var exists bool
	
	x.Fields.Name, exists = AssertSTRING(w, m, "name")
	if exists {
		counter++
	}

	{
		exp := ""
		if len(exp) > 0 {
			if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Name)) {
				return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Name)
			}
		}
	}
	{
		exp := ""
		if len(exp) > 0 {
			log.Println("EXPR", exp)
			b, err := hex.DecodeString(exp)
			if err != nil {
				log.Println(err)
			}
			if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Name)) {
				return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Name)
			}
		}
	}

	
	
	if !AssertRangeMin(w, 1, x.Fields.Name) {
		return false
	}
	
	if !AssertRangeMax(w, 30, x.Fields.Name) {
		return false
	}
	

	x.Meta.Modify()

	return counter == count
}
*/