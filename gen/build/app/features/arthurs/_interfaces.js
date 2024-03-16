import * as React from 'react'

import { ArthursMatrix } from './arthursMatrix'
import { Arthurs } from './arthurs'
import { Arthur } from './arthur'
import { ArthurAdmin } from './arthurAdmin'
import { ArthurAdmins } from './arthurAdmins'
import { Assets } from './assets'
import { NewArthur } from './newArthur'
import { EditArthur } from './editArthur'
import { DeleteArthur } from './deleteArthur'
import { InitUploadArthur } from './initUploadArthur'
import { UploadArthur } from './uploadArthur'

export var ArthurInterfaces = {
	"deletearthur": {
		level: -1,
		name: "Delete", 
		component: (<DeleteArthur/>),
	},
	"newarthur": {
		level: 0+2,
		name: "New Arthur",
		component: (<NewArthur />),
	},
	
	"editarthur": {
		level: -1,
		name: "Edit Arthur", 
		component: (<EditArthur />),
	},  
	"arthurs": {
		level: 0+1,
		name: "Arthurs", 
		component: (<Arthurs />),
		subsublinks: ["arthursmatrix", "newarthur"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"arthursmatrix": {
		level: 0+2,
		name: "Arthurs Matrix", 
		component: (<ArthursMatrix />),
		subsublinks: ["newarthur"],
		hasNewButton: true,
		hasListButton: true,
	},
	"arthur": {
		level: 0+2,
		name: "Arthur",
		subsublinks: ["jellys","jellynames","lobbys","arthuradmins"],
		component: (<Arthur />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"arthuradmin": {
		level: 0+2,
		name: "Admin",
		component: (<ArthurAdmin />),
	},
	"arthuradmins": {
		level: 0+2,
		name: "Admins",
		component: (<ArthurAdmins />),
	},
	"arthurassets": {
		level: 0+2,
		name: "Arthur Assets",
		component: (<Assets />),
	},
}
