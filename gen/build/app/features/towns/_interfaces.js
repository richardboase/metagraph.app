import * as React from 'react'

import { Towns } from './towns'
import { Town } from './town'
import { NewTown } from './newTown'
import { EditTown } from './editTown'
import { DeleteTown } from './deleteTown'

export var TownInterfaces = {
	"deletetown": {
		level: -1,
		name: "Delete", 
		component: (<DeleteTown/>),
	},
	"newtown": {
		level: 0+2,
		name: "New Town",
		component: (<NewTown />),
	},
	
	"edittown": {
		level: -1,
		name: "Edit Town", 
		component: (<EditTown />),
	},  
	"towns": {
		level: 0+1,
		name: "Towns", 
		component: (<Towns />),
		subsublinks: ["newtown"],
		hasNewButton: true,
	},
	"town": {
		level: 0+2,
		name: "Town",
		sublinks: [],
		subsublinks: ["quarters",""],
		component: (<Town />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
}
