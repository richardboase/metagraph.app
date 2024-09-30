import * as React from 'react'

import { ClassofthingssMatrix } from './classofthingssMatrix'
import { Classofthingss } from './classofthingss'
import { Classofthings } from './classofthings'
import { ClassofthingsAdmin } from './classofthingsAdmin'
import { ClassofthingsAdmins } from './classofthingsAdmins'
import { Assets } from './assets'
import { NewClassofthings } from './newClassofthings'
import { EditClassofthings } from './editClassofthings'
import { DeleteClassofthings } from './deleteClassofthings'
import { InitUploadClassofthings } from './initUploadClassofthings'
import { UploadClassofthings } from './uploadClassofthings'

export var ClassofthingsInterfaces = {
	"deleteclassofthings": {
		level: -1,
		name: "Delete", 
		component: (<DeleteClassofthings/>),
	},
	"newclassofthings": {
		level: 0+2,
		name: "New Classofthings",
		component: (<NewClassofthings />),
	},
	
	"editclassofthings": {
		level: -1,
		name: "Edit Classofthings", 
		component: (<EditClassofthings />),
	},  
	"classofthingss": {
		level: 0+1,
		name: "Parents", 
		component: (<Classofthingss />),
		subsublinks: ["classofthingssmatrix", "newclassofthings"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"classofthingssmatrix": {
		level: 0+2,
		name: "Classofthingss Matrix", 
		component: (<ClassofthingssMatrix />),
		subsublinks: ["newclassofthings"],
		hasNewButton: true,
		hasListButton: true,
	},
	"classofthings": {
		level: 0+2,
		name: "Classofthings",
		subsublinks: ["healthcheckups","classofthingsadmins"],
		component: (<Classofthings />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"classofthingsadmin": {
		level: 0+2,
		name: "Admin",
		component: (<ClassofthingsAdmin />),
	},
	"classofthingsadmins": {
		level: 0+2,
		name: "Admins",
		component: (<ClassofthingsAdmins />),
	},
	"classofthingsassets": {
		level: 0+2,
		name: "Classofthings Assets",
		component: (<Assets />),
	},
}
