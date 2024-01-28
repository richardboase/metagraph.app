
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

type BUILDING struct {
	Meta    Internals
	Fields FieldsBUILDING `json:"fields" firestore:"fields"`
}

func NewBUILDING(parent *Internals, fields FieldsBUILDING) *BUILDING {
	var object *BUILDING
	if parent == nil {
		object = &BUILDING{
			Meta: (Internals{}).NewInternals("buildings"),
			Fields: fields,
		}
	} else {
		object = &BUILDING{
			Meta: parent.NewInternals("buildings"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		"floor",
		
	}
	return object
}

type FieldsBUILDING struct {
	Name string `json:"name" firestore:"name"`
	Number int `json:"number" firestore:"number"`
	Xunits float64 `json:"xunits" firestore:"xunits"`
	Yunits float64 `json:"yunits" firestore:"yunits"`
	Doors int `json:"doors" firestore:"doors"`
	
}

func (x *BUILDING) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *BUILDING) ValidateObject(m map[string]interface{}) error {

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
	

	_, exists = m["number"]
	if false && !exists {
		return errors.New("required field 'number' not supplied")
	}
	if exists {
		x.Fields.Number, err = assertINT(m, "number")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Number)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Number)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
		}
	}
	

	_, exists = m["xunits"]
	if true && !exists {
		return errors.New("required field 'xunits' not supplied")
	}
	if exists {
		x.Fields.Xunits, err = assertFLOAT64(m, "xunits")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Xunits)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Xunits)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
		}
	}
	

	_, exists = m["yunits"]
	if true && !exists {
		return errors.New("required field 'yunits' not supplied")
	}
	if exists {
		x.Fields.Yunits, err = assertFLOAT64(m, "yunits")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Yunits)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Yunits)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
		}
	}
	

	_, exists = m["doors"]
	if true && !exists {
		return errors.New("required field 'doors' not supplied")
	}
	if exists {
		x.Fields.Doors, err = assertINT(m, "doors")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Doors)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Doors)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
		}
	}
	

	x.Meta.Modify()

	return nil
}

func (x *BUILDING) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

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
	
	if !AssertRangeMax(w, 30, x.Fields.Name) {
		return false
	}
	
	x.Fields.Number, exists = AssertINT(w, m, "number")
	if exists {
		counter++
	}

	
	x.Fields.Xunits, exists = AssertFLOAT64(w, m, "xunits")
	if exists {
		counter++
	}

	
	x.Fields.Yunits, exists = AssertFLOAT64(w, m, "yunits")
	if exists {
		counter++
	}

	
	x.Fields.Doors, exists = AssertINT(w, m, "doors")
	if exists {
		counter++
	}

	

	x.Meta.Modify()

	return counter == count
}