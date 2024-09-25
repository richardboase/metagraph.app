
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
	Payment    Payment
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
	User     string   `json:",omitempty"`
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

type Payment struct {
	Mint         bool
	Destinations []*PaymentDestination
}

type PaymentDestination struct {
	To           string  `json:"to"`
	Amount       float64 `json:"amount"`
	CurrencyCode string  `json:"currencyCode"`
}

func (app *App) SendMessageToUser(user *User, msgType string, data interface{}) {
	
}
type Users []*User

type UserRef struct {
	Mode     string
	ID       string
	Username string
}

func DemoUser() *User {
	return NewUser("demo", "john@doe.com", "john_doe")
}

func NewUser(mode string, email, username string) *User {
	user := &User{
		Meta:     (Internals{}).NewInternals("users"),
		Mode:     mode,
		Email:    strings.ToLower(strings.TrimSpace(email)),
		Username: strings.ToLower(strings.TrimSpace(username)),
	}
	return user
}

type User struct {
	Meta     Internals
	Mode     string `json:"mode" firestore:"mode"`
	Email    string `json:"email" firestore:"email"`
	Username string `json:"username" firestore:"username"`
}

func (user *User) Ref() UserRef {
	return UserRef{
		Mode:     user.Mode,
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

	if len(user.Username) < 3 {
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


type ANIMAL struct {
	Meta    Internals
	Fields FieldsANIMAL `json:"fields" firestore:"fields"`
}

func (user *User) NewANIMAL(parent *Internals, fields FieldsANIMAL) *ANIMAL {
	var object *ANIMAL
	if parent == nil {
		object = &ANIMAL{
			Meta: (Internals{}).NewInternals("animals"),
			Fields: fields,
		}
	} else {
		object = &ANIMAL{
			Meta: parent.NewInternals("animals"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "animals"
	object.Meta.Context.User = user.Meta.ID

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
		"healthCheckup",
	}
	return object
}

// set the fields export tags to lowercase
type FieldsANIMAL struct {
	
		
			ANIMALNAME string `json:"animalname" firestore:"animalname"`
		
	
		
			ANIMALSPECIES string `json:"animalspecies" firestore:"animalspecies"`
		
	
		
			ANIMALAGE int `json:"animalage" firestore:"animalage"`
		
	
		
			ANIMALBIRTHDAY string `json:"animalbirthday" firestore:"animalbirthday"`
		
	
}

func (x *ANIMAL) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"animal","names":null,"plural":"animals","json":"","context":"Define the main object for storing information about each rescued animal","children":[{"name":"healthCheckup","names":null,"plural":"checkups","json":"","context":"A record of each health checkup per animal, detailing health-related observations","parents":["animal"],"fields":null,"listMode":"","options":{"readonly":false,"admin":false,"member":null,"job":false,"comment":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"handcash":{"Type":"","Payments":null,"Mint":null},"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null},"tags":null,"childTags":null}],"fields":[{"id":"ANIMALNAME","context":"The name of the animal","name":"animal name","type":"string","element":{"Name":"STRING","Go":"string","Input":"input","Type":"text"},"inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"id":"ANIMALSPECIES","context":"The species of the animal","name":"animal species","type":"string","element":{"Name":"STRING","Go":"string","Input":"input","Type":"text"},"inputReference":"","required":true,"filter":false,"range":{"min":1,"max":30},"regexp":"","regexpHex":""},{"id":"ANIMALAGE","context":"The age of the animal","name":"animal age","type":"uint","element":{"Name":"INT","Go":"int","Input":"input","Type":"number"},"inputReference":"","required":true,"filter":false,"range":{"min":0,"max":-1},"regexp":"","regexpHex":""},{"id":"ANIMALBIRTHDAY","context":"The D.O.B. of the animal","name":"animal birthday","type":"date","element":{"Name":"DATE","Go":"string","Input":"input","Type":"date"},"inputReference":"","required":true,"filter":false,"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":true,"member":null,"job":false,"comment":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"handcash":{"Type":"","Payments":null,"Mint":null},"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null},"tags":null,"childTags":null}`), obj)
	return obj
}

func (x *ANIMAL) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *ANIMAL) ValidateObject(m map[string]interface{}) error {

	var err error
	var exists bool
	

	_, exists = m["animalname"]
	if true && !exists {
		return errors.New("required field 'ANIMALNAME' not supplied")
	}
	if exists {
		
			x.Fields.ANIMALNAME, err = assertSTRING(m, "ANIMALNAME")
			if err != nil {
				return errors.New(err.Error())
			}
			exp := ""
			if len(exp) > 0 {
				log.Println("EXPR", exp)
				b, err := hex.DecodeString(exp)
				if err != nil {
					log.Println(err)
				}
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.ANIMALNAME)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.ANIMALNAME)
				}
			}
			
				if err := assertRangeMin(1, x.Fields.ANIMALNAME); err != nil {
					
					return err
					
				}
				if err := assertRangeMax(30, x.Fields.ANIMALNAME); err != nil {
					return err
				}
			
		
	}
	

	_, exists = m["animalspecies"]
	if true && !exists {
		return errors.New("required field 'ANIMALSPECIES' not supplied")
	}
	if exists {
		
			x.Fields.ANIMALSPECIES, err = assertSTRING(m, "ANIMALSPECIES")
			if err != nil {
				return errors.New(err.Error())
			}
			exp := ""
			if len(exp) > 0 {
				log.Println("EXPR", exp)
				b, err := hex.DecodeString(exp)
				if err != nil {
					log.Println(err)
				}
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.ANIMALSPECIES)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.ANIMALSPECIES)
				}
			}
			
				if err := assertRangeMin(1, x.Fields.ANIMALSPECIES); err != nil {
					
					return err
					
				}
				if err := assertRangeMax(30, x.Fields.ANIMALSPECIES); err != nil {
					return err
				}
			
		
	}
	

	_, exists = m["animalage"]
	if true && !exists {
		return errors.New("required field 'ANIMALAGE' not supplied")
	}
	if exists {
		
			x.Fields.ANIMALAGE, err = assertINT(m, "ANIMALAGE")
			if err != nil {
				return errors.New(err.Error())
			}
			exp := ""
			if len(exp) > 0 {
				log.Println("EXPR", exp)
				b, err := hex.DecodeString(exp)
				if err != nil {
					log.Println(err)
				}
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.ANIMALAGE)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.ANIMALAGE)
				}
			}
			
				if err := assertRangeMin(0, x.Fields.ANIMALAGE); err != nil {
					
					return err
					
				}
				if err := assertRangeMax(-1, x.Fields.ANIMALAGE); err != nil {
					return err
				}
			
		
	}
	

	_, exists = m["animalbirthday"]
	if true && !exists {
		return errors.New("required field 'ANIMALBIRTHDAY' not supplied")
	}
	if exists {
		
			x.Fields.ANIMALBIRTHDAY, err = assertSTRING(m, "ANIMALBIRTHDAY")
			if err != nil {
				return errors.New(err.Error())
			}
			exp := ""
			if len(exp) > 0 {
				log.Println("EXPR", exp)
				b, err := hex.DecodeString(exp)
				if err != nil {
					log.Println(err)
				}
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.ANIMALBIRTHDAY)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.ANIMALBIRTHDAY)
				}
			}
			
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		log.Println("trying to composite object name")
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *ANIMAL) ValidateImageANIMAL(fileBytes []byte) (image.Image, error) {

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



type HEALTHCHECKUP struct {
	Meta    Internals
	Fields FieldsHEALTHCHECKUP `json:"fields" firestore:"fields"`
}

func (user *User) NewHEALTHCHECKUP(parent *Internals, fields FieldsHEALTHCHECKUP) *HEALTHCHECKUP {
	var object *HEALTHCHECKUP
	if parent == nil {
		object = &HEALTHCHECKUP{
			Meta: (Internals{}).NewInternals("healthcheckups"),
			Fields: fields,
		}
	} else {
		object = &HEALTHCHECKUP{
			Meta: parent.NewInternals("healthcheckups"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "checkups"
	object.Meta.Context.User = user.Meta.ID

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

// set the fields export tags to lowercase
type FieldsHEALTHCHECKUP struct {
	
		
			NOTES string `json:"notes" firestore:"notes"`
		
	
}

func (x *HEALTHCHECKUP) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"healthCheckup","names":null,"plural":"checkups","json":"","context":"A record of each health checkup per animal, detailing health-related observations","parents":["animal"],"fields":[{"id":"NOTES","context":"notes about the animal's health checkup","name":"notes","type":"string","element":{"Name":"STRING","Go":"string","Input":"input","Type":"text"},"inputReference":"","required":true,"filter":false,"range":{"min":1,"max":10000},"regexp":"","regexpHex":""}],"listMode":"","options":{"readonly":false,"admin":false,"member":null,"job":false,"comment":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"handcash":{"Type":"","Payments":null,"Mint":null},"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null},"tags":null,"childTags":null}`), obj)
	return obj
}

func (x *HEALTHCHECKUP) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *HEALTHCHECKUP) ValidateObject(m map[string]interface{}) error {

	var err error
	var exists bool
	

	_, exists = m["notes"]
	if true && !exists {
		return errors.New("required field 'NOTES' not supplied")
	}
	if exists {
		
			x.Fields.NOTES, err = assertSTRING(m, "NOTES")
			if err != nil {
				return errors.New(err.Error())
			}
			exp := ""
			if len(exp) > 0 {
				log.Println("EXPR", exp)
				b, err := hex.DecodeString(exp)
				if err != nil {
					log.Println(err)
				}
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.NOTES)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.NOTES)
				}
			}
			
				if err := assertRangeMin(1, x.Fields.NOTES); err != nil {
					
					return err
					
				}
				if err := assertRangeMax(10000, x.Fields.NOTES); err != nil {
					return err
				}
			
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		log.Println("trying to composite object name")
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *HEALTHCHECKUP) ValidateImageHEALTHCHECKUP(fileBytes []byte) (image.Image, error) {

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



type ADOPTER struct {
	Meta    Internals
	Fields FieldsADOPTER `json:"fields" firestore:"fields"`
}

func (user *User) NewADOPTER(parent *Internals, fields FieldsADOPTER) *ADOPTER {
	var object *ADOPTER
	if parent == nil {
		object = &ADOPTER{
			Meta: (Internals{}).NewInternals("adopters"),
			Fields: fields,
		}
	} else {
		object = &ADOPTER{
			Meta: parent.NewInternals("adopters"),
			Fields: fields,
		}
	}

	object.Meta.ClassName = "adopters"
	object.Meta.Context.User = user.Meta.ID

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
		
	}
	return object
}

// set the fields export tags to lowercase
type FieldsADOPTER struct {
	
		
			
				
					FIRSTNAME string `json:"adoptername" firestore:"adoptername"`
				
			
				
					MIDDLENAMES string `json:"adoptername" firestore:"adoptername"`
				
			
				
					LASTNAME string `json:"adoptername" firestore:"adoptername"`
				
			
		
	
		
			ADOPTERPHONENUMBER string `json:"adopterphonenumber" firestore:"adopterphonenumber"`
		
	
}

func (x *ADOPTER) Schema() *models.Object {
	obj := &models.Object{}
	json.Unmarshal([]byte(`{"name":"adopter","names":null,"plural":"adopters","json":"","context":"Stores information about individuals who adopt animals","fields":[{"id":"ADOPTERNAME","context":"The name of the adopter","name":"adopter name","type":"person.name","element":null,"inputs":[{"id":"FIRSTNAME","context":"A name or names of something or someone","name":"first-name","type":"name","element":{"Name":"STRING","Go":"string","Input":"input","Type":"text"},"inputReference":"","required":true,"filter":false,"range":{"min":2,"max":50},"regexp":"","regexpHex":""},{"id":"MIDDLENAMES","context":"A name or names of something or someone","name":"middle-names","type":"name","element":{"Name":"STRING","Go":"string","Input":"input","Type":"text"},"inputReference":"","required":false,"filter":false,"range":{"min":2,"max":50},"regexp":"","regexpHex":""},{"id":"LASTNAME","context":"A name or names of something or someone","name":"last-name","type":"name","element":{"Name":"STRING","Go":"string","Input":"input","Type":"text"},"inputReference":"","required":true,"filter":false,"range":{"min":2,"max":50},"regexp":"","regexpHex":""}],"inputReference":"","required":true,"filter":false,"regexp":"","regexpHex":""},{"id":"ADOPTERPHONENUMBER","context":"The phone number of the adopter","name":"adopter phone number","type":"phone","element":{"Name":"PHONE","Go":"string","Input":"input","Type":"tel"},"inputReference":"","required":true,"filter":false,"regexp":"^\\+?[1-9]\\d{1,14}$","regexpHex":"5e5c2b3f5b312d395d5c647b312c31347d24"}],"listMode":"","options":{"readonly":false,"admin":true,"member":null,"job":false,"comment":false,"order":false,"file":false,"image":false,"photo":false,"exif":false,"font":false,"topicCreate":null,"topics":null,"assetlayer":null,"handcash":{"Type":"","Payments":null,"Mint":null},"pusher":false,"permissions":{"AdminsOnly":false,"AdminsEdit":false},"filterFields":null},"tags":null,"childTags":null}`), obj)
	return obj
}

func (x *ADOPTER) ValidateInput(w http.ResponseWriter, m map[string]interface{}) bool {
	if err := x.ValidateObject(m); err != nil {
		cloudfunc.HttpError(w, err, http.StatusBadRequest)
		return false
	}
	return true
}

func (x *ADOPTER) ValidateObject(m map[string]interface{}) error {

	var err error
	var exists bool
	

	_, exists = m["adoptername"]
	if true && !exists {
		return errors.New("required field 'ADOPTERNAME' not supplied")
	}
	if exists {
		
			var exp string
			
				x.Fields.FIRSTNAME, err = assertSTRING(m, "FIRSTNAME")
				if err != nil {
					return errors.New(err.Error())
				}
				exp := ""
				if len(exp) > 0 {
					log.Println("EXPR", exp)
					b, err := hex.DecodeString(exp)
					if err != nil {
						log.Println(err)
					}
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.FIRSTNAME)) {
						return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.FIRSTNAME)
					}
				}
				
					if err := assertRangeMin(2, x.Fields.FIRSTNAME); err != nil {
						
						return err
						
					}
					if err := assertRangeMax(50, x.Fields.FIRSTNAME); err != nil {
						return err
					}
				
			
				x.Fields.MIDDLENAMES, err = assertSTRING(m, "MIDDLENAMES")
				if err != nil {
					return errors.New(err.Error())
				}
				exp := ""
				if len(exp) > 0 {
					log.Println("EXPR", exp)
					b, err := hex.DecodeString(exp)
					if err != nil {
						log.Println(err)
					}
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.MIDDLENAMES)) {
						return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.MIDDLENAMES)
					}
				}
				
					if err := assertRangeMin(2, x.Fields.MIDDLENAMES); err != nil {
						
					}
					if err := assertRangeMax(50, x.Fields.MIDDLENAMES); err != nil {
						return err
					}
				
			
				x.Fields.LASTNAME, err = assertSTRING(m, "LASTNAME")
				if err != nil {
					return errors.New(err.Error())
				}
				exp := ""
				if len(exp) > 0 {
					log.Println("EXPR", exp)
					b, err := hex.DecodeString(exp)
					if err != nil {
						log.Println(err)
					}
					if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.LASTNAME)) {
						return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.LASTNAME)
					}
				}
				
					if err := assertRangeMin(2, x.Fields.LASTNAME); err != nil {
						
						return err
						
					}
					if err := assertRangeMax(50, x.Fields.LASTNAME); err != nil {
						return err
					}
				
			
		
	}
	

	_, exists = m["adopterphonenumber"]
	if true && !exists {
		return errors.New("required field 'ADOPTERPHONENUMBER' not supplied")
	}
	if exists {
		
			x.Fields.ADOPTERPHONENUMBER, err = assertSTRING(m, "ADOPTERPHONENUMBER")
			if err != nil {
				return errors.New(err.Error())
			}
			exp := "5e5c2b3f5b312d395d5c647b312c31347d24"
			if len(exp) > 0 {
				log.Println("EXPR", exp)
				b, err := hex.DecodeString(exp)
				if err != nil {
					log.Println(err)
				}
				if !RegExp(string(b), fmt.Sprintf("%v", x.Fields.ADOPTERPHONENUMBER)) {
					return fmt.Errorf("failed to regexpHex: %s >> %s", string(b), x.Fields.ADOPTERPHONENUMBER)
				}
			}
			
		
	}
	

	// extract name field if exists
	name, ok := m["name"].(string)
	if ok {
		x.Meta.Name = name	
	} else {
		log.Println("trying to composite object name")
		var names []string
		
		x.Meta.Name = strings.Join(names, " ")
	}

	x.Meta.Modify()

	return nil
}

// assert file is an image because of .Object.Options.Image
func (object *ADOPTER) ValidateImageADOPTER(fileBytes []byte) (image.Image, error) {

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


