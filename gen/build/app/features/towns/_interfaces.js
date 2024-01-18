import * as React from 'react'

import { TownsMatrix } from './townsMatrix'
import { Towns } from './towns'
import { Town } from './town'
import { Assets } from './assets'
import { NewTown } from './newTown'
import { EditTown } from './editTown'
import { DeleteTown } from './deleteTown'
import { InitUploadTown } from './initUploadTown'
import { InitUploadTowns } from './initUploadTowns'
import { UploadTown } from './uploadTown'

export var TownInterfaces = {
	"deletetown": {
		level: -1,
		name: "Delete", 
		component: (<DeleteTown/>),
	},
	"newtown": {
		level: 0+2,
		name: "New Town",
		component: (<NewTown />),
	},
	
	"edittown": {
		level: -1,
		name: "Edit Town", 
		component: (<EditTown />),
	},  
	"towns": {
		level: 0+1,
		name: "Towns", 
		component: (<Towns />),
		subsublinks: ["townsmatrix", "newtown"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"townsmatrix": {
		level: 0+2,
		name: "Towns Matrix", 
		component: (<TownsMatrix />),
		subsublinks: ["newtown"],
		hasNewButton: true,
		hasListButton: true,
	},
	"town": {
		level: 0+2,
		name: "Town",
		sublinks: [],
		subsublinks: ["quarters",""],
		component: (<Town />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"townassets": {
		level: 0+2,
		name: "Town Assets",
		component: (<Assets />),
	},
}
