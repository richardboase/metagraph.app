import * as React from 'react'


import { FurnishingInterfaces } from '@/features/furnishings/_interfaces'
import { ArthurInterfaces } from '@/features/arthurs/_interfaces'
import { JellyInterfaces } from '@/features/jellys/_interfaces'
import { JellynameInterfaces } from '@/features/jellynames/_interfaces'
import { GameInterfaces } from '@/features/games/_interfaces'
import { LobbyInterfaces } from '@/features/lobbys/_interfaces'
import { CharacterInterfaces } from '@/features/characters/_interfaces'
import { BookInterfaces } from '@/features/books/_interfaces'
import { BookcharacterInterfaces } from '@/features/bookcharacters/_interfaces'
import { ChapterInterfaces } from '@/features/chapters/_interfaces'
import { ParagraphInterfaces } from '@/features/paragraphs/_interfaces'
import { TownInterfaces } from '@/features/towns/_interfaces'
import { TeststreetInterfaces } from '@/features/teststreets/_interfaces'
import { QuarterInterfaces } from '@/features/quarters/_interfaces'
import { StreetInterfaces } from '@/features/streets/_interfaces'
import { BuildingInterfaces } from '@/features/buildings/_interfaces'
import { FloorInterfaces } from '@/features/floors/_interfaces'
import { RoomInterfaces } from '@/features/rooms/_interfaces'

import Home from '@/features/home'
import Account from '@/features/account/account'
import AccountInbox from '@/features/account/accountInbox'
import AccountInboxMessages from '@/features/account/accountInboxMessages'

export var Interfaces = {
	"home": {
		level: 0,
		name: "Home",
		component: (<Home/>),
	},
	"account": {
		level: 1,
		name: "Your Account",
		component: (<Account/>),
	},
	"accountinbox": {
		level: 2,
		name: "Your Inbox",
		component: (<AccountInbox/>),
	},
	"accountinboxmessages": {
		level: 3,
		name: "Conversation",
		component: (<AccountInboxMessages/>),
	}
}

export function GetInterfaces() {
	var interfaces = {}
	for (const k in Interfaces) {
		interfaces[k.toLowerCase()] = Interfaces[k]
	}
	// custom features

	// FurnishingInterfaces
	for (const k in FurnishingInterfaces) {
		interfaces[k.toLowerCase()] = FurnishingInterfaces[k]
	}// ArthurInterfaces
	for (const k in ArthurInterfaces) {
		interfaces[k.toLowerCase()] = ArthurInterfaces[k]
	}// JellyInterfaces
	for (const k in JellyInterfaces) {
		interfaces[k.toLowerCase()] = JellyInterfaces[k]
	}// JellynameInterfaces
	for (const k in JellynameInterfaces) {
		interfaces[k.toLowerCase()] = JellynameInterfaces[k]
	}// GameInterfaces
	for (const k in GameInterfaces) {
		interfaces[k.toLowerCase()] = GameInterfaces[k]
	}// LobbyInterfaces
	for (const k in LobbyInterfaces) {
		interfaces[k.toLowerCase()] = LobbyInterfaces[k]
	}// CharacterInterfaces
	for (const k in CharacterInterfaces) {
		interfaces[k.toLowerCase()] = CharacterInterfaces[k]
	}// BookInterfaces
	for (const k in BookInterfaces) {
		interfaces[k.toLowerCase()] = BookInterfaces[k]
	}// BookcharacterInterfaces
	for (const k in BookcharacterInterfaces) {
		interfaces[k.toLowerCase()] = BookcharacterInterfaces[k]
	}// ChapterInterfaces
	for (const k in ChapterInterfaces) {
		interfaces[k.toLowerCase()] = ChapterInterfaces[k]
	}// ParagraphInterfaces
	for (const k in ParagraphInterfaces) {
		interfaces[k.toLowerCase()] = ParagraphInterfaces[k]
	}// TownInterfaces
	for (const k in TownInterfaces) {
		interfaces[k.toLowerCase()] = TownInterfaces[k]
	}// TeststreetInterfaces
	for (const k in TeststreetInterfaces) {
		interfaces[k.toLowerCase()] = TeststreetInterfaces[k]
	}// QuarterInterfaces
	for (const k in QuarterInterfaces) {
		interfaces[k.toLowerCase()] = QuarterInterfaces[k]
	}// StreetInterfaces
	for (const k in StreetInterfaces) {
		interfaces[k.toLowerCase()] = StreetInterfaces[k]
	}// BuildingInterfaces
	for (const k in BuildingInterfaces) {
		interfaces[k.toLowerCase()] = BuildingInterfaces[k]
	}// FloorInterfaces
	for (const k in FloorInterfaces) {
		interfaces[k.toLowerCase()] = FloorInterfaces[k]
	}// RoomInterfaces
	for (const k in RoomInterfaces) {
		interfaces[k.toLowerCase()] = RoomInterfaces[k]
	}
	
	// put id key into the object
	for (const k in interfaces) {
		interfaces[k].id = k
		for (const sub in interfaces[k].subLinks) {
			interfaces[k].subLinks[sub] = interfaces[k].subLinks[sub].toLowerCase()
		}
	}
	console.log("INTERFACES", interfaces)
	return interfaces
}

export function GoBack(localdata) {
	const previousTab = localdata.breadcrumbs[localdata.breadcrumbs.length - 2]
	return VisitTab(localdata, previousTab.id, previousTab.context)
}

export function GoBackBack(localdata) {
	const previousTab = localdata.breadcrumbs[localdata.breadcrumbs.length - 3]
	return VisitTab(localdata, previousTab.id, previousTab.context)
}

// update tabs handles the updated context and sends the user to a new interface
export default function VisitTab(localdata, tabname, context) {

	if (!context) {
		context = {}
	}

	const home = Object.assign({}, GetInterfaces()["home"])

	if (!localdata) {
		localdata = {
			"tab": home, 
			"region": "UK",
			"breadcrumbs": [home],
			"context": {}
		}
	}

	console.log("VISIT TAB", tabname, context)
	var crumbs = [];

	var tab = Object.assign({}, GetInterfaces()[tabname])
	if (!tab) {
		console.error("TAB NOT FOUND", tabname)
		return
	}

	// assign the context into the tab
	tab.context = Object.assign({}, context)

	if (tab.context._ === localdata.breadcrumbs[localdata.breadcrumbs.length-1].context?._) {
		tab.context._ = ""
	}

	console.log("SWITCHING TAB", tab)

	switch (tab.level) {
	case 0:
		crumbs = [tab]
		break
	case 1:
		crumbs = [home, tab]
		break
	case 2:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], tab]
		break
	case 3:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], tab]
		break
	case 4:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], localdata.breadcrumbs[3], tab]
		break
	case 5:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], localdata.breadcrumbs[3], localdata.breadcrumbs[4], tab]
		break
	case 6:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], localdata.breadcrumbs[3], localdata.breadcrumbs[4], localdata.breadcrumbs[5], tab]
		break
	case 7:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], localdata.breadcrumbs[3], localdata.breadcrumbs[4], localdata.breadcrumbs[5], localdata.breadcrumbs[6], tab]
		break
	case 8:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], localdata.breadcrumbs[3], localdata.breadcrumbs[4], localdata.breadcrumbs[5], localdata.breadcrumbs[6], localdata.breadcrumbs[7], tab]
		break
	case 9:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], localdata.breadcrumbs[3], localdata.breadcrumbs[4], localdata.breadcrumbs[5], localdata.breadcrumbs[6], localdata.breadcrumbs[7], localdata.breadcrumbs[8], tab]
		break
	case 10:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], localdata.breadcrumbs[3], localdata.breadcrumbs[4], localdata.breadcrumbs[5], localdata.breadcrumbs[6], localdata.breadcrumbs[7], localdata.breadcrumbs[8], localdata.breadcrumbs[9], tab]
		break
	case 11:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], localdata.breadcrumbs[3], localdata.breadcrumbs[4], localdata.breadcrumbs[5], localdata.breadcrumbs[6], localdata.breadcrumbs[7], localdata.breadcrumbs[8], localdata.breadcrumbs[9], localdata.breadcrumbs[10], tab]
		break
	case 12:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], localdata.breadcrumbs[3], localdata.breadcrumbs[4], localdata.breadcrumbs[5], localdata.breadcrumbs[6], localdata.breadcrumbs[7], localdata.breadcrumbs[8], localdata.breadcrumbs[9], localdata.breadcrumbs[10], localdata.breadcrumbs[11], tab]
		break
	case 13:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], localdata.breadcrumbs[3], localdata.breadcrumbs[4], localdata.breadcrumbs[5], localdata.breadcrumbs[6], localdata.breadcrumbs[7], localdata.breadcrumbs[8], localdata.breadcrumbs[9], localdata.breadcrumbs[10], localdata.breadcrumbs[11], localdata.breadcrumbs[12], tab]
		break
	case 14:
		crumbs = [localdata.breadcrumbs[0], localdata.breadcrumbs[1], localdata.breadcrumbs[2], localdata.breadcrumbs[3], localdata.breadcrumbs[4], localdata.breadcrumbs[5], localdata.breadcrumbs[6], localdata.breadcrumbs[7], localdata.breadcrumbs[8], localdata.breadcrumbs[9], localdata.breadcrumbs[10], localdata.breadcrumbs[11], localdata.breadcrumbs[12], localdata.breadcrumbs[13], tab]
		break
	case -1:
		localdata.breadcrumbs.map(function(crumb, i) {
			crumbs.push(crumb)
		})
		crumbs.push(tab)
		break
	}
	if (!crumbs.length) {
		console.error("NO CRUMBS")
		return
	}

	var newData = {
		"tab": tab,
		"breadcrumbs": crumbs,	
		"region": localdata.region,
	}

	return newData
}