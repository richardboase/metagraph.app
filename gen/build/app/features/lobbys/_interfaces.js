import * as React from 'react'

import { LobbysMatrix } from './lobbysMatrix'
import { Lobbys } from './lobbys'
import { Lobby } from './lobby'
import { LobbyAdmin } from './lobbyAdmin'
import { LobbyAdmins } from './lobbyAdmins'
import { Assets } from './assets'
import { NewLobby } from './newLobby'
import { EditLobby } from './editLobby'
import { DeleteLobby } from './deleteLobby'
import { InitUploadLobby } from './initUploadLobby'
import { UploadLobby } from './uploadLobby'

export var LobbyInterfaces = {
	"deletelobby": {
		level: -1,
		name: "Delete", 
		component: (<DeleteLobby/>),
	},
	"newlobby": {
		level: 2+2,
		name: "New Lobby",
		component: (<NewLobby />),
	},
	
	"editlobby": {
		level: -1,
		name: "Edit Lobby", 
		component: (<EditLobby />),
	},  
	"lobbys": {
		level: 2+1,
		name: "Lobbys", 
		component: (<Lobbys />),
		subsublinks: ["lobbysmatrix", "newlobby"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"lobbysmatrix": {
		level: 2+2,
		name: "Lobbys Matrix", 
		component: (<LobbysMatrix />),
		subsublinks: ["newlobby"],
		hasNewButton: true,
		hasListButton: true,
	},
	"lobby": {
		level: 2+2,
		name: "Lobby",
		subsublinks: ["characters",],
		component: (<Lobby />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"lobbyadmin": {
		level: 2+2,
		name: "Admin",
		component: (<LobbyAdmin />),
	},
	"lobbyadmins": {
		level: 2+2,
		name: "Admins",
		component: (<LobbyAdmins />),
	},
	"lobbyassets": {
		level: 2+2,
		name: "Lobby Assets",
		component: (<Assets />),
	},
}
