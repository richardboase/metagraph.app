import * as React from 'react'

import { QuartersMatrix } from './quartersMatrix'
import { Quarters } from './quarters'
import { Quarter } from './quarter'
import { QuarterAssets } from './quarterAssets'
import { NewQuarter } from './newQuarter'
import { EditQuarter } from './editQuarter'
import { DeleteQuarter } from './deleteQuarter'
import { InitUploadQuarter } from './initUploadQuarter'
import { InitUploadQuarters } from './initUploadQuarters'
import { UploadQuarter } from './uploadQuarter'

export var QuarterInterfaces = {
	"deletequarter": {
		level: -1,
		name: "Delete", 
		component: (<DeleteQuarter/>),
	},
	"newquarter": {
		level: 2+2,
		name: "New Quarter",
		component: (<NewQuarter />),
	},
	
	"editquarter": {
		level: -1,
		name: "Edit Quarter", 
		component: (<EditQuarter />),
	},  
	"quarters": {
		level: 2+1,
		name: "Quarters", 
		component: (<Quarters />),
		subsublinks: ["quartersmatrix", "newquarter"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"quartersmatrix": {
		level: 2+2,
		name: "Quarters Matrix", 
		component: (<QuartersMatrix />),
		subsublinks: ["newquarter"],
		hasNewButton: true,
		hasListButton: true,
	},
	"quarter": {
		level: 2+2,
		name: "Quarter",
		sublinks: [],
		subsublinks: ["streets",""],
		component: (<Quarter />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"quarterassets": {
		level: 2+2,
		name: "Quarter Assets",
		component: (<QuarterAssets />),
	},
}
