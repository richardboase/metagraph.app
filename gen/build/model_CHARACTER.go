
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

type CHARACTER struct {
	Meta    Internals
	Fields FieldsCHARACTER `json:"fields" firestore:"fields"`
}

func NewCHARACTER(parent *Internals, fields FieldsCHARACTER) *CHARACTER {
	var object *CHARACTER
	if parent == nil {
		object = &CHARACTER{
			Meta: (Internals{}).NewInternals("characters"),
			Fields: fields,
		}
	} else {
		object = &CHARACTER{
			Meta: parent.NewInternals("characters"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		
	}
	return object
}

type FieldsCHARACTER struct {
	Name string `json:"name" firestore:"name"`
	Age int `json:"age" firestore:"age"`
	Gender string `json:"gender" firestore:"gender"`
	Diseases string `json:"diseases" firestore:"diseases"`
	Profession string `json:"profession" firestore:"profession"`
	Socialclass string `json:"socialclass" firestore:"socialclass"`
	Backstory string `json:"backstory" firestore:"backstory"`
	
}

func (x *CHARACTER) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *CHARACTER) ValidateObject(m map[string]interface{}) error {

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
			if err := assertRangeMax(30, x.Fields.Name); err != nil {
				return err
			}
			
		}
	}
	

	_, exists = m["age"]
	if true && !exists {
		return errors.New("required field 'age' not supplied")
	}
	if exists {
		x.Fields.Age, err = assertINT(m, "age")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Age)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Age)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
		}
	}
	

	_, exists = m["gender"]
	if true && !exists {
		return errors.New("required field 'gender' not supplied")
	}
	if exists {
		x.Fields.Gender, err = assertSTRING(m, "gender")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Gender)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Gender)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
			if err := assertRangeMin(1, x.Fields.Gender); err != nil {
				return err
			}
			if err := assertRangeMax(10, x.Fields.Gender); err != nil {
				return err
			}
			
		}
	}
	

	_, exists = m["diseases"]
	if true && !exists {
		return errors.New("required field 'diseases' not supplied")
	}
	if exists {
		x.Fields.Diseases, err = assertSTRING(m, "diseases")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Diseases)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := "5E283F3A283F3A225B5E225D2A227C5B5E2C5D2B292C292A283F3A225B5E225D2A227C5B5E2C5D2B29240D0A"
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Diseases)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
			if err := assertRangeMin(1, x.Fields.Diseases); err != nil {
				return err
			}
			if err := assertRangeMax(1e+06, x.Fields.Diseases); err != nil {
				return err
			}
			
		}
	}
	

	_, exists = m["profession"]
	if true && !exists {
		return errors.New("required field 'profession' not supplied")
	}
	if exists {
		x.Fields.Profession, err = assertSTRING(m, "profession")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Profession)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Profession)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
			if err := assertRangeMin(1, x.Fields.Profession); err != nil {
				return err
			}
			if err := assertRangeMax(100, x.Fields.Profession); err != nil {
				return err
			}
			
		}
	}
	

	_, exists = m["socialclass"]
	if true && !exists {
		return errors.New("required field 'socialclass' not supplied")
	}
	if exists {
		x.Fields.Socialclass, err = assertSTRING(m, "socialclass")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Socialclass)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Socialclass)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
			if err := assertRangeMin(1, x.Fields.Socialclass); err != nil {
				return err
			}
			if err := assertRangeMax(30, x.Fields.Socialclass); err != nil {
				return err
			}
			
		}
	}
	

	_, exists = m["backstory"]
	if true && !exists {
		return errors.New("required field 'backstory' not supplied")
	}
	if exists {
		x.Fields.Backstory, err = assertSTRING(m, "backstory")
		if err != nil {
			return errors.New(err.Error())
		} else {
			{
				exp := ""
				if len(exp) > 0 {
					if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Backstory)) {
						return errors.New("failed to regexp: "+exp)
					}
				}
			}
			{
				exp := ""
				if len(exp) > 0 {
					b, _ := hex.DecodeString(exp)
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Backstory)) {
						return errors.New("failed to regexpHex: "+string(b))
					}
				}
			}
			
			if err := assertRangeMin(1, x.Fields.Backstory); err != nil {
				return err
			}
			if err := assertRangeMax(10000, x.Fields.Backstory); err != nil {
				return err
			}
			
		}
	}
	

	x.Meta.Modify()

	return nil
}

func (x *CHARACTER) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

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
	
	if !AssertRangeMax(w, 30, x.Fields.Name) {
		return false
	}
	
	x.Fields.Age, exists = AssertINT(w, m, "age")
	if exists {
		counter++
	}

	
	x.Fields.Gender, exists = AssertSTRING(w, m, "gender")
	if exists {
		counter++
	}

	{
		// handle basic regexp
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, x.Fields.Gender) {
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
				if !RegExp(string(b), x.Fields.Gender) {
					return false
				}
			}
		}
	}
	
	if !AssertRangeMin(w, 1, x.Fields.Gender) {
		return false
	}
	
	if !AssertRangeMax(w, 10, x.Fields.Gender) {
		return false
	}
	
	x.Fields.Diseases, exists = AssertSTRING(w, m, "diseases")
	if exists {
		counter++
	}

	{
		// handle basic regexp
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, x.Fields.Diseases) {
					return false
				}
			}
		}
		// handle regexp that cannot be encoded as a JSON field
		{
			exp := "5E283F3A283F3A225B5E225D2A227C5B5E2C5D2B292C292A283F3A225B5E225D2A227C5B5E2C5D2B29240D0A"
			if len(exp) > 0 {
				log.Println("EXPR", exp)
				b, err := hex.DecodeString(exp)
				if err != nil {
					log.Println(err)
				}
				if !RegExp(string(b), x.Fields.Diseases) {
					return false
				}
			}
		}
	}
	
	if !AssertRangeMin(w, 1, x.Fields.Diseases) {
		return false
	}
	
	if !AssertRangeMax(w, 1e+06, x.Fields.Diseases) {
		return false
	}
	
	x.Fields.Profession, exists = AssertSTRING(w, m, "profession")
	if exists {
		counter++
	}

	{
		// handle basic regexp
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, x.Fields.Profession) {
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
				if !RegExp(string(b), x.Fields.Profession) {
					return false
				}
			}
		}
	}
	
	if !AssertRangeMin(w, 1, x.Fields.Profession) {
		return false
	}
	
	if !AssertRangeMax(w, 100, x.Fields.Profession) {
		return false
	}
	
	x.Fields.Socialclass, exists = AssertSTRING(w, m, "socialclass")
	if exists {
		counter++
	}

	{
		// handle basic regexp
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, x.Fields.Socialclass) {
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
				if !RegExp(string(b), x.Fields.Socialclass) {
					return false
				}
			}
		}
	}
	
	if !AssertRangeMin(w, 1, x.Fields.Socialclass) {
		return false
	}
	
	if !AssertRangeMax(w, 30, x.Fields.Socialclass) {
		return false
	}
	
	x.Fields.Backstory, exists = AssertSTRING(w, m, "backstory")
	if exists {
		counter++
	}

	{
		// handle basic regexp
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, x.Fields.Backstory) {
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
				if !RegExp(string(b), x.Fields.Backstory) {
					return false
				}
			}
		}
	}
	
	if !AssertRangeMin(w, 1, x.Fields.Backstory) {
		return false
	}
	
	if !AssertRangeMax(w, 10000, x.Fields.Backstory) {
		return false
	}
	

	x.Meta.Modify()

	return counter == count
}