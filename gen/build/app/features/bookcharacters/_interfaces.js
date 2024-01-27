import * as React from 'react'

import { BookcharactersMatrix } from './bookcharactersMatrix'
import { Bookcharacters } from './bookcharacters'
import { Bookcharacter } from './bookcharacter'
import { Assets } from './assets'
import { NewBookcharacter } from './newBookcharacter'
import { EditBookcharacter } from './editBookcharacter'
import { DeleteBookcharacter } from './deleteBookcharacter'
import { InitUploadBookcharacter } from './initUploadBookcharacter'
import { InitUploadBookcharacters } from './initUploadBookcharacters'
import { UploadBookcharacter } from './uploadBookcharacter'

export var BookcharacterInterfaces = {
	"deletebookcharacter": {
		level: -1,
		name: "Delete", 
		component: (<DeleteBookcharacter/>),
	},
	"newbookcharacter": {
		level: 2+2,
		name: "New Bookcharacter",
		component: (<NewBookcharacter />),
	},
	
	"editbookcharacter": {
		level: -1,
		name: "Edit Bookcharacter", 
		component: (<EditBookcharacter />),
	},  
	"bookcharacters": {
		level: 2+1,
		name: "Bookcharacters", 
		component: (<Bookcharacters />),
		subsublinks: ["bookcharactersmatrix", "newbookcharacter"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"bookcharactersmatrix": {
		level: 2+2,
		name: "Bookcharacters Matrix", 
		component: (<BookcharactersMatrix />),
		subsublinks: ["newbookcharacter"],
		hasNewButton: true,
		hasListButton: true,
	},
	"bookcharacter": {
		level: 2+2,
		name: "Bookcharacter",
		sublinks: [],
		subsublinks: [""],
		component: (<Bookcharacter />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"bookcharacterassets": {
		level: 2+2,
		name: "Bookcharacter Assets",
		component: (<Assets />),
	},
}
