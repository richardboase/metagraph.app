import * as React from 'react'

import { Buildings } from './buildings'
import { Building } from './building'
import { NewBuilding } from './newBuilding'
import { EditBuilding } from './editBuilding'
import { DeleteBuilding } from './deleteBuilding'

export var BuildingInterfaces = {
	"deletebuilding": {
		level: -1,
		name: "Delete", 
		component: (<DeleteBuilding/>),
	},
	"newbuilding": {
		level: 6+2,
		name: "New Building",
		component: (<NewBuilding />),
	},
	
	"editbuilding": {
		level: -1,
		name: "Edit Building", 
		component: (<EditBuilding />),
	},  
	"buildings": {
		level: 6+1,
		name: "Buildings", 
		component: (<Buildings />),
		subsublinks: ["newbuilding"],
		hasNewButton: true,
	},
	"building": {
		level: 6+2,
		name: "Building",
		sublinks: [],
		subsublinks: ["floors",""],
		component: (<Building />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
}
