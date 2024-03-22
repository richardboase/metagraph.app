import * as React from 'react'

import { FurnishingsMatrix } from './furnishingsMatrix'
import { Furnishings } from './furnishings'
import { Furnishing } from './furnishing'
import { FurnishingAdmin } from './furnishingAdmin'
import { FurnishingAdmins } from './furnishingAdmins'
import { Assets } from './assets'
import { NewFurnishing } from './newFurnishing'
import { EditFurnishing } from './editFurnishing'
import { DeleteFurnishing } from './deleteFurnishing'
import { InitUploadFurnishing } from './initUploadFurnishing'
import { UploadFurnishing } from './uploadFurnishing'

export var FurnishingInterfaces = {
	"deletefurnishing": {
		level: -1,
		name: "Delete", 
		component: (<DeleteFurnishing/>),
	},
	"newfurnishing": {
		level: 12+2,
		name: "New Furnishing",
		component: (<NewFurnishing />),
	},
	
	"editfurnishing": {
		level: -1,
		name: "Edit Furnishing", 
		component: (<EditFurnishing />),
	},  
	"furnishings": {
		level: 12+1,
		name: "Furnishings", 
		component: (<Furnishings />),
		subsublinks: ["furnishingsmatrix", "newfurnishing"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"furnishingsmatrix": {
		level: 12+2,
		name: "Furnishings Matrix", 
		component: (<FurnishingsMatrix />),
		subsublinks: ["newfurnishing"],
		hasNewButton: true,
		hasListButton: true,
	},
	"furnishing": {
		level: 12+2,
		name: "Furnishing",
		subsublinks: [],
		component: (<Furnishing />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"furnishingadmin": {
		level: 12+2,
		name: "Admin",
		component: (<FurnishingAdmin />),
	},
	"furnishingadmins": {
		level: 12+2,
		name: "Admins",
		component: (<FurnishingAdmins />),
	},
	"furnishingassets": {
		level: 12+2,
		name: "Furnishing Assets",
		component: (<Assets />),
	},
}
