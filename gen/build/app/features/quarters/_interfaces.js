import * as React from 'react'

import { Quarters } from './quarters'
import { Quarter } from './quarter'
import { NewQuarter } from './newQuarter'
import { EditQuarter } from './editQuarter'
import { DeleteQuarter } from './deleteQuarter'

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
		subsublinks: ["newquarter"],
		hasNewButton: true,
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
}
