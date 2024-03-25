
package p

import (
	"os"
	"fmt"
	"log"
	"sync"
	"time"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"bytes"
	"errors"
	"context"
	"regexp"
	"strings"
	"strconv"
	"net/http"
	"encoding/hex"
	"encoding/json"
	"crypto/sha256"

	"cloud.google.com/go/firestore"
	"github.com/golangdaddy/leap/sdk/common"
	"github.com/google/uuid"
	"google.golang.org/api/iterator"

	"github.com/golangdaddy/leap/models"
	"github.com/golangdaddy/leap/sdk/assetlayer"
	"github.com/golangdaddy/leap/sdk/cloudfunc"

	"github.com/gorilla/websocket"
	"github.com/muesli/gamut"

	"github.com/rwcarlsen/goexif/exif"
	"github.com/dsoprea/go-jpeg-image-structure"
	"github.com/dsoprea/go-png-image-structure"
)

const (
	CONST_PROJECT_ID   = "npg-generic"
	CONST_FIRESTORE_DB = "go-gen-test"

	CONST_BUCKET_UPLOADS = "go-gen-test-uploads"
	CONST_BUCKET_JOBS    = "go-gen-test-jobs"
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
	app.UseGCP(CONST_PROJECT_ID)
	app.UseGCPFirestore(CONST_FIRESTORE_DB)
	return app
}
type Generic struct {
	Meta Internals
}

func Internal(id string) *Internals {
	return &Internals{ID: id}
}

// NewInternals returns a boilerplate internal object
func (n Internals) NewInternals(class string) Internals {

	timestamp := time.Now().UTC().Unix()

	x := Internals{
		ID:       n.ID + "." + class + "-" + uuid.NewString()[:13],
		Class:    class,
		Created:  timestamp,
		Modified: timestamp,
	}
	if len(n.ID) > 0 {
		x.Context.Parent = n.ID
		x.Context.Parents = append(n.Context.Parents, n.ID)
	}
	return x
}

type Internals struct {
	ID         string
	Class      string
	ClassName  string
	Name       string `json:",omitempty"`
	Asset      string `json:",omitempty"`
	Wallet     string `json:",omitempty"`
	Context    Context
	Moderation Moderation
	Media      Media
	Updated    bool
	Created    int64
	Deleted    int64 `json:",omitempty"`
	Modified   int64
	Stats      map[string]float64 `json:",omitempty"`
}

func RegExp(exp, matchString string) bool {
	return regexp.MustCompile(exp).MatchString(matchString)
}

func (i *Internals) Assetlayer() *assetlayer.Client {
	return assetlayer.NewClient(
		os.Getenv("APPID"),
		os.Getenv("ASSETLAYERSECRET"),
		os.Getenv("DIDTOKEN"),
	)
}

func (i *Internals) AssetlayerWalletID() string {
	x := sha256.Sum256([]byte(i.ID))
	return hex.EncodeToString(x[:])[:32]
}

func (i *Internals) AssetlayerCollectionID() string {
	return os.Getenv("MODEL_" + strings.ToUpper(i.Class))
}

func (i *Internals) URI() (string, error) {
	if len(i.Media.URIs) == 0 {
		return "", errors.New("this object has no assigned URI")
	}
	return i.Media.URIs[len(i.Media.URIs)-1], nil
}

func (i *Internals) NewURI() string {
	i.Media.URIs = append(i.Media.URIs, uuid.NewString())
	i.Modify()
	return i.Media.URIs[len(i.Media.URIs)-1]
}

func (i *Internals) DocPath() string {
	println("docpath:", i.ID)
	p := strings.Split(string(i.ID[1:]), ".")
	parts := make([][]string, len(p))
	k := ""
	for x, s := range p {
		k += "." + s
		parts[x] = strings.Split(k, ".")

	}
	outs := []string{}
	for _, p := range parts {
		class := strings.Split(p[len(p)-1], "-")[0]
		outs = append(outs, class+"/"+strings.Join(p, "."))
	}
	return strings.Join(outs, "/")
}

func (i *Internals) SaveToFirestore(app *common.App, src interface{}) error {
	i.Modify()
	_, err := i.Firestore(app).Set(app.Context(), src)
	return err
}

func (i *Internals) Firestore(app *common.App) *firestore.DocumentRef {
	path := i.DocPath()
	return app.Firestore().Doc(path)
}

func (i *Internals) FirestoreDoc(app *common.App, ii Internals) *firestore.DocumentRef {
	return i.Firestore(app).Collection(ii.Class).Doc(ii.ID)
}

func FirestoreCount(app *common.App, collection string) int {
	var count int
	iter := app.Firestore().Collection(collection).Documents(app.Context())
	for {
		_, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Println(err)
			break
		}
		count++
	}
	return count
}

func (i *Internals) FirestoreCount(app *common.App, collection string) int {
	var count int
	iter := i.Firestore(app).Collection(collection).Documents(app.Context())
	for {
		_, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Println(err)
			break
		}
		count++
	}
	return count
}

func ClassFromID(id string) (string, error) {
	p := strings.Split(id, ".")
	last := p[len(p)-1]
	class := strings.Split(last, "-")
	if len(class) != 2 {
		return "", fmt.Errorf("CANT GET CLASS FROM ID: %s", id)
	}
	return class[0], nil
}

func (i *Internals) ParentID() (string, error) {
	if len(i.Context.Parents) == 0 {
		return "", fmt.Errorf("%s has no parents", i.Class)
	}
	return i.Context.Parents[len(i.Context.Parents)-1], nil
}

func (i *Internals) GetParent(app *common.App, dst interface{}) error {
	parentID, err := i.ParentID()
	if err != nil {
		return err
	}
	parent := Internal(parentID)
	doc, err := parent.Firestore(app).Get(app.Context())
	if err != nil {
		return err
	}
	return doc.DataTo(dst)
}

func (i *Internals) GetParentMeta(app *common.App, dst interface{}) error {
	parentID, err := i.ParentID()
	if err != nil {
		return err
	}
	parent := Internal(parentID)
	doc, err := parent.Firestore(app).Get(app.Context())
	if err != nil {
		return err
	}
	return doc.DataTo(dst)
}

// Modify updates the timestamp
func (i *Internals) Modify() {
	i.Modified = time.Now().UTC().Unix()
}

// Update sets the metadata to indicate it has updated for a user
func (i *Internals) Update() {
	i.Updated = true
	i.Modify()
}

type Media struct {
	Color   string                 `json:",omitempty"`
	Preview string                 `json:",omitempty"`
	URIs    []string               `json:",omitempty"`
	Image   bool                   `json:",omitempty"`
	EXIF    map[string]interface{} `json:",omitempty"`
	Format  string                 `json:",omitempty"`
}

type Context struct {
	Children []string `json:",omitempty"`
	Parent   string   `json:",omitempty"`
	Parents  []string `json:",omitempty"`
	Country  string   `json:",omitempty"`
	Region   string   `json:",omitempty"`
	Order    int
	Status   string `json:",omitempty"`
}

type Moderation struct {
	// used for an object id too inherit admins for
	Object string `json:",omitempty"`
	// list of admin usernames
	Admins       []string `json:",omitempty"`
	Blocked      bool     `json:",omitempty"`
	BlockedTime  int64    `json:",omitempty"`
	BlockedBy    string   `json:",omitempty"`
	Approved     bool     `json:",omitempty"`
	ApprovedTime int64    `json:",omitempty"`
	ApprovedBy   string   `json:",omitempty"`
}
func (app *App) SendMessageToUser(user *User, msgType string, data interface{}) {
	
}
type Users []*User

type UserRef struct {
	Account  int
	ID       string
	Username string
}

func DemoUser() *User {
	return NewUser(0, "john@doe.com", "john doe")
}

func NewUser(accountType int, email, username string) *User {
	user := &User{
		Meta:     (Internals{}).NewInternals("users"),
		Account:  accountType,
		Email:    strings.ToLower(strings.TrimSpace(email)),
		Username: strings.ToLower(strings.TrimSpace(username)),
	}
	return user
}

type User struct {
	Meta     Internals
	Account  int    `json:"account" firestore:"account"`
	Email    string `json:"email" firestore:"email"`
	Username string `json:"username" firestore:"username"`
}

func (user *User) Ref() UserRef {
	return UserRef{
		Account:  user.Account,
		ID:       user.Meta.ID,
		Username: user.Username,
	}
}

func (users Users) Refs() []UserRef {
	refs := []UserRef{}
	for _, user := range users {
		refs = append(refs, user.Ref())
	}
	return refs
}

func (user *User) IsValid() bool {
	log.Println(user.Username)

	if len(user.Username) < 6 {
		return false
	}
	if len(user.Username) > 24 {
		return false
	}
	if strings.Contains(user.Username, " ") {
		return false
	}
	if !isAlphanumeric(strings.Replace(user.Username, "_", "", -1)) {
		return false
	}
	return true
}

func isAlphanumeric(word string) bool {
	return regexp.MustCompile(`^[a-zA-Z0-9]*$`).MatchString(word)
}

const (
	CONST_COL_SESSION = "sessions"
	CONST_COL_OTP     = "otp"
	CONST_COL_USER    = "users"
)

// GetOTP gets OTP record from firestore
func GetOTP(app *common.App, r *http.Request) (*OTP, error) {

	otp, err := cloudfunc.QueryParam(r, "otp")
	if err != nil {
		return nil, err
	}
	id := app.SeedDigest(otp)

	// fetch the OTP record
	doc, err := app.Firestore().Collection(CONST_COL_OTP).Doc(id).Get(app.Context())
	if err != nil {
		return nil, err
	}

	otpRecord := &OTP{}
	if err := doc.DataTo(&otpRecord); err != nil {
		return nil, err
	}

	// delete the OTP record
	if _, err := app.Firestore().Collection(CONST_COL_OTP).Doc(id).Delete(app.Context()); err != nil {
		return nil, err
	}

	return otpRecord, nil
}

// GetOTP gets OTP record from firestore
func (app *App) DebugGetOTP(r *http.Request) (*OTP, error) {

	otp, err := cloudfunc.QueryParam(r, "otp")
	if err != nil {
		return nil, err
	}
	id := app.SeedDigest(otp)

	// fetch the OTP record
	doc, err := app.Firestore().Collection(CONST_COL_OTP).Doc(id).Get(app.Context())
	if err != nil {
		return nil, err
	}

	otpRecord := &OTP{}
	if err := doc.DataTo(&otpRecord); err != nil {
		return nil, err
	}

	return otpRecord, nil
}

func (app *App) CreateSessionSecret(otp *OTP) (string, int64, error) {

	secret := app.Token256()
	hashedSecret := app.SeedDigest(secret)

	user, err := otp.GetUser(app.App)
	if err != nil {
		return "", 0, err
	}

	session := user.NewSession()

	// create the firestore session record
	if _, err := app.Firestore().Collection(CONST_COL_SESSION).Doc(hashedSecret).Set(app.Context(), session); err != nil {
		return "", 0, err
	}

	return secret, session.Expires, nil
}

func (app *App) GetSessionUser(r *http.Request) (*User, error) {

	apiKey := r.Header.Get("Authorization")
	if len(apiKey) == 0 {
		err := errors.New("missing apikey in Authorization header")
		return nil, err
	}
	id := app.SeedDigest(apiKey)

	// fetch the Session record
	doc, err := app.Firestore().Collection(CONST_COL_SESSION).Doc(id).Get(app.Context())
	if err != nil {
		return nil, err
	}
	session := &Session{}
	if err := doc.DataTo(&session); err != nil {
		return nil, err
	}

	// fetch the user record
	doc, err = app.Firestore().Collection(CONST_COL_USER).Doc(session.UserID).Get(app.Context())
	if err != nil {
		return nil, err
	}
	user := &User{}
	if err := doc.DataTo(&user); err != nil {
		return nil, err
	}

	return user, nil
}

// UserCollection abstracts the handling of subdata to within the user object
func (app *App) UserCollection(user *User, collectionID string) *firestore.CollectionRef {
	return app.UserRefCollection(user.Ref(), collectionID)
}

func (app *App) UserRefCollection(userRef UserRef, collectionID string) *firestore.CollectionRef {
	return app.Firestore().Collection("users").Doc(userRef.ID).Collection(collectionID)
}

// RegionCollection abstracts the handling of subdata to within the country/region
func (app *App) RegionCollection(user *User, collectionID string) *firestore.CollectionRef {
	return app.Firestore().Collection("countries").Doc(user.Meta.Context.Country).Collection("regions").Doc(user.Meta.Context.Region).Collection(collectionID)
}

func (app *App) GetUserByUsername(username string) (*User, error) {
	doc, err := app.Firestore().Collection("usernames").Doc(username).Get(app.Context())
	if err != nil {
		return nil, err
	}
	record := &Username{}
	if err := doc.DataTo(record); err != nil {
		return nil, err
	}
	return app.GetUserByID(record.User.ID)
}

func (app *App) GetUser(ref UserRef) (*User, error) {
	return app.GetUserByID(ref.ID)
}

func (app *App) GetUserByID(id string) (*User, error) {
	doc, err := app.Firestore().Collection("users").Doc(id).Get(context.Background())
	if err != nil {
		return nil, err
	}
	user := &User{}
	return user, doc.DataTo(user)
}

func (app *App) GetUserByEmail(email string) (*User, error) {

	iter := app.Firestore().Collection("users").Where("email", "==", email).Documents(context.Background())
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		user := &User{}
		return user, doc.DataTo(user)
	}

	return nil, fmt.Errorf("no user forund via email: %s", email)
}
func (app *App) IsAdmin(parent *Internals, user *User) bool {
	if len(parent.Moderation.Object) > 0 {
		var err error
		parent, err = app.GetMetadata(parent.Moderation.Object)
		if err != nil {
			log.Println(err)
			return false
		}
	}
	for _, userID := range parent.Moderation.Admins {
		if user.Meta.ID == userID {
			return true
		}
	}
	return false
}

func (app *App) GetAdmins(parent *Internals) ([]string, error) {
	if len(parent.Moderation.Object) > 0 {
		var err error
		parent, err = app.GetMetadata(parent.Moderation.Object)
		if err != nil {
			return nil, err
		}
	}
	return parent.Moderation.Admins, nil
}
func (app *App) GetMetadata(id string) (*Internals, error) {

	dst := &Generic{}

	i := Internal(id)
	path := i.DocPath()

	println("GET DOCUMENT", path)

	doc, err := app.Firestore().Doc(path).Get(context.Background())
	if err != nil {
		return nil, err
	}
	return &dst.Meta, doc.DataTo(dst)
}

func (app *App) GetDocument(id string, dst interface{}) error {

	i := Internal(id)
	path := i.DocPath()

	println("GET DOCUMENT", path)

	doc, err := app.Firestore().Doc(path).Get(context.Background())
	if err != nil {
		return err
	}
	return doc.DataTo(dst)
}
func getTime() int64 {
	return time.Now().UTC().Unix()
}

func AssertRangeMin(w http.ResponseWriter, min float64, value interface{}) bool {
	if err := assertRangeMin(min, value); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func AssertRangeMax(w http.ResponseWriter, max float64, value interface{}) bool {
	if err := assertRangeMax(max, value); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func assertRangeMin(minimum float64, value interface{}) error {

	var val float64
	switch v := value.(type) {
	case int:
		val = float64(v)
	case float64:
		val = v
	case string:
		val = float64(len(v))
	default:
		log.Println("assertRange: ignoring range assertion for unknown type")
	}

	err := fmt.Errorf("assertRange: value %v exceeded value of range min: %v", value, minimum)
	if val < minimum {
		return err
	}
	return nil
}

func assertRangeMax(maximum float64, value interface{}) error {

	var val float64
	switch v := value.(type) {
	case int:
		val = float64(v)
	case float64:
		val = v
	case string:
		val = float64(len(v))
	default:
		log.Println("assertRange: ignoring range assertion for unknown type")
	}

	err := fmt.Errorf("assertRange: value %v exceeded value of range max: %v", value, maximum)
	if val > maximum {
		return err
	}
	return nil
}

func assertMAPSTRINGINT(m map[string]interface{}, key string) (map[string]int, error) {
	result := map[string]int{}
	object := m[key].(map[string]interface{})
	for k, v := range object {
		if f, ok := v.(float64); ok {
			result[k] = int(f)
		}
	}
	if len(object) != len(result) {
		return nil, fmt.Errorf("assertMAPSTRINGINT: '%s' is required for this request", key)
	}
	return result, nil
}

func AssertMAPSTRINGINT(w http.ResponseWriter, m map[string]interface{}, key string) (map[string]int, bool) {
	data, err := assertMAPSTRINGINT(m, key)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return nil, false
	}
	return data, true
}

func AssertSTRING(w http.ResponseWriter, m map[string]interface{}, key string) (string, bool) {
	s, err := assertSTRING(m, key)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return s, false
	}
	return s, true
}

func assertSTRING(m map[string]interface{}, key string) (string, error) {
	s, ok := m[key].(string)
	if !ok {
		return s, fmt.Errorf("assertSTRING: '%s' is required for this request", key)
	}
	return s, nil
}

func AssertARRAYSTRING(w http.ResponseWriter, m map[string]interface{}, key string) ([]string, bool) {
	s, err := assertARRAYSTRING(m, key)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return nil, false
	}
	return s, true
}

func assertARRAYSTRING(m map[string]interface{}, key string) ([]string, error) {
	a, ok := m[key].([]interface{})
	if !ok {
		return nil, fmt.Errorf("'%s' is required for this request", key)
	}
	b := []string{}
	for _, v := range a {
		s, ok := v.(string)
		if !ok {
			return nil, fmt.Errorf("strings are required for this request: %s", key)
		}
		b = append(b, s)
	}
	return b, nil
}

func AssertFLOAT64(w http.ResponseWriter, m map[string]interface{}, key string) (float64, bool) {
	f, err := assertFLOAT64(m, key)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return 0, false
	}
	return f, true
}

func assertFLOAT64(m map[string]interface{}, key string) (float64, error) {
	f, ok := m[key].(float64)
	if !ok {
		return 0, fmt.Errorf("assertFLOAT64: '%s' is required for this request", key)
	}
	return f, nil
}

func AssertBOOL(w http.ResponseWriter, m map[string]interface{}, key string) (bool, bool) {
	b, err := assertBOOL(m, key)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false, false
	}
	return b, true
}

func assertBOOL(m map[string]interface{}, key string) (bool, error) {
	v, ok := m[key].(bool)
	if !ok {
		return false, fmt.Errorf("assertBOOL: '%s' is required for this request", key)
	}
	return v, nil
}

func AssertINT(w http.ResponseWriter, m map[string]interface{}, key string) (int, bool) {
	x, err := assertINT(m, key)
	if err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return 0, false
	}
	return x, true
}

func assertINT(m map[string]interface{}, key string) (int, error) {
	v, ok := m[key].(float64)
	if !ok {
		return 0, fmt.Errorf("assertINT: '%s' is required for this request", key)
	}
	return int(v), nil
}
type OTP struct {
	Email     string `json:"email" firestore:"email"`
	User      string `json:"user" firestore:"user"`
	Timestamp int64  `json:"timestamp" firestore:"timestamp"`
}

func NewOTP(email, userID string) *OTP {
	return &OTP{
		Email:     email,
		User:      userID,
		Timestamp: time.Now().UTC().Unix(),
	}
}

func (otp *OTP) GetUser(app *common.App) (*User, error) {
	doc, err := app.Firestore().Collection("users").Doc(otp.User).Get(context.Background())
	if err != nil {
		return nil, err
	}
	user := &User{}
	return user, doc.DataTo(user)
}
type Session struct {
	UserID  string
	Expires int64
}

func (user *User) NewSession() *Session {
	return &Session{
		UserID:  user.Meta.ID,
		Expires: time.Now().UTC().Unix(),
	}
}

func (user *User) GetUsernameRef() *Username {
	ref := &Username{
		User:  user.Ref(),
		Index: map[string][]string{},
	}
	max := len(user.Username)
	if max > 14 {
		max = 14
	}
	for x := 3; x <= max; x++ {
		ref.Index[strconv.Itoa(x)] = []string{user.Username[:x]}
	}
	return ref
}

type Username struct {
	User  UserRef
	Index map[string][]string `json:"-"`
}
type Mail struct {
	Meta       Internals
	Sender     UserRef   `json:"sender" firestore:"sender"`
	Recipients []UserRef `json:"recipients" firestore:"recipients"`
	Body       string    `json:"body" firestore:"body"`
}
type ASYNCJOB struct {
	Meta Internals
	// pending:started:completed:failed
	Status  string
	Stage   int
	Stages  []ASYNCJOBSTAGE
	Data    interface{}
	Counter int
}

type ASYNCJOBSTAGE struct {
	Name      string
	Notes     []string
	Started   int64
	Failed    int64
	Completed int64
}

func NewASYNCJOB(parent *Internals, stages ...ASYNCJOBSTAGE) *ASYNCJOB {
	return &ASYNCJOB{
		Meta:   parent.NewInternals("asyncjobs"),
		Stages: stages,
		Status: "PENDING",
	}
}

func NewASYNCJOBSTAGE(name string) ASYNCJOBSTAGE {
	return ASYNCJOBSTAGE{
		Name: name,
	}
}

func (job *ASYNCJOB) DataTo(dst interface{}) error {
	b, err := json.Marshal(job.Data)
	if err != nil {
		return err
	}
	return json.Unmarshal(b, dst)
}

func (job *ASYNCJOB) AddNote(notes ...string) {
	if len(notes) > 0 {
		job.Stages[job.Stage].Notes = append(
			job.Stages[job.Stage].Notes,
			strings.Join(notes, " "),
		)
	}
}

func (job *ASYNCJOB) StartStage() {
	job.Stages[job.Stage].Started = getTime()
	job.Status = "STARTED"
}

func (job *ASYNCJOB) FailStage(err error) {
	job.AddNote(err.Error())
	job.Stages[job.Stage].Failed = getTime()
	job.Status = "FAILED"
}

func (job *ASYNCJOB) CompleteStage() {
	job.Stages[job.Stage].Completed = getTime()
	if job.Stage+1 < len(job.Stages) {
		log.Println("JOB STAGE COMPLETED", job.Stage)
		job.AddNote("COMPLETED STAGE: " + strconv.Itoa(job.Stage))
		job.Stage++
	} else {
		job.Status = "COMPLETED"
		log.Println("JOB STATUS:", job.Status)
		job.AddNote("JOB COMPLETED")
	}
}


type THING struct {
	Meta    Internals
	Fields FieldsTHING `json:"fields" firestore:"fields"`
}

func (user *User) NewTHING(parent *Internals, fields FieldsTHING) *THING {
	var object *THING
	if parent == nil {
		object = &THING{
			Meta: (Internals{}).NewInternals("things"),
			Fields: fields,
		}
	} else {
		object = &THING{
			Meta: parent.NewInternals("things"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "things"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		
	}
	return object
}

type FieldsTHING struct {
	Name string `json:"name" firestore:"name"`
	Description string `json:"description" firestore:"description"`
	State string `json:"state" firestore:"state"`
	Age int `json:"age" firestore:"age"`
	
}

func (x *THING) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"thing","names":null,"plural":"things","json":"","mode":"","context":"a distinct ant transferrable object of any size, could be anything","parents":["room"],"fields":[{"context":"the shortest description of the object","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":60},"regexp":"","regexpHex":""},{"context":"a full description of the object","json":"","name":"description","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":100},"regexp":"","regexpHex":""},{"context":"the state of the object, for example: a tumbler could be \"half full with water\"","json":"","name":"state","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":60},"regexp":"","regexpHex":""},{"context":"age of the object in days","json":"","name":"age","type":"int","input":"number","inputReference":"","required":true,"filter":false,"range":null,"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
}

func (x *THING) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *THING) ValidateObject(m map[string]interface{}) error {

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
		if err := assertRangeMax(60, x.Fields.Name); err != nil {
			return err
		}
		
	}
	

	_, exists = m["description"]
	if true && !exists {
		return errors.New("required field 'description' not supplied")
	}
	if exists {
		x.Fields.Description, err = assertSTRING(m, "description")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Description)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Description)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Description)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Description)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.Description); err != nil {
			
			return err
			
		}
		if err := assertRangeMax(100, x.Fields.Description); err != nil {
			return err
		}
		
	}
	

	_, exists = m["state"]
	if true && !exists {
		return errors.New("required field 'state' not supplied")
	}
	if exists {
		x.Fields.State, err = assertSTRING(m, "state")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.State)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.State)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.State)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.State)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.State); err != nil {
			
			return err
			
		}
		if err := assertRangeMax(60, x.Fields.State); err != nil {
			return err
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Age)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Age)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Age)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Age)
				}
			}
		}
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *THING) ValidateImageTHING(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type FURNISHING struct {
	Meta    Internals
	Fields FieldsFURNISHING `json:"fields" firestore:"fields"`
}

func (user *User) NewFURNISHING(parent *Internals, fields FieldsFURNISHING) *FURNISHING {
	var object *FURNISHING
	if parent == nil {
		object = &FURNISHING{
			Meta: (Internals{}).NewInternals("furnishings"),
			Fields: fields,
		}
	} else {
		object = &FURNISHING{
			Meta: parent.NewInternals("furnishings"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "furnishings"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		
	}
	return object
}

type FieldsFURNISHING struct {
	Name string `json:"name" firestore:"name"`
	Description string `json:"description" firestore:"description"`
	State string `json:"state" firestore:"state"`
	Age int `json:"age" firestore:"age"`
	
}

func (x *FURNISHING) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"furnishing","names":null,"plural":"furnishings","json":"","mode":"","context":"a utility or furnishing in a room, such as a mirror on the wall, decorative object, or something to store objects in","parents":["room"],"fields":[{"context":"the name of the utility or furnature","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"context":"the description of the utility or furnature","json":"","name":"description","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":100},"regexp":"","regexpHex":""},{"context":"the state of the utility or furnature","json":"","name":"state","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":100},"regexp":"","regexpHex":""},{"context":"age of the object in days","json":"","name":"age","type":"int","input":"number","inputReference":"","required":true,"filter":false,"range":null,"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
}

func (x *FURNISHING) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *FURNISHING) ValidateObject(m map[string]interface{}) error {

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
	

	_, exists = m["description"]
	if true && !exists {
		return errors.New("required field 'description' not supplied")
	}
	if exists {
		x.Fields.Description, err = assertSTRING(m, "description")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Description)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Description)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Description)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Description)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.Description); err != nil {
			
			return err
			
		}
		if err := assertRangeMax(100, x.Fields.Description); err != nil {
			return err
		}
		
	}
	

	_, exists = m["state"]
	if true && !exists {
		return errors.New("required field 'state' not supplied")
	}
	if exists {
		x.Fields.State, err = assertSTRING(m, "state")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.State)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.State)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.State)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.State)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.State); err != nil {
			
			return err
			
		}
		if err := assertRangeMax(100, x.Fields.State); err != nil {
			return err
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Age)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Age)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Age)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Age)
				}
			}
		}
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *FURNISHING) ValidateImageFURNISHING(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type ARTHUR struct {
	Meta    Internals
	Fields FieldsARTHUR `json:"fields" firestore:"fields"`
}

func (user *User) NewARTHUR(parent *Internals, fields FieldsARTHUR) *ARTHUR {
	var object *ARTHUR
	if parent == nil {
		object = &ARTHUR{
			Meta: (Internals{}).NewInternals("arthurs"),
			Fields: fields,
		}
	} else {
		object = &ARTHUR{
			Meta: parent.NewInternals("arthurs"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "arthurs"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	

	// this object is owned by the user that created it
	log.Println("OPTIONS ADMIN IS ON:", user.Meta.ID)
	object.Meta.Moderation.Admins = append(
		object.Meta.Moderation.Admins,
		user.Meta.ID,
	)
	// add children to context
	object.Meta.Context.Children = []string{
		"jelly","jellyname","lobby",
	}
	return object
}

type FieldsARTHUR struct {
	Name string `json:"name" firestore:"name"`
	
}

func (x *ARTHUR) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"arthur","names":null,"plural":"arthurs","json":"","mode":"root","context":"arthurs space","children":[{"name":"jelly","names":null,"plural":"jellies","json":"","mode":"","context":"arthurs ","parents":["arthur"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":true,"image":true,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}},{"name":"jellyname","names":null,"plural":"jellynames","json":"","mode":"","context":"arthurs ","parents":["arthur"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}},{"name":"lobby","names":null,"plural":"lobbys","json":"","mode":"","context":"","parents":["game","arthur"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}],"fields":[{"context":"","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":true,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
}

func (x *ARTHUR) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *ARTHUR) ValidateObject(m map[string]interface{}) error {

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
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *ARTHUR) ValidateImageARTHUR(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type JELLY struct {
	Meta    Internals
	Fields FieldsJELLY `json:"fields" firestore:"fields"`
}

func (user *User) NewJELLY(parent *Internals, fields FieldsJELLY) *JELLY {
	var object *JELLY
	if parent == nil {
		object = &JELLY{
			Meta: (Internals{}).NewInternals("jellys"),
			Fields: fields,
		}
	} else {
		object = &JELLY{
			Meta: parent.NewInternals("jellys"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "jellies"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		
	}
	return object
}

type FieldsJELLY struct {
	Name string `json:"name" firestore:"name"`
	Gender string `json:"gender" firestore:"gender"`
	Element string `json:"element" firestore:"element"`
	Hp int `json:"hp" firestore:"hp"`
	
}

func (x *JELLY) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"jelly","names":null,"plural":"jellies","json":"","mode":"","context":"arthurs ","parents":["arthur"],"fields":[{"context":"the name of the unique character","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"context":"either male or female","json":"","name":"gender","type":"string","input":"select","inputReference":"","inputOptions":["male","female"],"required":true,"filter":false,"range":null,"regexp":"","regexpHex":""},{"context":"","json":"","name":"element","type":"string","input":"select","inputReference":"jellynames","required":false,"filter":true,"range":null,"regexp":"","regexpHex":""},{"context":"health points","json":"","name":"hp","type":"int","input":"number","inputReference":"","required":true,"filter":false,"range":null,"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":true,"image":true,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
}

func (x *JELLY) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *JELLY) ValidateObject(m map[string]interface{}) error {

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
	

	_, exists = m["gender"]
	if true && !exists {
		return errors.New("required field 'gender' not supplied")
	}
	if exists {
		x.Fields.Gender, err = assertSTRING(m, "gender")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Gender)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Gender)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Gender)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Gender)
				}
			}
		}
		
	}
	

	_, exists = m["element"]
	if false && !exists {
		return errors.New("required field 'element' not supplied")
	}
	if exists {
		x.Fields.Element, err = assertSTRING(m, "element")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Element)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Element)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Element)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Element)
				}
			}
		}
		
	}
	

	_, exists = m["hp"]
	if true && !exists {
		return errors.New("required field 'hp' not supplied")
	}
	if exists {
		x.Fields.Hp, err = assertINT(m, "hp")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Hp)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Hp)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Hp)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Hp)
				}
			}
		}
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *JELLY) ValidateImageJELLY(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type JELLYNAME struct {
	Meta    Internals
	Fields FieldsJELLYNAME `json:"fields" firestore:"fields"`
}

func (user *User) NewJELLYNAME(parent *Internals, fields FieldsJELLYNAME) *JELLYNAME {
	var object *JELLYNAME
	if parent == nil {
		object = &JELLYNAME{
			Meta: (Internals{}).NewInternals("jellynames"),
			Fields: fields,
		}
	} else {
		object = &JELLYNAME{
			Meta: parent.NewInternals("jellynames"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "jellynames"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		
	}
	return object
}

type FieldsJELLYNAME struct {
	Name string `json:"name" firestore:"name"`
	
}

func (x *JELLYNAME) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"jellyname","names":null,"plural":"jellynames","json":"","mode":"","context":"arthurs ","parents":["arthur"],"fields":[{"context":"the elemental name of the jelly","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
}

func (x *JELLYNAME) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *JELLYNAME) ValidateObject(m map[string]interface{}) error {

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
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *JELLYNAME) ValidateImageJELLYNAME(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type GAME struct {
	Meta    Internals
	Fields FieldsGAME `json:"fields" firestore:"fields"`
}

func (user *User) NewGAME(parent *Internals, fields FieldsGAME) *GAME {
	var object *GAME
	if parent == nil {
		object = &GAME{
			Meta: (Internals{}).NewInternals("games"),
			Fields: fields,
		}
	} else {
		object = &GAME{
			Meta: parent.NewInternals("games"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "games"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		"lobby",
	}
	return object
}

type FieldsGAME struct {
	Name string `json:"name" firestore:"name"`
	
}

func (x *GAME) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"game","names":null,"plural":"games","json":"","mode":"root","context":"","children":[{"name":"lobby","names":null,"plural":"lobbys","json":"","mode":"","context":"","parents":["game","arthur"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}],"fields":[{"context":"","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
}

func (x *GAME) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *GAME) ValidateObject(m map[string]interface{}) error {

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
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *GAME) ValidateImageGAME(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type LOBBY struct {
	Meta    Internals
	Fields FieldsLOBBY `json:"fields" firestore:"fields"`
}

func (user *User) NewLOBBY(parent *Internals, fields FieldsLOBBY) *LOBBY {
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

	object.Meta.ClassName = "lobbys"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		"character",
	}
	return object
}

type FieldsLOBBY struct {
	Name string `json:"name" firestore:"name"`
	
}

func (x *LOBBY) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"lobby","names":null,"plural":"lobbys","json":"","mode":"","context":"","parents":["game","arthur"],"children":[{"name":"character","names":null,"plural":"characters","json":"","mode":"","context":"","parents":["lobby"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}],"fields":[{"context":"","json":"","name":"name","type":"string","input":"text","inputReference":"","required":false,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
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
			
		}
		if err := assertRangeMax(30, x.Fields.Name); err != nil {
			return err
		}
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *LOBBY) ValidateImageLOBBY(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type CHARACTER struct {
	Meta    Internals
	Fields FieldsCHARACTER `json:"fields" firestore:"fields"`
}

func (user *User) NewCHARACTER(parent *Internals, fields FieldsCHARACTER) *CHARACTER {
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

	object.Meta.ClassName = "characters"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
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

func (x *CHARACTER) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"character","names":null,"plural":"characters","json":"","mode":"","context":"","parents":["lobby"],"fields":[{"context":"the name of the unique character","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"context":"the age in years of the character","json":"","name":"age","type":"int","input":"number","inputReference":"","required":true,"filter":false,"range":null,"regexp":"","regexpHex":""},{"context":"either male or female","json":"","name":"gender","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":10},"regexp":"","regexpHex":""},{"context":"health issues affecting the character","json":"","name":"diseases","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":0,"max":1000000},"regexp":"","regexpHex":"5E283F3A283F3A225B5E225D2A227C5B5E2C5D2B292C292A283F3A225B5E225D2A227C5B5E2C5D2B2924"},{"context":"primary job or ocuupation of the character","json":"","name":"profession","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":100},"regexp":"","regexpHex":""},{"context":"the social class of the character (upper, middle, working, lower)","json":"","name":"socialclass","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"context":"a short synopis of the full life story of the character","json":"","name":"backstory","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":10000},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
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
	

	_, exists = m["age"]
	if true && !exists {
		return errors.New("required field 'age' not supplied")
	}
	if exists {
		x.Fields.Age, err = assertINT(m, "age")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Age)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Age)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Age)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Age)
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Gender)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Gender)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Gender)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Gender)
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
	

	_, exists = m["diseases"]
	if true && !exists {
		return errors.New("required field 'diseases' not supplied")
	}
	if exists {
		x.Fields.Diseases, err = assertSTRING(m, "diseases")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Diseases)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Diseases)
				}
			}
		}
		{
			exp := "5E283F3A283F3A225B5E225D2A227C5B5E2C5D2B292C292A283F3A225B5E225D2A227C5B5E2C5D2B2924"
			if len(exp) > 0 {
				log.Println("EXPR", exp)
				b, err := hex.DecodeString(exp)
				if err != nil {
					log.Println(err)
				}
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Diseases)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Diseases)
				}
			}
		}
		
		if err := assertRangeMin(0, x.Fields.Diseases); err != nil {
			
			return err
			
		}
		if err := assertRangeMax(1e+06, x.Fields.Diseases); err != nil {
			return err
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Profession)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Profession)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Profession)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Profession)
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
	

	_, exists = m["socialclass"]
	if true && !exists {
		return errors.New("required field 'socialclass' not supplied")
	}
	if exists {
		x.Fields.Socialclass, err = assertSTRING(m, "socialclass")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Socialclass)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Socialclass)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Socialclass)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Socialclass)
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
	

	_, exists = m["backstory"]
	if true && !exists {
		return errors.New("required field 'backstory' not supplied")
	}
	if exists {
		x.Fields.Backstory, err = assertSTRING(m, "backstory")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Backstory)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Backstory)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Backstory)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Backstory)
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
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *CHARACTER) ValidateImageCHARACTER(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type BOOK struct {
	Meta    Internals
	Fields FieldsBOOK `json:"fields" firestore:"fields"`
}

func (user *User) NewBOOK(parent *Internals, fields FieldsBOOK) *BOOK {
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

	object.Meta.ClassName = "books"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		"bookcharacter","chapter",
	}
	return object
}

type FieldsBOOK struct {
	Name string `json:"name" firestore:"name"`
	
}

func (x *BOOK) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"book","names":null,"plural":"books","json":"","mode":"root","context":"a creative writing project","children":[{"name":"bookcharacter","names":null,"plural":"bookcharacters","json":"","mode":"","context":"a character that will be involved with the storyline, or who might impact a central character but be passive in nature","parents":["book"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}},{"name":"chapter","names":null,"plural":"chapters","json":"","mode":"many","context":"a chapter of the book","parents":["book"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":true,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}],"fields":[{"context":"","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
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
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *BOOK) ValidateImageBOOK(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type BOOKCHARACTER struct {
	Meta    Internals
	Fields FieldsBOOKCHARACTER `json:"fields" firestore:"fields"`
}

func (user *User) NewBOOKCHARACTER(parent *Internals, fields FieldsBOOKCHARACTER) *BOOKCHARACTER {
	var object *BOOKCHARACTER
	if parent == nil {
		object = &BOOKCHARACTER{
			Meta: (Internals{}).NewInternals("bookcharacters"),
			Fields: fields,
		}
	} else {
		object = &BOOKCHARACTER{
			Meta: parent.NewInternals("bookcharacters"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "bookcharacters"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		
	}
	return object
}

type FieldsBOOKCHARACTER struct {
	Name string `json:"name" firestore:"name"`
	Age int `json:"age" firestore:"age"`
	Gender string `json:"gender" firestore:"gender"`
	Profession string `json:"profession" firestore:"profession"`
	Diseases string `json:"diseases" firestore:"diseases"`
	Socialclass string `json:"socialclass" firestore:"socialclass"`
	Backstory string `json:"backstory" firestore:"backstory"`
	
}

func (x *BOOKCHARACTER) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"bookcharacter","names":null,"plural":"bookcharacters","json":"","mode":"","context":"a character that will be involved with the storyline, or who might impact a central character but be passive in nature","parents":["book"],"fields":[{"context":"the name of the unique character","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"context":"the age in years of the character","json":"","name":"age","type":"int","input":"number","inputReference":"","required":true,"filter":false,"range":null,"regexp":"","regexpHex":""},{"context":"either male or female","json":"","name":"gender","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":10},"regexp":"","regexpHex":""},{"context":"primary job or ocuupation of the character","json":"","name":"profession","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":100},"regexp":"","regexpHex":""},{"context":"health issues affecting the character","json":"","name":"diseases","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":0,"max":1000000},"regexp":"","regexpHex":"5E283F3A283F3A225B5E225D2A227C5B5E2C5D2B292C292A283F3A225B5E225D2A227C5B5E2C5D2B2924"},{"context":"the social class of the character (upper, middle, working, lower)","json":"","name":"socialclass","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"context":"a synopis of the full life story of the character","json":"","name":"backstory","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":10000},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
}

func (x *BOOKCHARACTER) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *BOOKCHARACTER) ValidateObject(m map[string]interface{}) error {

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
	

	_, exists = m["age"]
	if true && !exists {
		return errors.New("required field 'age' not supplied")
	}
	if exists {
		x.Fields.Age, err = assertINT(m, "age")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Age)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Age)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Age)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Age)
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Gender)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Gender)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Gender)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Gender)
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
	

	_, exists = m["profession"]
	if true && !exists {
		return errors.New("required field 'profession' not supplied")
	}
	if exists {
		x.Fields.Profession, err = assertSTRING(m, "profession")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Profession)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Profession)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Profession)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Profession)
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
	

	_, exists = m["diseases"]
	if true && !exists {
		return errors.New("required field 'diseases' not supplied")
	}
	if exists {
		x.Fields.Diseases, err = assertSTRING(m, "diseases")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Diseases)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Diseases)
				}
			}
		}
		{
			exp := "5E283F3A283F3A225B5E225D2A227C5B5E2C5D2B292C292A283F3A225B5E225D2A227C5B5E2C5D2B2924"
			if len(exp) > 0 {
				log.Println("EXPR", exp)
				b, err := hex.DecodeString(exp)
				if err != nil {
					log.Println(err)
				}
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Diseases)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Diseases)
				}
			}
		}
		
		if err := assertRangeMin(0, x.Fields.Diseases); err != nil {
			
			return err
			
		}
		if err := assertRangeMax(1e+06, x.Fields.Diseases); err != nil {
			return err
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Socialclass)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Socialclass)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Socialclass)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Socialclass)
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
	

	_, exists = m["backstory"]
	if true && !exists {
		return errors.New("required field 'backstory' not supplied")
	}
	if exists {
		x.Fields.Backstory, err = assertSTRING(m, "backstory")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Backstory)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Backstory)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Backstory)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Backstory)
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
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *BOOKCHARACTER) ValidateImageBOOKCHARACTER(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type CHAPTER struct {
	Meta    Internals
	Fields FieldsCHAPTER `json:"fields" firestore:"fields"`
}

func (user *User) NewCHAPTER(parent *Internals, fields FieldsCHAPTER) *CHAPTER {
	var object *CHAPTER
	if parent == nil {
		object = &CHAPTER{
			Meta: (Internals{}).NewInternals("chapters"),
			Fields: fields,
		}
	} else {
		object = &CHAPTER{
			Meta: parent.NewInternals("chapters"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "chapters"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		"paragraph",
	}
	return object
}

type FieldsCHAPTER struct {
	Name string `json:"name" firestore:"name"`
	
}

func (x *CHAPTER) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"chapter","names":null,"plural":"chapters","json":"","mode":"many","context":"a chapter of the book","parents":["book"],"children":[{"name":"paragraph","names":null,"plural":"paragraphs","json":"","mode":"many","context":"a paragraph in a chapter","parents":["chapter"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}],"fields":[{"context":"","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":60},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":true,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
}

func (x *CHAPTER) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *CHAPTER) ValidateObject(m map[string]interface{}) error {

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
		if err := assertRangeMax(60, x.Fields.Name); err != nil {
			return err
		}
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *CHAPTER) ValidateImageCHAPTER(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type PARAGRAPH struct {
	Meta    Internals
	Fields FieldsPARAGRAPH `json:"fields" firestore:"fields"`
}

func (user *User) NewPARAGRAPH(parent *Internals, fields FieldsPARAGRAPH) *PARAGRAPH {
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

	object.Meta.ClassName = "paragraphs"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		
	}
	return object
}

type FieldsPARAGRAPH struct {
	Content string `json:"content" firestore:"content"`
	
}

func (x *PARAGRAPH) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"paragraph","names":null,"plural":"paragraphs","json":"","mode":"many","context":"a paragraph in a chapter","parents":["chapter"],"fields":[{"context":"","json":"","name":"content","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":10000},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
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
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *PARAGRAPH) ValidateImagePARAGRAPH(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type TOWN struct {
	Meta    Internals
	Fields FieldsTOWN `json:"fields" firestore:"fields"`
}

func (user *User) NewTOWN(parent *Internals, fields FieldsTOWN) *TOWN {
	var object *TOWN
	if parent == nil {
		object = &TOWN{
			Meta: (Internals{}).NewInternals("towns"),
			Fields: fields,
		}
	} else {
		object = &TOWN{
			Meta: parent.NewInternals("towns"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "towns"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	

	// this object is owned by the user that created it
	log.Println("OPTIONS ADMIN IS ON:", user.Meta.ID)
	object.Meta.Moderation.Admins = append(
		object.Meta.Moderation.Admins,
		user.Meta.ID,
	)
	// add children to context
	object.Meta.Context.Children = []string{
		"teststreet","street",
	}
	return object
}

type FieldsTOWN struct {
	Name string `json:"name" firestore:"name"`
	
}

func (x *TOWN) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"town","names":null,"plural":"towns","json":"","mode":"root","context":"A town where people live.","children":[{"name":"teststreet","names":null,"plural":"teststreets","json":"","mode":"many","context":"A street where people live.","parents":["town"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}},{"name":"street","names":null,"plural":"streets","json":"","mode":"","context":"A street, part of the transaportation network of a town or city.","parents":["town"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}],"fields":[{"context":"","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":true,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
}

func (x *TOWN) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *TOWN) ValidateObject(m map[string]interface{}) error {

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
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *TOWN) ValidateImageTOWN(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type TESTSTREET struct {
	Meta    Internals
	Fields FieldsTESTSTREET `json:"fields" firestore:"fields"`
}

func (user *User) NewTESTSTREET(parent *Internals, fields FieldsTESTSTREET) *TESTSTREET {
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

	object.Meta.ClassName = "teststreets"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
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

func (x *TESTSTREET) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"teststreet","names":null,"plural":"teststreets","json":"","mode":"many","context":"A street where people live.","parents":["town"],"fields":[{"context":"the name of the street","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":60},"regexp":"","regexpHex":""},{"context":"a description of the street","json":"","name":"description","type":"string","input":"text","inputReference":"","required":false,"filter":false,"range":{"min":1,"max":1000},"regexp":"","regexpHex":""},{"context":"the street junctioning at the START of the road, if any","json":"","name":"start","type":"string","input":"text","inputReference":"","required":false,"filter":false,"range":{"min":1,"max":60},"regexp":"","regexpHex":""},{"context":"the junction at the END of the road, if any","json":"","name":"end","type":"string","input":"text","inputReference":"","required":false,"filter":false,"range":{"min":1,"max":60},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
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
		if err := assertRangeMax(60, x.Fields.Name); err != nil {
			return err
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Description)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Description)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Description)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Description)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.Description); err != nil {
			
		}
		if err := assertRangeMax(1000, x.Fields.Description); err != nil {
			return err
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Start)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Start)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Start)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Start)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.Start); err != nil {
			
		}
		if err := assertRangeMax(60, x.Fields.Start); err != nil {
			return err
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.End)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.End)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.End)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.End)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.End); err != nil {
			
		}
		if err := assertRangeMax(60, x.Fields.End); err != nil {
			return err
		}
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *TESTSTREET) ValidateImageTESTSTREET(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type STREET struct {
	Meta    Internals
	Fields FieldsSTREET `json:"fields" firestore:"fields"`
}

func (user *User) NewSTREET(parent *Internals, fields FieldsSTREET) *STREET {
	var object *STREET
	if parent == nil {
		object = &STREET{
			Meta: (Internals{}).NewInternals("streets"),
			Fields: fields,
		}
	} else {
		object = &STREET{
			Meta: parent.NewInternals("streets"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "streets"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		"building",
	}
	return object
}

type FieldsSTREET struct {
	Name string `json:"name" firestore:"name"`
	Zoning string `json:"zoning" firestore:"zoning"`
	Length int `json:"length" firestore:"length"`
	
}

func (x *STREET) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"street","names":null,"plural":"streets","json":"","mode":"","context":"A street, part of the transaportation network of a town or city.","parents":["town"],"children":[{"name":"building","names":null,"plural":"buildings","json":"","mode":"","context":"A building which exists in a street, could be residential, commercial, or industrial.","parents":["street"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}],"fields":[{"context":"The street name","json":"","name":"name","type":"string","input":"text","inputReference":"","required":false,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"context":"the general zoning type of the street","json":"","name":"zoning","type":"string","input":"text","inputReference":"","required":false,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"context":"the length in meters of the street","json":"","name":"length","type":"int","input":"number","inputReference":"","required":false,"filter":false,"range":null,"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
}

func (x *STREET) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *STREET) ValidateObject(m map[string]interface{}) error {

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
			
		}
		if err := assertRangeMax(30, x.Fields.Name); err != nil {
			return err
		}
		
	}
	

	_, exists = m["zoning"]
	if false && !exists {
		return errors.New("required field 'zoning' not supplied")
	}
	if exists {
		x.Fields.Zoning, err = assertSTRING(m, "zoning")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Zoning)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Zoning)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Zoning)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Zoning)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.Zoning); err != nil {
			
		}
		if err := assertRangeMax(30, x.Fields.Zoning); err != nil {
			return err
		}
		
	}
	

	_, exists = m["length"]
	if false && !exists {
		return errors.New("required field 'length' not supplied")
	}
	if exists {
		x.Fields.Length, err = assertINT(m, "length")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Length)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Length)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Length)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Length)
				}
			}
		}
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *STREET) ValidateImageSTREET(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type BUILDING struct {
	Meta    Internals
	Fields FieldsBUILDING `json:"fields" firestore:"fields"`
}

func (user *User) NewBUILDING(parent *Internals, fields FieldsBUILDING) *BUILDING {
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

	object.Meta.ClassName = "buildings"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		"floor",
	}
	return object
}

type FieldsBUILDING struct {
	Name string `json:"name" firestore:"name"`
	Description string `json:"description" firestore:"description"`
	Number int `json:"number" firestore:"number"`
	Xunits float64 `json:"xunits" firestore:"xunits"`
	Yunits float64 `json:"yunits" firestore:"yunits"`
	Floors int `json:"floors" firestore:"floors"`
	Doors int `json:"doors" firestore:"doors"`
	
}

func (x *BUILDING) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"building","names":null,"plural":"buildings","json":"","mode":"","context":"A building which exists in a street, could be residential, commercial, or industrial.","parents":["street"],"children":[{"name":"floor","names":null,"plural":"floors","json":"","mode":"","context":"A level or floor of a building where rooms or spaces are located.","parents":["building"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}],"fields":[{"context":"","json":"","name":"name","type":"string","input":"text","inputReference":"","required":false,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"context":"A description of the building","json":"","name":"description","type":"string","input":"text","inputReference":"","required":false,"filter":false,"range":{"min":1,"max":1000},"regexp":"","regexpHex":""},{"context":"Street number(s) of the building","json":"","name":"number","type":"int","input":"number","inputReference":"","required":false,"filter":false,"range":null,"regexp":"","regexpHex":""},{"context":"","json":"","name":"xunits","type":"float64","input":"number","inputReference":"","required":true,"filter":false,"range":null,"regexp":"","regexpHex":""},{"context":"","json":"","name":"yunits","type":"float64","input":"number","inputReference":"","required":true,"filter":false,"range":null,"regexp":"","regexpHex":""},{"context":"Number of floors this building has","json":"","name":"floors","type":"int","input":"number","inputReference":"","required":true,"filter":false,"range":null,"regexp":"","regexpHex":""},{"context":"Number of ground floor entrances or exits","json":"","name":"doors","type":"int","input":"number","inputReference":"","required":true,"filter":false,"range":null,"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
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
			
		}
		if err := assertRangeMax(30, x.Fields.Name); err != nil {
			return err
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Description)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Description)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Description)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Description)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.Description); err != nil {
			
		}
		if err := assertRangeMax(1000, x.Fields.Description); err != nil {
			return err
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Number)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Number)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Number)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Number)
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Xunits)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Xunits)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Xunits)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Xunits)
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Yunits)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Yunits)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Yunits)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Yunits)
				}
			}
		}
		
	}
	

	_, exists = m["floors"]
	if true && !exists {
		return errors.New("required field 'floors' not supplied")
	}
	if exists {
		x.Fields.Floors, err = assertINT(m, "floors")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Floors)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Floors)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Floors)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Floors)
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
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Doors)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Doors)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Doors)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Doors)
				}
			}
		}
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *BUILDING) ValidateImageBUILDING(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type FLOOR struct {
	Meta    Internals
	Fields FieldsFLOOR `json:"fields" firestore:"fields"`
}

func (user *User) NewFLOOR(parent *Internals, fields FieldsFLOOR) *FLOOR {
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

	object.Meta.ClassName = "floors"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		"room",
	}
	return object
}

type FieldsFLOOR struct {
	Name string `json:"name" firestore:"name"`
	Rooms int `json:"rooms" firestore:"rooms"`
	
}

func (x *FLOOR) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"floor","names":null,"plural":"floors","json":"","mode":"","context":"A level or floor of a building where rooms or spaces are located.","parents":["building"],"children":[{"name":"room","names":null,"plural":"rooms","json":"","mode":"","context":"A room on this floor of the building","parents":["floor"],"children":[{"name":"thing","names":null,"plural":"things","json":"","mode":"","context":"a distinct ant transferrable object of any size, could be anything","parents":["room"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}},{"name":"furnishing","names":null,"plural":"furnishings","json":"","mode":"","context":"a utility or furnishing in a room, such as a mirror on the wall, decorative object, or something to store objects in","parents":["room"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}],"fields":[{"context":"the identifier of the floor","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":100},"regexp":"","regexpHex":""},{"context":"","json":"","name":"rooms","type":"int","input":"number","inputReference":"","required":true,"filter":false,"range":null,"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
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
		if err := assertRangeMax(100, x.Fields.Name); err != nil {
			return err
		}
		
	}
	

	_, exists = m["rooms"]
	if true && !exists {
		return errors.New("required field 'rooms' not supplied")
	}
	if exists {
		x.Fields.Rooms, err = assertINT(m, "rooms")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Rooms)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Rooms)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Rooms)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Rooms)
				}
			}
		}
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *FLOOR) ValidateImageFLOOR(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}



type ROOM struct {
	Meta    Internals
	Fields FieldsROOM `json:"fields" firestore:"fields"`
}

func (user *User) NewROOM(parent *Internals, fields FieldsROOM) *ROOM {
	var object *ROOM
	if parent == nil {
		object = &ROOM{
			Meta: (Internals{}).NewInternals("rooms"),
			Fields: fields,
		}
	} else {
		object = &ROOM{
			Meta: parent.NewInternals("rooms"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "rooms"

	colors, err := gamut.Generate(8, gamut.PastelGenerator{})
	if err != nil {
		log.Println(err)
	} else {
		object.Meta.Media.Color = gamut.ToHex(colors[0])
	}

	// this object inherits its admin permissions
	if parent != nil {
		log.Println("OPTIONS ADMIN IS OFF:", parent.Moderation.Object)
		if len(parent.Moderation.Object) == 0 {
			log.Println("USING PARENT ID AS MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.ID
		} else {
			log.Println("USING PARENT'S MODERATION OBJECT")
			object.Meta.Moderation.Object = parent.Moderation.Object
		}
	}

	
	// add children to context
	object.Meta.Context.Children = []string{
		"thing","furnishing",
	}
	return object
}

type FieldsROOM struct {
	Name string `json:"name" firestore:"name"`
	Descriptoion string `json:"descriptoion" firestore:"descriptoion"`
	
}

func (x *ROOM) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"room","names":null,"plural":"rooms","json":"","mode":"","context":"A room on this floor of the building","parents":["floor"],"children":[{"name":"thing","names":null,"plural":"things","json":"","mode":"","context":"a distinct ant transferrable object of any size, could be anything","parents":["room"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}},{"name":"furnishing","names":null,"plural":"furnishings","json":"","mode":"","context":"a utility or furnishing in a room, such as a mirror on the wall, decorative object, or something to store objects in","parents":["room"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}],"fields":[{"context":"A name representing the purpose or utility of this room","json":"","name":"name","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"context":"A description of the purpose or utility of this room","json":"","name":"descriptoion","type":"string","input":"text","inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"job":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null}}`), obj)
	return obj
}

func (x *ROOM) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *ROOM) ValidateObject(m map[string]interface{}) error {

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
	

	_, exists = m["descriptoion"]
	if true && !exists {
		return errors.New("required field 'descriptoion' not supplied")
	}
	if exists {
		x.Fields.Descriptoion, err = assertSTRING(m, "descriptoion")
		if err != nil {
			return errors.New(err.Error())
		}
		{
			exp := ""
			if len(exp) > 0 {
				if !RegExp(exp, fmt.Sprintf("%v", x.Fields.Descriptoion)) {
					return fmt.Errorf("failed to regexp: %s >> %s", exp, x.Fields.Descriptoion)
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
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.Descriptoion)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.Descriptoion)
				}
			}
		}
		
		if err := assertRangeMin(1, x.Fields.Descriptoion); err != nil {
			
			return err
			
		}
		if err := assertRangeMax(30, x.Fields.Descriptoion); err != nil {
			return err
		}
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *ROOM) ValidateImageROOM(fileBytes []byte) (image.Image, error) {

	img, _, err := image.Decode(bytes.NewBuffer(fileBytes))
	if err != nil {
		return nil, err
	}
	object.Meta.Media.Image = true

	// determine image format
	if jpegstructure.NewJpegMediaParser().LooksLikeFormat(fileBytes) {
		object.Meta.Media.Format = "JPEG"
	} else {
		if pngstructure.NewPngMediaParser().LooksLikeFormat(fileBytes) {
			object.Meta.Media.Format = "PNG"
		}
	}

	// Parse the EXIF data
	exifData, err := exif.Decode(bytes.NewBuffer(fileBytes))
	if err == nil {
		println(exifData.String())
		
		object.Meta.Media.EXIF = map[string]interface{}{}
	
		tm, err := exifData.DateTime()
		if err == nil {
			object.Meta.Media.EXIF["taken"] = tm.UTC().Unix()
			object.Meta.Modified = tm.UTC().Unix()
			fmt.Println("Taken: ", tm)
		}
	
		lat, long, err := exifData.LatLong()
		if err != nil {
			object.Meta.Media.EXIF["lat"] = lat
			object.Meta.Media.EXIF["lng"] = long
			fmt.Println("lat, long: ", lat, ", ", long)
		}
	}

	return img, nil
}


