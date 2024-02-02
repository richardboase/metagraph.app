import * as React from 'react'

import { BooksMatrix } from './booksMatrix'
import { Books } from './books'
import { Book } from './book'
import { BookAdmin } from './bookAdmin'
import { BookAdmins } from './bookAdmins'
import { Assets } from './assets'
import { NewBook } from './newBook'
import { EditBook } from './editBook'
import { DeleteBook } from './deleteBook'
import { InitUploadBook } from './initUploadBook'
import { InitUploadBooks } from './initUploadBooks'
import { UploadBook } from './uploadBook'

export var BookInterfaces = {
	"deletebook": {
		level: -1,
		name: "Delete", 
		component: (<DeleteBook/>),
	},
	"newbook": {
		level: 0+2,
		name: "New Book",
		component: (<NewBook />),
	},
	
	"editbook": {
		level: -1,
		name: "Edit Book", 
		component: (<EditBook />),
	},  
	"books": {
		level: 0+1,
		name: "Books", 
		component: (<Books />),
		subsublinks: ["booksmatrix", "newbook"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"booksmatrix": {
		level: 0+2,
		name: "Books Matrix", 
		component: (<BooksMatrix />),
		subsublinks: ["newbook"],
		hasNewButton: true,
		hasListButton: true,
	},
	"book": {
		level: 0+2,
		name: "Book",
		sublinks: [],
		subsublinks: ["bookcharacters","chapters",],
		component: (<Book />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"bookadmin": {
		level: 0+2,
		name: "Book",
		component: (<BookAdmin />),
	},
	"bookadmins": {
		level: 0+2,
		name: "Book",
		component: (<BookAdmins />),
	},
	"bookassets": {
		level: 0+2,
		name: "Book Assets",
		component: (<Assets />),
	},
}
