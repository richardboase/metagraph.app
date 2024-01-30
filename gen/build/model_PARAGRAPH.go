
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

type PARAGRAPH struct {
	Meta    Internals
	Fields FieldsPARAGRAPH `json:"fields" firestore:"fields"`
}

func NewPARAGRAPH(parent *Internals, fields FieldsPARAGRAPH) *PARAGRAPH {
	var object *PARAGRAPH
	if parent == nil {
		object = &PARAGRAPH{
			Meta: (Internals{}).NewInternals("paragraphs"),
			Fields: fields,
		}
	} else {
		object = &PARAGRAPH{
			Meta: parent.NewInternals("paragraphs"),
			Fields: fields,
		}
	}
	object.Meta.Context.Children = []string{
		
	}
	return object
}

type FieldsPARAGRAPH struct {
	Content string `json:"content" firestore:"content"`
	
}

func (x *PARAGRAPH) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *PARAGRAPH) ValidateObject(m map[string]interface{}) error {

	var err error
	var exists bool
	

	_, exists = m["content"]
	if true && !exists {
		return errors.New("required field 'content' not supplied")
	}
	if exists {
		x.Fields.Content, err = assertSTRING(m, "content")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Content)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Content)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Content)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Content)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.Content); err != nil {
			
			return err
			
		}
		if err := assertRangeMax(10000, x.Fields.Content); err != nil {
			return err
		}
		
	}
	

	x.Meta.Modify()

	return nil
}
/*
func (x *PARAGRAPH) ValidateByCount(w http.ResponseWriter, m map[string]interface{}, count int) bool {

	var counter int
	var exists bool
	
	x.Fields.Content, exists = AssertSTRING(w, m, "content")
	if exists {
		counter++
	}

	{
		exp := ""
		if len(exp) > 0 {
			if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Content)) {
				return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Content)
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
			if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Content)) {
				return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Content)
			}
		}
	}

	
	
	if !AssertRangeMin(w, 1, x.Fields.Content) {
		return false
	}
	
	if !AssertRangeMax(w, 10000, x.Fields.Content) {
		return false
	}
	

	x.Meta.Modify()

	return counter == count
}
*/