package project

import (
	"github.com/golangdaddy/leap/models"
)

func buildStructure(config models.Config) *models.Stack {
	tree := &models.Stack{
		WebsiteName: "BSVMint",
		Config:      config,
		Options: models.StackOptions{
			ChatGPT: true,
		},
	}

	// Creator object
	creator := &models.Object{
		Context: "Information about the token creator",
		Parents: []string{},
		Name:    "creator",
		Fields: []*models.Field{
			{
				Context:  "Name of the creator",
				Name:     "name",
				JSON:     "string_100",
				Required: true,
			},
			{
				Context:  "Company of the creator",
				Name:     "company",
				JSON:     "string_100",
				Required: false,
			},
			{
				Context:  "Band name, if applicable",
				Name:     "band",
				JSON:     "string_100",
				Required: false,
			},
			{
				Context:  "Artist name, if applicable",
				Name:     "artistName",
				JSON:     "string_100",
				Required: false,
			},
		},
		Options: models.Options{
			Admin: true,
		},
	}

	// Token object
	token := &models.Object{
		Context: "Information about the token being minted",
		Parents: []string{creator.Name},
		Name:    "token",
		Fields: []*models.Field{
			{
				Context:  "Type of token (Music Track, Picture, Gaming Card)",
				Name:     "tokenType",
				JSON:     "string_30",
				Required: true,
			},
			{
				Context:  "Supply of the token",
				Name:     "supply",
				JSON:     "number_int",
				Required: true,
			},
			{
				Context:  "Whether the token offers dividends",
				Name:     "hasDividend",
				JSON:     "string_10",
				Required: true,
			},
			{
				Context:  "Website associated with the token",
				Name:     "website",
				JSON:     "string_200",
				Required: false,
			},
			{
				Context:  "Twitter handle associated with the token",
				Name:     "twitter",
				JSON:     "string_50",
				Required: false,
			},
			{
				Context:  "Telegram handle associated with the token",
				Name:     "telegram",
				JSON:     "string_50",
				Required: false,
			},
			{
				Context:  "Liquidity address for the token",
				Name:     "liquidityAddress",
				JSON:     "string_100",
				Required: false,
			},
			{
				Context:  "Amount to burn for liquidity",
				Name:     "burnAmount",
				JSON:     "number_float",
				Required: false,
			},
			{
				Context:  "Mint location address",
				Name:     "mintLocation",
				JSON:     "string_100",
				Required: true,
			},
		},
		Options: models.Options{
			Admin: true,
		},
	}

	// Music Token Details
	musicDetails := &models.Object{
		Context: "Additional details for music tokens",
		Parents: []string{token.Name},
		Name:    "musicDetails",
		Fields: []*models.Field{
			{
				Context:  "Name of the album",
				Name:     "albumName",
				JSON:     "string_100",
				Required: true,
			},
			{
				Context:  "Name of the track",
				Name:     "trackName",
				JSON:     "string_100",
				Required: true,
			},
			{
				Context:  "URL or reference to the album image",
				Name:     "albumImage",
				JSON:     "string_200",
				Required: false,
			},
			{
				Context:  "URL or reference to the track image",
				Name:     "trackImage",
				JSON:     "string_200",
				Required: false,
			},
		},
	}

	// Picture Token Details
	pictureDetails := &models.Object{
		Context: "Additional details for picture tokens",
		Parents: []string{token.Name},
		Name:    "pictureDetails",
		Fields: []*models.Field{
			{
				Context:  "Name of the series",
				Name:     "seriesName",
				JSON:     "string_100",
				Required: true,
			},
			{
				Context:  "Title of the image",
				Name:     "imageTitle",
				JSON:     "string_100",
				Required: true,
			},
			{
				Context:  "URL or reference to the uploaded picture",
				Name:     "pictureUrl",
				JSON:     "string_200",
				Required: true,
			},
		},
	}

	// Gaming Card Token Details
	gamingCardDetails := &models.Object{
		Context: "Additional details for gaming card tokens",
		Parents: []string{token.Name},
		Name:    "gamingCardDetails",
		Fields: []*models.Field{
			{
				Context:  "Title of the game",
				Name:     "gameTitle",
				JSON:     "string_100",
				Required: true,
			},
			{
				Context:  "Type of the card",
				Name:     "cardType",
				JSON:     "string_50",
				Required: true,
			},
			{
				Context:  "Rarity of the card (Common, Rare, Legendary)",
				Name:     "cardRarity",
				JSON:     "string_20",
				Required: true,
			},
			{
				Context:  "URL or reference to the uploaded card image",
				Name:     "cardImageUrl",
				JSON:     "string_200",
				Required: true,
			},
		},
	}

	// Add all objects to the tree
	tree.Objects = append(tree.Objects, creator, token, musicDetails, pictureDetails, gamingCardDetails)

	return tree
}
