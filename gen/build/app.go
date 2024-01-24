package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/golangdaddy/leap/sdk/cloudfunc"
	"github.com/golangdaddy/leap/sdk/common"
	"github.com/gorilla/websocket"
	"github.com/richardboase/npgpublic/models"
)

type App struct {
	*common.App
	connections map[string]*websocket.Conn
	sync.RWMutex
}

func NewApp() *App {
	app := &App{
		App:         common.NewApp(),
		connections: map[string]*websocket.Conn{},
	}
	return app
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Type string
	Body interface{}
}

func (msg *Message) ToJSON() []byte {
	b, _ := json.Marshal(msg)
	return b
}

func (app *App) HandleConnections(w http.ResponseWriter, r *http.Request) {

	apiKey := r.URL.Query().Get("key")
	if len(apiKey) == 0 {
		err := errors.New("missing key")
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return
	}
	id := app.SeedDigest(apiKey)

	// fetch the Session record
	doc, err := app.Firestore().Collection("sessions").Doc(id).Get(app.Context())
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}
	session := &models.Session{}
	if err := doc.DataTo(&session); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}

	// fetch the user record
	doc, err = app.Firestore().Collection("sessions").Doc(session.UserID).Get(app.Context())
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}
	user := &models.User{}
	if err := doc.DataTo(&user); err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusInternalServerError)
		return
	}
	defer func() {
		conn.Close()
		app.Lock()
		delete(app.connections, id)
		app.Unlock()
		log.Println("closed connection:", id)
	}()

	app.Lock()
	app.connections[id] = conn
	app.Unlock()

	fmt.Println("Client connected: " + user.Username)

	for range time.NewTicker(time.Minute / 6).C {
		if err := conn.WriteMessage(
			websocket.TextMessage,
			(&Message{
				Type: "shout",
				Body: "hello worlds",
			}).ToJSON(),
		); err != nil {
			log.Println(err)
			return
		}
	}
}
