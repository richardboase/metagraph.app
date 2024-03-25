import * as React from 'react'

import { ThingsMatrix } from './thingsMatrix'
import { Things } from './things'
import { Thing } from './thing'
import { ThingAdmin } from './thingAdmin'
import { ThingAdmins } from './thingAdmins'
import { Assets } from './assets'
import { NewThing } from './newThing'
import { EditThing } from './editThing'
import { DeleteThing } from './deleteThing'
import { InitUploadThing } from './initUploadThing'
import { UploadThing } from './uploadThing'

export var ThingInterfaces = {
	"deletething": {
		level: -1,
		name: "Delete", 
		component: (<DeleteThing/>),
	},
	"newthing": {
		level: 10+2,
		name: "New Thing",
		component: (<NewThing />),
	},
	
	"editthing": {
		level: -1,
		name: "Edit Thing", 
		component: (<EditThing />),
	},  
	"things": {
		level: 10+1,
		name: "Things", 
		component: (<Things />),
		subsublinks: ["thingsmatrix", "newthing"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"thingsmatrix": {
		level: 10+2,
		name: "Things Matrix", 
		component: (<ThingsMatrix />),
		subsublinks: ["newthing"],
		hasNewButton: true,
		hasListButton: true,
	},
	"thing": {
		level: 10+2,
		name: "Thing",
		subsublinks: [],
		component: (<Thing />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"thingadmin": {
		level: 10+2,
		name: "Admin",
		component: (<ThingAdmin />),
	},
	"thingadmins": {
		level: 10+2,
		name: "Admins",
		component: (<ThingAdmins />),
	},
	"thingassets": {
		level: 10+2,
		name: "Thing Assets",
		component: (<Assets />),
	},
}
