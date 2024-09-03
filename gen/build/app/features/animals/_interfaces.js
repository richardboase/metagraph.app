import * as React from 'react'

import { AnimalsMatrix } from './animalsMatrix'
import { Animals } from './animals'
import { Animal } from './animal'
import { AnimalAdmin } from './animalAdmin'
import { AnimalAdmins } from './animalAdmins'
import { Assets } from './assets'
import { NewAnimal } from './newAnimal'
import { EditAnimal } from './editAnimal'
import { DeleteAnimal } from './deleteAnimal'
import { InitUploadAnimal } from './initUploadAnimal'
import { UploadAnimal } from './uploadAnimal'

export var AnimalInterfaces = {
	"deleteanimal": {
		level: -1,
		name: "Delete", 
		component: (<DeleteAnimal/>),
	},
	"newanimal": {
		level: 0+2,
		name: "New Animal",
		component: (<NewAnimal />),
	},
	
	"editanimal": {
		level: -1,
		name: "Edit Animal", 
		component: (<EditAnimal />),
	},  
	"animals": {
		level: 0+1,
		name: "Animals", 
		component: (<Animals />),
		subsublinks: ["animalsmatrix", "newanimal"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"animalsmatrix": {
		level: 0+2,
		name: "Animals Matrix", 
		component: (<AnimalsMatrix />),
		subsublinks: ["newanimal"],
		hasNewButton: true,
		hasListButton: true,
	},
	"animal": {
		level: 0+2,
		name: "Animal",
		subsublinks: ["healthcheckups","animaladmins"],
		component: (<Animal />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"animaladmin": {
		level: 0+2,
		name: "Admin",
		component: (<AnimalAdmin />),
	},
	"animaladmins": {
		level: 0+2,
		name: "Admins",
		component: (<AnimalAdmins />),
	},
	"animalassets": {
		level: 0+2,
		name: "Animal Assets",
		component: (<Assets />),
	},
}
