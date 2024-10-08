package main

import (
	"fmt"
	"net/http"
	"log"

	"cloud.google.com/go/firestore"
	"github.com/golangdaddy/leap/sdk/cloudfunc"
	"google.golang.org/api/iterator"
)

func (app *App) adopterLists(w http.ResponseWriter, user *User, parent *Internals, mode string, limit int) {

	var collection *firestore.CollectionRef
	if parent != nil {
		collection = parent.Firestore(app.App).Collection("adopters")
	} else {
		collection = app.Firestore().Collection("adopters")
	}

	var q firestore.Query

	switch mode {
	case "admin":

		q = collection.Where("Meta.Moderation.Admins", "array-contains", user.Meta.ID)
		q = q.OrderBy("Meta.Modified", firestore.Desc)

	case "ordered":

		q = collection.OrderBy("Meta.Context.Order", firestore.Asc)

	case "created":

		q = collection.OrderBy("Meta.Created", firestore.Desc)

	case "modified":

		q = collection.OrderBy("Meta.Modified", firestore.Desc)

	case "exif":

		q = collection.OrderBy("Meta.Media.EXIF.taken", firestore.Desc)

	default:

		err := fmt.Errorf("mode not found: %s", mode)
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return

	}

	list := []*ADOPTER{}

	if limit > 0 {
		q = q.Limit(limit)
	}
	iter := q.Documents(app.Context())
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Println(err)
			break
		}
		object := &ADOPTER{}
		if err := doc.DataTo(object); err != nil {
			log.Println(err)
			continue
		}
		list = append(list, object)
	}

	if err := cloudfunc.ServeJSON(w, list); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}

}