import * as React from 'react'

import { ParagraphsMatrix } from './paragraphsMatrix'
import { Paragraphs } from './paragraphs'
import { Paragraph } from './paragraph'
import { ParagraphAdmin } from './paragraphAdmin'
import { ParagraphAdmins } from './paragraphAdmins'
import { Assets } from './assets'
import { NewParagraph } from './newParagraph'
import { EditParagraph } from './editParagraph'
import { DeleteParagraph } from './deleteParagraph'
import { InitUploadParagraph } from './initUploadParagraph'
import { InitUploadParagraphs } from './initUploadParagraphs'
import { UploadParagraph } from './uploadParagraph'

export var ParagraphInterfaces = {
	"deleteparagraph": {
		level: -1,
		name: "Delete", 
		component: (<DeleteParagraph/>),
	},
	"newparagraph": {
		level: 4+2,
		name: "New Paragraph",
		component: (<NewParagraph />),
	},
	
	"editparagraph": {
		level: -1,
		name: "Edit Paragraph", 
		component: (<EditParagraph />),
	},  
	"paragraphs": {
		level: 4+1,
		name: "Paragraphs", 
		component: (<Paragraphs />),
		subsublinks: ["paragraphsmatrix", "newparagraph"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"paragraphsmatrix": {
		level: 4+2,
		name: "Paragraphs Matrix", 
		component: (<ParagraphsMatrix />),
		subsublinks: ["newparagraph"],
		hasNewButton: true,
		hasListButton: true,
	},
	"paragraph": {
		level: 4+2,
		name: "Paragraph",
		subsublinks: [],
		component: (<Paragraph />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"paragraphadmin": {
		level: 4+2,
		name: "Admin",
		component: (<ParagraphAdmin />),
	},
	"paragraphadmins": {
		level: 4+2,
		name: "Admins",
		component: (<ParagraphAdmins />),
	},
	"paragraphassets": {
		level: 4+2,
		name: "Paragraph Assets",
		component: (<Assets />),
	},
}
