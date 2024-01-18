import * as React from 'react'

import { GamesMatrix } from './gamesMatrix'
import { Games } from './games'
import { Game } from './game'
import { Assets } from './assets'
import { NewGame } from './newGame'
import { EditGame } from './editGame'
import { DeleteGame } from './deleteGame'
import { InitUploadGame } from './initUploadGame'
import { InitUploadGames } from './initUploadGames'
import { UploadGame } from './uploadGame'

export var GameInterfaces = {
	"deletegame": {
		level: -1,
		name: "Delete", 
		component: (<DeleteGame/>),
	},
	"newgame": {
		level: 0+2,
		name: "New Game",
		component: (<NewGame />),
	},
	
	"editgame": {
		level: -1,
		name: "Edit Game", 
		component: (<EditGame />),
	},  
	"games": {
		level: 0+1,
		name: "Games", 
		component: (<Games />),
		subsublinks: ["gamesmatrix", "newgame"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"gamesmatrix": {
		level: 0+2,
		name: "Games Matrix", 
		component: (<GamesMatrix />),
		subsublinks: ["newgame"],
		hasNewButton: true,
		hasListButton: true,
	},
	"game": {
		level: 0+2,
		name: "Game",
		sublinks: [],
		subsublinks: ["lobbys",""],
		component: (<Game />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"gameassets": {
		level: 0+2,
		name: "Game Assets",
		component: (<Assets />),
	},
}
