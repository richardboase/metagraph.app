
package main

import (
	"fmt"
	"errors"
	"net/http"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
)

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
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Name)) {
					return errors.New("failed to regexp")
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
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Age)) {
					return errors.New("failed to regexp")
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
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Gender)) {
					return errors.New("failed to regexp")
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
	

	_, exists = m["profession"]
	if true && !exists {
		return errors.New("required field 'profession' not supplied")
	}
	if exists {
		x.Fields.Profession, err = assertSTRING(m, "profession")
		if err != nil {
			return errors.New(err.Error())
		} else {
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Profession)) {
					return errors.New("failed to regexp")
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
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Socialclass)) {
					return errors.New("failed to regexp")
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
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Backstory)) {
					return errors.New("failed to regexp")
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

	// ignore this, a mostly redundant artifact
	{
		exp := ""
		if len(exp) > 0 {
			if !RegExp(exp, x.Fields.Name) {
				return false
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

	// ignore this, a mostly redundant artifact
	
	x.Fields.Gender, exists = AssertSTRING(w, m, "gender")
	if exists {
		counter++
	}

	// ignore this, a mostly redundant artifact
	{
		exp := ""
		if len(exp) > 0 {
			if !RegExp(exp, x.Fields.Gender) {
				return false
			}
		}
	}
	
	if !AssertRangeMin(w, 1, x.Fields.Gender) {
		return false
	}
	
	if !AssertRangeMax(w, 10, x.Fields.Gender) {
		return false
	}
	
	x.Fields.Profession, exists = AssertSTRING(w, m, "profession")
	if exists {
		counter++
	}

	// ignore this, a mostly redundant artifact
	{
		exp := ""
		if len(exp) > 0 {
			if !RegExp(exp, x.Fields.Profession) {
				return false
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

	// ignore this, a mostly redundant artifact
	{
		exp := ""
		if len(exp) > 0 {
			if !RegExp(exp, x.Fields.Socialclass) {
				return false
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

	// ignore this, a mostly redundant artifact
	{
		exp := ""
		if len(exp) > 0 {
			if !RegExp(exp, x.Fields.Backstory) {
				return false
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