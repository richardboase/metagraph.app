import * as React from 'react'

import { FloorMatrix } from './shared/floorMatrix'
import { Floors } from './floors'
import { Floor } from './floor'
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
		subsublinks: ["newfloor"],
		hasNewButton: true,
	},
	"floorsmatrix": {
		level: 8+1,
		name: "Floors", 
		component: (<FloorMatrix />),
		subsublinks: ["newfloor"],
		hasNewButton: true,
	},
	"floor": {
		level: 8+2,
		name: "Floor",
		sublinks: [],
		subsublinks: ["rooms",""],
		component: (<Floor />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
}
