package structure

import (
	"testing"

	"github.com/golangdaddy/leap/models"
)

func TestStructure(t *testing.T) {

	buildStructure(
		models.Config{
			WebsocketHost: "server-go-gen-test-da7z6jf32a-nw.a.run.app",
			WebAPI:        "https://newtown.vercel.app/",
			HostAPI:       "https://server-go-gen-test-da7z6jf32a-nw.a.run.app/",
			RepoURI:       "github.com/golangdaddy/newtown",
			SiteName:      "NewTown",
			ProjectID:     "npg-generic",
			ProjectName:   "go-gen-test",
			ProjectRegion: "europe-west2-b",
		},
	)
}
