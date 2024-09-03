import * as React from 'react'

import { PetsMatrix } from './petsMatrix'
import { Pets } from './pets'
import { Pet } from './pet'
import { PetAdmin } from './petAdmin'
import { PetAdmins } from './petAdmins'
import { Assets } from './assets'
import { NewPet } from './newPet'
import { EditPet } from './editPet'
import { DeletePet } from './deletePet'
import { InitUploadPet } from './initUploadPet'
import { UploadPet } from './uploadPet'

export var PetInterfaces = {
	"deletepet": {
		level: -1,
		name: "Delete", 
		component: (<DeletePet/>),
	},
	"newpet": {
		level: 0+2,
		name: "New Pet",
		component: (<NewPet />),
	},
	
	"editpet": {
		level: -1,
		name: "Edit Pet", 
		component: (<EditPet />),
	},  
	"pets": {
		level: 0+1,
		name: "Pets", 
		component: (<Pets />),
		subsublinks: ["petsmatrix", "newpet"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"petsmatrix": {
		level: 0+2,
		name: "Pets Matrix", 
		component: (<PetsMatrix />),
		subsublinks: ["newpet"],
		hasNewButton: true,
		hasListButton: true,
	},
	"pet": {
		level: 0+2,
		name: "Pet",
		subsublinks: [],
		component: (<Pet />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"petadmin": {
		level: 0+2,
		name: "Admin",
		component: (<PetAdmin />),
	},
	"petadmins": {
		level: 0+2,
		name: "Admins",
		component: (<PetAdmins />),
	},
	"petassets": {
		level: 0+2,
		name: "Pet Assets",
		component: (<Assets />),
	},
}
