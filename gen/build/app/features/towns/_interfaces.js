import * as React from 'react'

import { TownsMatrix } from './townsMatrix'
import { Towns } from './towns'
import { Town } from './town'
import { TownAdmin } from './townAdmin'
import { TownAdmins } from './townAdmins'
import { Assets } from './assets'
import { NewTown } from './newTown'
import { EditTown } from './editTown'
import { DeleteTown } from './deleteTown'
import { InitUploadTown } from './initUploadTown'
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
		subsublinks: ["teststreets","streets","townadmins"],
		component: (<Town />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"townadmin": {
		level: 0+2,
		name: "Admin",
		component: (<TownAdmin />),
	},
	"townadmins": {
		level: 0+2,
		name: "Admins",
		component: (<TownAdmins />),
	},
	"townassets": {
		level: 0+2,
		name: "Town Assets",
		component: (<Assets />),
	},
}
