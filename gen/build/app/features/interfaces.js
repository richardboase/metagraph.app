import * as React from 'react'


import { TownInterfaces } from '@/features/towns/_interfaces'
import { QuarterInterfaces } from '@/features/quarters/_interfaces'
import { StreetInterfaces } from '@/features/streets/_interfaces'
import { BuildingInterfaces } from '@/features/buildings/_interfaces'
import { FloorInterfaces } from '@/features/floors/_interfaces'
import { RoomInterfaces } from '@/features/rooms/_interfaces'

import Home from '@/features/home'
import EditProfile from '@/features/editProfile'

export var Interfaces = {
	"home": {
		level: 0,
		name: "Home",
		component: (<Home/>),
	},
	"editprofile": {
		level: 0,
		name: "Edit Profile",
		component: (<EditProfile/>),
	},
}

export function GetInterfaces() {
	var interfaces = {}
	for (const k in Interfaces) {
		interfaces[k.toLowerCase()] = Interfaces[k]
	}
	// custom features

	// TownInterfaces
	for (const k in TownInterfaces) {
		interfaces[k.toLowerCase()] = TownInterfaces[k]
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

	console.log("VISIT TAB", tabname)
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