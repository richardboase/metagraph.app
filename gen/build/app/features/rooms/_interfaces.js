import * as React from 'react'

import { RoomsMatrix } from './roomsMatrix'
import { Rooms } from './rooms'
import { Room } from './room'
import { RoomAdmin } from './roomAdmin'
import { RoomAdmins } from './roomAdmins'
import { Assets } from './assets'
import { NewRoom } from './newRoom'
import { EditRoom } from './editRoom'
import { DeleteRoom } from './deleteRoom'
import { InitUploadRoom } from './initUploadRoom'
import { UploadRoom } from './uploadRoom'

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
		subsublinks: ["roomsmatrix", "newroom"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"roomsmatrix": {
		level: 10+2,
		name: "Rooms Matrix", 
		component: (<RoomsMatrix />),
		subsublinks: ["newroom"],
		hasNewButton: true,
		hasListButton: true,
	},
	"room": {
		level: 10+2,
		name: "Room",
		subsublinks: ["furnishings",],
		component: (<Room />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"roomadmin": {
		level: 10+2,
		name: "Admin",
		component: (<RoomAdmin />),
	},
	"roomadmins": {
		level: 10+2,
		name: "Admins",
		component: (<RoomAdmins />),
	},
	"roomassets": {
		level: 10+2,
		name: "Room Assets",
		component: (<Assets />),
	},
}
