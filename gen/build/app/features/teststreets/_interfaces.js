import * as React from 'react'

import { TeststreetsMatrix } from './teststreetsMatrix'
import { Teststreets } from './teststreets'
import { Teststreet } from './teststreet'
import { TeststreetAdmin } from './teststreetAdmin'
import { TeststreetAdmins } from './teststreetAdmins'
import { Assets } from './assets'
import { NewTeststreet } from './newTeststreet'
import { EditTeststreet } from './editTeststreet'
import { DeleteTeststreet } from './deleteTeststreet'
import { InitUploadTeststreet } from './initUploadTeststreet'
import { InitUploadTeststreets } from './initUploadTeststreets'
import { UploadTeststreet } from './uploadTeststreet'

export var TeststreetInterfaces = {
	"deleteteststreet": {
		level: -1,
		name: "Delete", 
		component: (<DeleteTeststreet/>),
	},
	"newteststreet": {
		level: 2+2,
		name: "New Teststreet",
		component: (<NewTeststreet />),
	},
	
	"editteststreet": {
		level: -1,
		name: "Edit Teststreet", 
		component: (<EditTeststreet />),
	},  
	"teststreets": {
		level: 2+1,
		name: "Teststreets", 
		component: (<Teststreets />),
		subsublinks: ["teststreetsmatrix", "newteststreet"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"teststreetsmatrix": {
		level: 2+2,
		name: "Teststreets Matrix", 
		component: (<TeststreetsMatrix />),
		subsublinks: ["newteststreet"],
		hasNewButton: true,
		hasListButton: true,
	},
	"teststreet": {
		level: 2+2,
		name: "Teststreet",
		subsublinks: [],
		component: (<Teststreet />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"teststreetadmin": {
		level: 2+2,
		name: "Admin",
		component: (<TeststreetAdmin />),
	},
	"teststreetadmins": {
		level: 2+2,
		name: "Admins",
		component: (<TeststreetAdmins />),
	},
	"teststreetassets": {
		level: 2+2,
		name: "Teststreet Assets",
		component: (<Assets />),
	},
}
