import * as React from 'react'

import { ParentsMatrix } from './parentsMatrix'
import { Parents } from './parents'
import { Parent } from './parent'
import { ParentAdmin } from './parentAdmin'
import { ParentAdmins } from './parentAdmins'
import { Assets } from './assets'
import { NewParent } from './newParent'
import { EditParent } from './editParent'
import { DeleteParent } from './deleteParent'
import { InitUploadParent } from './initUploadParent'
import { UploadParent } from './uploadParent'

export var ParentInterfaces = {
	"deleteparent": {
		level: -1,
		name: "Delete", 
		component: (<DeleteParent/>),
	},
	"newparent": {
		level: 0+2,
		name: "New Parent",
		component: (<NewParent />),
	},
	
	"editparent": {
		level: -1,
		name: "Edit Parent", 
		component: (<EditParent />),
	},  
	"parents": {
		level: 0+1,
		name: "Parents", 
		component: (<Parents />),
		subsublinks: ["parentsmatrix", "newparent"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"parentsmatrix": {
		level: 0+2,
		name: "Parents Matrix", 
		component: (<ParentsMatrix />),
		subsublinks: ["newparent"],
		hasNewButton: true,
		hasListButton: true,
	},
	"parent": {
		level: 0+2,
		name: "Parent",
		subsublinks: ["healthcheckups","parentadmins"],
		component: (<Parent />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"parentadmin": {
		level: 0+2,
		name: "Admin",
		component: (<ParentAdmin />),
	},
	"parentadmins": {
		level: 0+2,
		name: "Admins",
		component: (<ParentAdmins />),
	},
	"parentassets": {
		level: 0+2,
		name: "Parent Assets",
		component: (<Assets />),
	},
}
