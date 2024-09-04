import * as React from 'react'

import { CreatorsMatrix } from './creatorsMatrix'
import { Creators } from './creators'
import { Creator } from './creator'
import { CreatorAdmin } from './creatorAdmin'
import { CreatorAdmins } from './creatorAdmins'
import { Assets } from './assets'
import { NewCreator } from './newCreator'
import { EditCreator } from './editCreator'
import { DeleteCreator } from './deleteCreator'
import { InitUploadCreator } from './initUploadCreator'
import { UploadCreator } from './uploadCreator'

export var CreatorInterfaces = {
	"deletecreator": {
		level: -1,
		name: "Delete", 
		component: (<DeleteCreator/>),
	},
	"newcreator": {
		level: 0+2,
		name: "New Creator",
		component: (<NewCreator />),
	},
	
	"editcreator": {
		level: -1,
		name: "Edit Creator", 
		component: (<EditCreator />),
	},  
	"creators": {
		level: 0+1,
		name: "Creators", 
		component: (<Creators />),
		subsublinks: ["creatorsmatrix", "newcreator"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"creatorsmatrix": {
		level: 0+2,
		name: "Creators Matrix", 
		component: (<CreatorsMatrix />),
		subsublinks: ["newcreator"],
		hasNewButton: true,
		hasListButton: true,
	},
	"creator": {
		level: 0+2,
		name: "Creator",
		subsublinks: ["tokens","creatoradmins"],
		component: (<Creator />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"creatoradmin": {
		level: 0+2,
		name: "Admin",
		component: (<CreatorAdmin />),
	},
	"creatoradmins": {
		level: 0+2,
		name: "Admins",
		component: (<CreatorAdmins />),
	},
	"creatorassets": {
		level: 0+2,
		name: "Creator Assets",
		component: (<Assets />),
	},
}
