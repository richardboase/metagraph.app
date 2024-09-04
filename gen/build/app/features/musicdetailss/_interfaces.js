import * as React from 'react'

import { MusicdetailssMatrix } from './musicdetailssMatrix'
import { Musicdetailss } from './musicdetailss'
import { Musicdetails } from './musicdetails'
import { MusicdetailsAdmin } from './musicdetailsAdmin'
import { MusicdetailsAdmins } from './musicdetailsAdmins'
import { Assets } from './assets'
import { NewMusicdetails } from './newMusicdetails'
import { EditMusicdetails } from './editMusicdetails'
import { DeleteMusicdetails } from './deleteMusicdetails'
import { InitUploadMusicdetails } from './initUploadMusicdetails'
import { UploadMusicdetails } from './uploadMusicdetails'

export var MusicdetailsInterfaces = {
	"deletemusicdetails": {
		level: -1,
		name: "Delete", 
		component: (<DeleteMusicdetails/>),
	},
	"newmusicdetails": {
		level: 4+2,
		name: "New Musicdetails",
		component: (<NewMusicdetails />),
	},
	
	"editmusicdetails": {
		level: -1,
		name: "Edit Musicdetails", 
		component: (<EditMusicdetails />),
	},  
	"musicdetailss": {
		level: 4+1,
		name: "Musicdetailss", 
		component: (<Musicdetailss />),
		subsublinks: ["musicdetailssmatrix", "newmusicdetails"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"musicdetailssmatrix": {
		level: 4+2,
		name: "Musicdetailss Matrix", 
		component: (<MusicdetailssMatrix />),
		subsublinks: ["newmusicdetails"],
		hasNewButton: true,
		hasListButton: true,
	},
	"musicdetails": {
		level: 4+2,
		name: "Musicdetails",
		subsublinks: [],
		component: (<Musicdetails />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"musicdetailsadmin": {
		level: 4+2,
		name: "Admin",
		component: (<MusicdetailsAdmin />),
	},
	"musicdetailsadmins": {
		level: 4+2,
		name: "Admins",
		component: (<MusicdetailsAdmins />),
	},
	"musicdetailsassets": {
		level: 4+2,
		name: "Musicdetails Assets",
		component: (<Assets />),
	},
}
