import * as React from 'react'

import { BuildingsMatrix } from './buildingsMatrix'
import { Buildings } from './buildings'
import { Building } from './building'
import { Assets } from './assets'
import { NewBuilding } from './newBuilding'
import { EditBuilding } from './editBuilding'
import { DeleteBuilding } from './deleteBuilding'
import { InitUploadBuilding } from './initUploadBuilding'
import { InitUploadBuildings } from './initUploadBuildings'
import { UploadBuilding } from './uploadBuilding'

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
		subsublinks: ["buildingsmatrix", "newbuilding"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"buildingsmatrix": {
		level: 6+2,
		name: "Buildings Matrix", 
		component: (<BuildingsMatrix />),
		subsublinks: ["newbuilding"],
		hasNewButton: true,
		hasListButton: true,
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
	"buildingassets": {
		level: 6+2,
		name: "Building Assets",
		component: (<Assets />),
	},
}
