import * as React from 'react'

import { ChaptersMatrix } from './chaptersMatrix'
import { Chapters } from './chapters'
import { Chapter } from './chapter'
import { ChapterAdmin } from './chapterAdmin'
import { ChapterAdmins } from './chapterAdmins'
import { Assets } from './assets'
import { NewChapter } from './newChapter'
import { EditChapter } from './editChapter'
import { DeleteChapter } from './deleteChapter'
import { InitUploadChapter } from './initUploadChapter'
import { InitUploadChapters } from './initUploadChapters'
import { UploadChapter } from './uploadChapter'

export var ChapterInterfaces = {
	"deletechapter": {
		level: -1,
		name: "Delete", 
		component: (<DeleteChapter/>),
	},
	"newchapter": {
		level: 2+2,
		name: "New Chapter",
		component: (<NewChapter />),
	},
	
	"editchapter": {
		level: -1,
		name: "Edit Chapter", 
		component: (<EditChapter />),
	},  
	"chapters": {
		level: 2+1,
		name: "Chapters", 
		component: (<Chapters />),
		subsublinks: ["chaptersmatrix", "newchapter"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"chaptersmatrix": {
		level: 2+2,
		name: "Chapters Matrix", 
		component: (<ChaptersMatrix />),
		subsublinks: ["newchapter"],
		hasNewButton: true,
		hasListButton: true,
	},
	"chapter": {
		level: 2+2,
		name: "Chapter",
		subsublinks: ["paragraphs",],
		component: (<Chapter />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"chapteradmin": {
		level: 2+2,
		name: "Admin",
		component: (<ChapterAdmin />),
	},
	"chapteradmins": {
		level: 2+2,
		name: "Admins",
		component: (<ChapterAdmins />),
	},
	"chapterassets": {
		level: 2+2,
		name: "Chapter Assets",
		component: (<Assets />),
	},
}
