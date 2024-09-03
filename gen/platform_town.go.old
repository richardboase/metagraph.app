package main

import "github.com/golangdaddy/leap/models"

func towns() []*models.Object {

	town := &models.Object{
		Context: "A town where people live.",
		Mode:    "root",
		Parents: []string{},
		Name:    "town",
		Fields: []*models.Field{
			{
				Name:     "name",
				JSON:     "string_30",
				Required: true,
			},
		},
		Options: models.Options{
			Admin: true,
		},
	}

	teststreet := &models.Object{
		Context: "A street where people live.",
		Mode:    "many",
		Parents: []string{town.Name},
		Name:    "teststreet",
		Fields: []*models.Field{
			{
				Context:  "the name of the street",
				Name:     "name",
				JSON:     "string_60",
				Required: true,
			},
			{
				Context:  "a description of the street",
				Name:     "description",
				JSON:     "string_1000",
				Required: false,
			},
			{
				Context:  "the street junctioning at the START of the road, if any",
				Name:     "start",
				JSON:     "string_60",
				Required: false,
			},
			{
				Context:  "the junction at the END of the road, if any",
				Name:     "end",
				JSON:     "string_60",
				Required: false,
			},
		},
		Options: models.Options{},
	}

	street := &models.Object{
		Context: "A street, part of the transaportation network of a town or city.",
		Parents: []string{
			town.Name,
		},
		Name: "street",
		Fields: []*models.Field{
			{
				Context: "The street name",
				Name:    "name",
				JSON:    "string_30",
			},
			{
				Context: "the general zoning type of the street",
				Name:    "zoning",
				JSON:    "string_30",
			},
			{
				Context: "the length in meters of the street",
				Name:    "length",
				JSON:    "number_int",
			},
		},
		Options: models.Options{},
	}

	building := &models.Object{
		Context: "A building which exists in a street, could be residential, commercial, or industrial.",
		Parents: []string{
			street.Name,
		},
		Name: "building",
		Fields: []*models.Field{
			{
				Name: "name",
				JSON: "string_30",
			},
			{
				Context: "A description of the building",
				Name:    "description",
				JSON:    "string_1000",
			},
			{
				Context: "Street number(s) of the building",
				Name:    "number",
				JSON:    "number_int",
			},
			{
				Name:     "xunits",
				JSON:     "number_float",
				Required: true,
			},
			{
				Name:     "yunits",
				JSON:     "number_float",
				Required: true,
			},
			{
				Context:  "Number of floors this building has",
				Name:     "floors",
				JSON:     "number_int",
				Required: true,
			},
			{
				Context:  "Number of ground floor entrances or exits",
				Name:     "doors",
				JSON:     "number_int",
				Required: true,
			},
		},
		Options: models.Options{},
	}

	floor := &models.Object{
		Context: "A level or floor of a building where rooms or spaces are located.",
		Parents: []string{
			building.Name,
		},
		Name: "floor",
		Fields: []*models.Field{
			// using order from context
			{
				Context:  "the identifier of the floor",
				Name:     "name",
				JSON:     "string_100",
				Required: true,
			},
			{
				Context:  "the number of usable rooms on the this floor",
				Name:     "rooms",
				JSON:     "number_int",
				Required: true,
			},
		},
		Options: models.Options{},
	}

	room := &models.Object{
		Context: "A room on this floor of the building",
		Parents: []string{
			floor.Name,
		},
		Name: "room",
		Fields: []*models.Field{
			{
				Context:  "A name representing the purpose or utility of this room",
				Name:     "name",
				JSON:     "string_30",
				Required: true,
			},
			{
				Context:  "A description of the purpose or utility of this room",
				Name:     "description",
				JSON:     "string_30",
				Required: true,
			},
		},
		Options: models.Options{},
	}

	furnishing := &models.Object{
		Parents: []string{
			room.Name,
		},
		Name:    "furnishing",
		Context: "a utility or furnishing in a room, such as a mirror on the wall, decorative object, or something to store objects in",
		Fields: []*models.Field{
			{
				Context:  "the name of the utility or furnature",
				Name:     "name",
				JSON:     "string_30",
				Required: true,
			},
			{
				Context:  "the description of the utility or furnature",
				Name:     "description",
				JSON:     "string_100",
				Required: true,
			},
			{
				Context:  "the state of the utility or furnature",
				Name:     "state",
				JSON:     "string_100",
				Required: true,
			},
			{
				Context:  "age of the object in days",
				Name:     "age",
				JSON:     "number_int",
				Required: true,
			},
		},
		Options: models.Options{},
	}

	thing := &models.Object{
		Parents: []string{
			room.Name,
		},
		Name:    "thing",
		Context: "a distinct ant transferrable object of any size, could be anything",
		Fields: []*models.Field{
			{
				Context:  "the shortest description of the object",
				Name:     "name",
				JSON:     "string_60",
				Required: true,
			},
			{
				Context:  "a full description of the object",
				Name:     "description",
				JSON:     "string_100",
				Required: true,
			},
			{
				Context:  `the state of the object, for example: a tumbler could be "half full with water"`,
				Name:     "state",
				JSON:     "string_60",
				Required: true,
			},
			{
				Context:  "age of the object in days",
				Name:     "age",
				JSON:     "number_int",
				Required: true,
			},
		},
		Options: models.Options{},
	}

	objects := []*models.Object{}
	objects = append(objects, town)
	objects = append(objects, teststreet)

	objects = append(objects, street)
	objects = append(objects, building)
	objects = append(objects, floor)
	objects = append(objects, room)
	objects = append(objects, thing)
	objects = append(objects, furnishing)
	return objects
}
