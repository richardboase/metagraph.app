import * as React from 'react'

import { FloorsMatrix } from './floorsMatrix'
import { Floors } from './floors'
import { Floor } from './floor'
import { FloorAdmin } from './floorAdmin'
import { FloorAdmins } from './floorAdmins'
import { Assets } from './assets'
import { NewFloor } from './newFloor'
import { EditFloor } from './editFloor'
import { DeleteFloor } from './deleteFloor'
import { InitUploadFloor } from './initUploadFloor'
import { InitUploadFloors } from './initUploadFloors'
import { UploadFloor } from './uploadFloor'

export var FloorInterfaces = {
	"deletefloor": {
		level: -1,
		name: "Delete", 
		component: (<DeleteFloor/>),
	},
	"newfloor": {
		level: 8+2,
		name: "New Floor",
		component: (<NewFloor />),
	},
	
	"editfloor": {
		level: -1,
		name: "Edit Floor", 
		component: (<EditFloor />),
	},  
	"floors": {
		level: 8+1,
		name: "Floors", 
		component: (<Floors />),
		subsublinks: ["floorsmatrix", "newfloor"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"floorsmatrix": {
		level: 8+2,
		name: "Floors Matrix", 
		component: (<FloorsMatrix />),
		subsublinks: ["newfloor"],
		hasNewButton: true,
		hasListButton: true,
	},
	"floor": {
		level: 8+2,
		name: "Floor",
		sublinks: [],
		subsublinks: ["rooms",],
		component: (<Floor />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"flooradmin": {
		level: 8+2,
		name: "Floor",
		component: (<FloorAdmin />),
	},
	"flooradmins": {
		level: 8+2,
		name: "Floor",
		component: (<FloorAdmins />),
	},
	"floorassets": {
		level: 8+2,
		name: "Floor Assets",
		component: (<Assets />),
	},
}
