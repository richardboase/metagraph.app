import * as React from 'react'

import { JellynamesMatrix } from './jellynamesMatrix'
import { Jellynames } from './jellynames'
import { Jellyname } from './jellyname'
import { JellynameAdmin } from './jellynameAdmin'
import { JellynameAdmins } from './jellynameAdmins'
import { Assets } from './assets'
import { NewJellyname } from './newJellyname'
import { EditJellyname } from './editJellyname'
import { DeleteJellyname } from './deleteJellyname'
import { InitUploadJellyname } from './initUploadJellyname'
import { UploadJellyname } from './uploadJellyname'

export var JellynameInterfaces = {
	"deletejellyname": {
		level: -1,
		name: "Delete", 
		component: (<DeleteJellyname/>),
	},
	"newjellyname": {
		level: 2+2,
		name: "New Jellyname",
		component: (<NewJellyname />),
	},
	
	"editjellyname": {
		level: -1,
		name: "Edit Jellyname", 
		component: (<EditJellyname />),
	},  
	"jellynames": {
		level: 2+1,
		name: "Jellynames", 
		component: (<Jellynames />),
		subsublinks: ["jellynamesmatrix", "newjellyname"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"jellynamesmatrix": {
		level: 2+2,
		name: "Jellynames Matrix", 
		component: (<JellynamesMatrix />),
		subsublinks: ["newjellyname"],
		hasNewButton: true,
		hasListButton: true,
	},
	"jellyname": {
		level: 2+2,
		name: "Jellyname",
		subsublinks: [],
		component: (<Jellyname />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"jellynameadmin": {
		level: 2+2,
		name: "Admin",
		component: (<JellynameAdmin />),
	},
	"jellynameadmins": {
		level: 2+2,
		name: "Admins",
		component: (<JellynameAdmins />),
	},
	"jellynameassets": {
		level: 2+2,
		name: "Jellyname Assets",
		component: (<Assets />),
	},
}
