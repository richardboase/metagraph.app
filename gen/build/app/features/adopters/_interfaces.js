import * as React from 'react'

import { AdoptersMatrix } from './adoptersMatrix'
import { Adopters } from './adopters'
import { Adopter } from './adopter'
import { AdopterAdmin } from './adopterAdmin'
import { AdopterAdmins } from './adopterAdmins'
import { Assets } from './assets'
import { NewAdopter } from './newAdopter'
import { EditAdopter } from './editAdopter'
import { DeleteAdopter } from './deleteAdopter'
import { InitUploadAdopter } from './initUploadAdopter'
import { UploadAdopter } from './uploadAdopter'

export var AdopterInterfaces = {
	"deleteadopter": {
		level: -1,
		name: "Delete", 
		component: (<DeleteAdopter/>),
	},
	"newadopter": {
		level: 0+2,
		name: "New Adopter",
		component: (<NewAdopter />),
	},
	
	"editadopter": {
		level: -1,
		name: "Edit Adopter", 
		component: (<EditAdopter />),
	},  
	"adopters": {
		level: 0+1,
		name: "Adopters", 
		component: (<Adopters />),
		subsublinks: ["adoptersmatrix", "newadopter"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"adoptersmatrix": {
		level: 0+2,
		name: "Adopters Matrix", 
		component: (<AdoptersMatrix />),
		subsublinks: ["newadopter"],
		hasNewButton: true,
		hasListButton: true,
	},
	"adopter": {
		level: 0+2,
		name: "Adopter",
		subsublinks: ["adopteradmins"],
		component: (<Adopter />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"adopteradmin": {
		level: 0+2,
		name: "Admin",
		component: (<AdopterAdmin />),
	},
	"adopteradmins": {
		level: 0+2,
		name: "Admins",
		component: (<AdopterAdmins />),
	},
	"adopterassets": {
		level: 0+2,
		name: "Adopter Assets",
		component: (<Assets />),
	},
}
