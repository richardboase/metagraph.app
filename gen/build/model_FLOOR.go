
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
	object.Meta.Context.Children = []string{
		"room",
		
	}
	return object
}

type FieldsFLOOR struct {
	Rooms int `json:"rooms" firestore:"rooms"`
	
}

func (x *FLOOR) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *FLOOR) ValidateObject(m map[string]interface{}) error {

	var err error
	var exists bool
	

	_, exists = m["rooms"]
	if true && !exists {
		return errors.New("required field 'rooms' not supplied")
	}
	if exists {
		x.Fields.Rooms, err = assertINT(m, "rooms")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Rooms)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Rooms)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
		}
	}
	

	x.Meta.Modify()

	return nil
}

func (x *FLOOR) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

	var counter int
	var exists bool
	
	x.Fields.Rooms, exists = AssertINT(w, m, "rooms")
	if exists {
		counter++
	}

	

	x.Meta.Modify()

	return counter == count
}