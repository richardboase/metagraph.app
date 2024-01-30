
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

type TESTSTREET struct {
	Meta    Internals
	Fields FieldsTESTSTREET `json:"fields" firestore:"fields"`
}

func NewTESTSTREET(parent *Internals, fields FieldsTESTSTREET) *TESTSTREET {
	var object *TESTSTREET
	if parent == nil {
		object = &TESTSTREET{
			Meta: (Internals{}).NewInternals("teststreets"),
			Fields: fields,
		}
	} else {
		object = &TESTSTREET{
			Meta: parent.NewInternals("teststreets"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		
	}
	return object
}

type FieldsTESTSTREET struct {
	Name string `json:"name" firestore:"name"`
	Description string `json:"description" firestore:"description"`
	Start string `json:"start" firestore:"start"`
	End string `json:"end" firestore:"end"`
	
}

func (x *TESTSTREET) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *TESTSTREET) ValidateObject(m map[string]interface{}) error {

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
			if err := assertRangeMax(60, x.Fields.Name); err != nil {
				return err
			}
			
		}
	}
	

	_, exists = m["description"]
	if false && !exists {
		return errors.New("required field 'description' not supplied")
	}
	if exists {
		x.Fields.Description, err = assertSTRING(m, "description")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Description)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Description)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
			if err := assertRangeMin(1, x.Fields.Description); err != nil {
				return err
			}
			if err := assertRangeMax(1000, x.Fields.Description); err != nil {
				return err
			}
			
		}
	}
	

	_, exists = m["start"]
	if false && !exists {
		return errors.New("required field 'start' not supplied")
	}
	if exists {
		x.Fields.Start, err = assertSTRING(m, "start")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Start)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Start)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
			if err := assertRangeMin(1, x.Fields.Start); err != nil {
				return err
			}
			if err := assertRangeMax(60, x.Fields.Start); err != nil {
				return err
			}
			
		}
	}
	

	_, exists = m["end"]
	if false && !exists {
		return errors.New("required field 'end' not supplied")
	}
	if exists {
		x.Fields.End, err = assertSTRING(m, "end")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.End)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.End)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
			if err := assertRangeMin(1, x.Fields.End); err != nil {
				return err
			}
			if err := assertRangeMax(60, x.Fields.End); err != nil {
				return err
			}
			
		}
	}
	

	x.Meta.Modify()

	return nil
}

func (x *TESTSTREET) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

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
	
	if !AssertRangeMin(w, 1, x.Fields.Name) {
		return false
	}
	
	if !AssertRangeMax(w, 60, x.Fields.Name) {
		return false
	}
	
	x.Fields.Description, exists = AssertSTRING(w, m, "description")
	if exists {
		counter++
	}

	{
		// handle basic regexp
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, x.Fields.Description) {
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
				if !RegExp(string(b), x.Fields.Description) {
					return false
				}
			}
		}
	}
	
	if !AssertRangeMax(w, 1000, x.Fields.Description) {
		return false
	}
	
	x.Fields.Start, exists = AssertSTRING(w, m, "start")
	if exists {
		counter++
	}

	{
		// handle basic regexp
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, x.Fields.Start) {
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
				if !RegExp(string(b), x.Fields.Start) {
					return false
				}
			}
		}
	}
	
	if !AssertRangeMax(w, 60, x.Fields.Start) {
		return false
	}
	
	x.Fields.End, exists = AssertSTRING(w, m, "end")
	if exists {
		counter++
	}

	{
		// handle basic regexp
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, x.Fields.End) {
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
				if !RegExp(string(b), x.Fields.End) {
					return false
				}
			}
		}
	}
	
	if !AssertRangeMax(w, 60, x.Fields.End) {
		return false
	}
	

	x.Meta.Modify()

	return counter == count
}