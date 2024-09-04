import * as React from 'react'

import { PicturedetailssMatrix } from './picturedetailssMatrix'
import { Picturedetailss } from './picturedetailss'
import { Picturedetails } from './picturedetails'
import { PicturedetailsAdmin } from './picturedetailsAdmin'
import { PicturedetailsAdmins } from './picturedetailsAdmins'
import { Assets } from './assets'
import { NewPicturedetails } from './newPicturedetails'
import { EditPicturedetails } from './editPicturedetails'
import { DeletePicturedetails } from './deletePicturedetails'
import { InitUploadPicturedetails } from './initUploadPicturedetails'
import { UploadPicturedetails } from './uploadPicturedetails'

export var PicturedetailsInterfaces = {
	"deletepicturedetails": {
		level: -1,
		name: "Delete", 
		component: (<DeletePicturedetails/>),
	},
	"newpicturedetails": {
		level: 4+2,
		name: "New Picturedetails",
		component: (<NewPicturedetails />),
	},
	
	"editpicturedetails": {
		level: -1,
		name: "Edit Picturedetails", 
		component: (<EditPicturedetails />),
	},  
	"picturedetailss": {
		level: 4+1,
		name: "Picturedetailss", 
		component: (<Picturedetailss />),
		subsublinks: ["picturedetailssmatrix", "newpicturedetails"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"picturedetailssmatrix": {
		level: 4+2,
		name: "Picturedetailss Matrix", 
		component: (<PicturedetailssMatrix />),
		subsublinks: ["newpicturedetails"],
		hasNewButton: true,
		hasListButton: true,
	},
	"picturedetails": {
		level: 4+2,
		name: "Picturedetails",
		subsublinks: [],
		component: (<Picturedetails />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"picturedetailsadmin": {
		level: 4+2,
		name: "Admin",
		component: (<PicturedetailsAdmin />),
	},
	"picturedetailsadmins": {
		level: 4+2,
		name: "Admins",
		component: (<PicturedetailsAdmins />),
	},
	"picturedetailsassets": {
		level: 4+2,
		name: "Picturedetails Assets",
		component: (<Assets />),
	},
}
