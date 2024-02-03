import * as React from 'react'

import { CharactersMatrix } from './charactersMatrix'
import { Characters } from './characters'
import { Character } from './character'
import { CharacterAdmin } from './characterAdmin'
import { CharacterAdmins } from './characterAdmins'
import { Assets } from './assets'
import { NewCharacter } from './newCharacter'
import { EditCharacter } from './editCharacter'
import { DeleteCharacter } from './deleteCharacter'
import { InitUploadCharacter } from './initUploadCharacter'
import { InitUploadCharacters } from './initUploadCharacters'
import { UploadCharacter } from './uploadCharacter'

export var CharacterInterfaces = {
	"deletecharacter": {
		level: -1,
		name: "Delete", 
		component: (<DeleteCharacter/>),
	},
	"newcharacter": {
		level: 4+2,
		name: "New Character",
		component: (<NewCharacter />),
	},
	
	"editcharacter": {
		level: -1,
		name: "Edit Character", 
		component: (<EditCharacter />),
	},  
	"characters": {
		level: 4+1,
		name: "Characters", 
		component: (<Characters />),
		subsublinks: ["charactersmatrix", "newcharacter"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"charactersmatrix": {
		level: 4+2,
		name: "Characters Matrix", 
		component: (<CharactersMatrix />),
		subsublinks: ["newcharacter"],
		hasNewButton: true,
		hasListButton: true,
	},
	"character": {
		level: 4+2,
		name: "Character",
		subsublinks: [],
		component: (<Character />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"characteradmin": {
		level: 4+2,
		name: "Admin",
		component: (<CharacterAdmin />),
	},
	"characteradmins": {
		level: 4+2,
		name: "Admins",
		component: (<CharacterAdmins />),
	},
	"characterassets": {
		level: 4+2,
		name: "Character Assets",
		component: (<Assets />),
	},
}
