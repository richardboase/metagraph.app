import * as React from 'react'

import { Rooms } from './rooms'
import { Room } from './room'
import { NewRoom } from './newRoom'
import { EditRoom } from './editRoom'
import { DeleteRoom } from './deleteRoom'

export var RoomInterfaces = {
	"deleteroom": {
		level: -1,
		name: "Delete", 
		component: (<DeleteRoom/>),
	},
	"newroom": {
		level: 10+2,
		name: "New Room",
		component: (<NewRoom />),
	},
	
	"editroom": {
		level: -1,
		name: "Edit Room", 
		component: (<EditRoom />),
	},  
	"rooms": {
		level: 10+1,
		name: "Rooms", 
		component: (<Rooms />),
		subsublinks: ["newroom"],
		hasNewButton: true,
	},
	"room": {
		level: 10+2,
		name: "Room",
		sublinks: [],
		subsublinks: [""],
		component: (<Room />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
}
