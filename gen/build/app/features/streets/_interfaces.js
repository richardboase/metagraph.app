import * as React from 'react'

import { StreetsMatrix } from './streetsMatrix'
import { Streets } from './streets'
import { Street } from './street'
import { StreetAdmin } from './streetAdmin'
import { StreetAdmins } from './streetAdmins'
import { Assets } from './assets'
import { NewStreet } from './newStreet'
import { EditStreet } from './editStreet'
import { DeleteStreet } from './deleteStreet'
import { InitUploadStreet } from './initUploadStreet'
import { UploadStreet } from './uploadStreet'

export var StreetInterfaces = {
	"deletestreet": {
		level: -1,
		name: "Delete", 
		component: (<DeleteStreet/>),
	},
	"newstreet": {
		level: 2+2,
		name: "New Street",
		component: (<NewStreet />),
	},
	
	"editstreet": {
		level: -1,
		name: "Edit Street", 
		component: (<EditStreet />),
	},  
	"streets": {
		level: 2+1,
		name: "Streets", 
		component: (<Streets />),
		subsublinks: ["streetsmatrix", "newstreet"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"streetsmatrix": {
		level: 2+2,
		name: "Streets Matrix", 
		component: (<StreetsMatrix />),
		subsublinks: ["newstreet"],
		hasNewButton: true,
		hasListButton: true,
	},
	"street": {
		level: 2+2,
		name: "Street",
		subsublinks: ["buildings",],
		component: (<Street />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"streetadmin": {
		level: 2+2,
		name: "Admin",
		component: (<StreetAdmin />),
	},
	"streetadmins": {
		level: 2+2,
		name: "Admins",
		component: (<StreetAdmins />),
	},
	"streetassets": {
		level: 2+2,
		name: "Street Assets",
		component: (<Assets />),
	},
}
