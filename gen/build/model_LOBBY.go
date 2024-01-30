
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

type LOBBY struct {
	Meta    Internals
	Fields FieldsLOBBY `json:"fields" firestore:"fields"`
}

func NewLOBBY(parent *Internals, fields FieldsLOBBY) *LOBBY {
	var object *LOBBY
	if parent == nil {
		object = &LOBBY{
			Meta: (Internals{}).NewInternals("lobbys"),
			Fields: fields,
		}
	} else {
		object = &LOBBY{
			Meta: parent.NewInternals("lobbys"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		"character",
		
	}
	return object
}

type FieldsLOBBY struct {
	Name string `json:"name" firestore:"name"`
	
}

func (x *LOBBY) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *LOBBY) ValidateObject(m map[string]interface{}) error {

	var err error
	var exists bool
	

	_, exists = m["name"]
	if false && !exists {
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
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Name)) {
						return errors.New("failed to regexpHex: "+string(b))
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
	}
	

	x.Meta.Modify()

	return nil
}

func (x *LOBBY) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

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
				log.Println("EXPR", exp)
				b, err := hex.DecodeString(exp)
				if err != nil {
					log.Println(err)
				}
				if !RegExp(string(b), x.Fields.Name) {
					return false
				}
			}
		}
	}
	
	if !AssertRangeMax(w, 30, x.Fields.Name) {
		return false
	}
	

	x.Meta.Modify()

	return counter == count
}