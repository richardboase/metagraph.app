import * as React from 'react'

import { Streets } from './streets'
import { Street } from './street'
import { NewStreet } from './newStreet'
import { EditStreet } from './editStreet'
import { DeleteStreet } from './deleteStreet'

export var StreetInterfaces = {
	"deletestreet": {
		level: -1,
		name: "Delete", 
		component: (<DeleteStreet/>),
	},
	"newstreet": {
		level: 4+2,
		name: "New Street",
		component: (<NewStreet />),
	},
	
	"editstreet": {
		level: -1,
		name: "Edit Street", 
		component: (<EditStreet />),
	},  
	"streets": {
		level: 4+1,
		name: "Streets", 
		component: (<Streets />),
		subsublinks: ["newstreet"],
		hasNewButton: true,
	},
	"street": {
		level: 4+2,
		name: "Street",
		sublinks: [],
		subsublinks: ["buildings",""],
		component: (<Street />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
}
