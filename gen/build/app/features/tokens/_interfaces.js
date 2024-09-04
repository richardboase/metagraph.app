import * as React from 'react'

import { TokensMatrix } from './tokensMatrix'
import { Tokens } from './tokens'
import { Token } from './token'
import { TokenAdmin } from './tokenAdmin'
import { TokenAdmins } from './tokenAdmins'
import { Assets } from './assets'
import { NewToken } from './newToken'
import { EditToken } from './editToken'
import { DeleteToken } from './deleteToken'
import { InitUploadToken } from './initUploadToken'
import { UploadToken } from './uploadToken'

export var TokenInterfaces = {
	"deletetoken": {
		level: -1,
		name: "Delete", 
		component: (<DeleteToken/>),
	},
	"newtoken": {
		level: 2+2,
		name: "New Token",
		component: (<NewToken />),
	},
	
	"edittoken": {
		level: -1,
		name: "Edit Token", 
		component: (<EditToken />),
	},  
	"tokens": {
		level: 2+1,
		name: "Tokens", 
		component: (<Tokens />),
		subsublinks: ["tokensmatrix", "newtoken"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"tokensmatrix": {
		level: 2+2,
		name: "Tokens Matrix", 
		component: (<TokensMatrix />),
		subsublinks: ["newtoken"],
		hasNewButton: true,
		hasListButton: true,
	},
	"token": {
		level: 2+2,
		name: "Token",
		subsublinks: ["musicdetailss","picturedetailss","gamingcarddetailss","tokenadmins"],
		component: (<Token />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"tokenadmin": {
		level: 2+2,
		name: "Admin",
		component: (<TokenAdmin />),
	},
	"tokenadmins": {
		level: 2+2,
		name: "Admins",
		component: (<TokenAdmins />),
	},
	"tokenassets": {
		level: 2+2,
		name: "Token Assets",
		component: (<Assets />),
	},
}
