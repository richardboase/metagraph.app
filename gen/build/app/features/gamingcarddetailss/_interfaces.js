import * as React from 'react'

import { GamingcarddetailssMatrix } from './gamingcarddetailssMatrix'
import { Gamingcarddetailss } from './gamingcarddetailss'
import { Gamingcarddetails } from './gamingcarddetails'
import { GamingcarddetailsAdmin } from './gamingcarddetailsAdmin'
import { GamingcarddetailsAdmins } from './gamingcarddetailsAdmins'
import { Assets } from './assets'
import { NewGamingcarddetails } from './newGamingcarddetails'
import { EditGamingcarddetails } from './editGamingcarddetails'
import { DeleteGamingcarddetails } from './deleteGamingcarddetails'
import { InitUploadGamingcarddetails } from './initUploadGamingcarddetails'
import { UploadGamingcarddetails } from './uploadGamingcarddetails'

export var GamingcarddetailsInterfaces = {
	"deletegamingcarddetails": {
		level: -1,
		name: "Delete", 
		component: (<DeleteGamingcarddetails/>),
	},
	"newgamingcarddetails": {
		level: 4+2,
		name: "New Gamingcarddetails",
		component: (<NewGamingcarddetails />),
	},
	
	"editgamingcarddetails": {
		level: -1,
		name: "Edit Gamingcarddetails", 
		component: (<EditGamingcarddetails />),
	},  
	"gamingcarddetailss": {
		level: 4+1,
		name: "Gamingcarddetailss", 
		component: (<Gamingcarddetailss />),
		subsublinks: ["gamingcarddetailssmatrix", "newgamingcarddetails"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"gamingcarddetailssmatrix": {
		level: 4+2,
		name: "Gamingcarddetailss Matrix", 
		component: (<GamingcarddetailssMatrix />),
		subsublinks: ["newgamingcarddetails"],
		hasNewButton: true,
		hasListButton: true,
	},
	"gamingcarddetails": {
		level: 4+2,
		name: "Gamingcarddetails",
		subsublinks: [],
		component: (<Gamingcarddetails />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"gamingcarddetailsadmin": {
		level: 4+2,
		name: "Admin",
		component: (<GamingcarddetailsAdmin />),
	},
	"gamingcarddetailsadmins": {
		level: 4+2,
		name: "Admins",
		component: (<GamingcarddetailsAdmins />),
	},
	"gamingcarddetailsassets": {
		level: 4+2,
		name: "Gamingcarddetails Assets",
		component: (<Assets />),
	},
}
