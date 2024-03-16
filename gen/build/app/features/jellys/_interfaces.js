import * as React from 'react'

import { JellysMatrix } from './jellysMatrix'
import { Jellys } from './jellys'
import { Jelly } from './jelly'
import { JellyAdmin } from './jellyAdmin'
import { JellyAdmins } from './jellyAdmins'
import { Assets } from './assets'
import { NewJelly } from './newJelly'
import { EditJelly } from './editJelly'
import { DeleteJelly } from './deleteJelly'
import { InitUploadJelly } from './initUploadJelly'
import { UploadJelly } from './uploadJelly'

export var JellyInterfaces = {
	"deletejelly": {
		level: -1,
		name: "Delete", 
		component: (<DeleteJelly/>),
	},
	"newjelly": {
		level: 2+2,
		name: "New Jelly",
		component: (<NewJelly />),
	},
	
	"inituploadjelly": {
		level: 2+2,
		name: "Upload Jelly",
		component: (<InitUploadJelly />),
	},
	"uploadjelly": {
		level: 2+3,
		name: "Upload File", 
		component: (<UploadJelly />),
	},
	
	"editjelly": {
		level: -1,
		name: "Edit Jelly", 
		component: (<EditJelly />),
	},  
	"jellys": {
		level: 2+1,
		name: "Jellies", 
		component: (<Jellys />),
		subsublinks: ["jellysmatrix", "newjelly", "inituploadjelly", "inituploadjellys"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"jellysmatrix": {
		level: 2+2,
		name: "Jellys Matrix", 
		component: (<JellysMatrix />),
		subsublinks: ["newjelly", "inituploadjelly", "inituploadjellys"],
		hasNewButton: true,
		hasListButton: true,
	},
	"jelly": {
		level: 2+2,
		name: "Jelly",
		subsublinks: [],
		component: (<Jelly />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"jellyadmin": {
		level: 2+2,
		name: "Admin",
		component: (<JellyAdmin />),
	},
	"jellyadmins": {
		level: 2+2,
		name: "Admins",
		component: (<JellyAdmins />),
	},
	"jellyassets": {
		level: 2+2,
		name: "Jelly Assets",
		component: (<Assets />),
	},
}
