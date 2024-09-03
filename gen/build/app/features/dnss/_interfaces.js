import * as React from 'react'

import { DnssMatrix } from './dnssMatrix'
import { Dnss } from './dnss'
import { Dns } from './dns'
import { DnsAdmin } from './dnsAdmin'
import { DnsAdmins } from './dnsAdmins'
import { Assets } from './assets'
import { NewDns } from './newDns'
import { EditDns } from './editDns'
import { DeleteDns } from './deleteDns'
import { InitUploadDns } from './initUploadDns'
import { UploadDns } from './uploadDns'

export var DnsInterfaces = {
	"deletedns": {
		level: -1,
		name: "Delete", 
		component: (<DeleteDns/>),
	},
	"newdns": {
		level: 0+2,
		name: "New Dns",
		component: (<NewDns />),
	},
	
	"editdns": {
		level: -1,
		name: "Edit Dns", 
		component: (<EditDns />),
	},  
	"dnss": {
		level: 0+1,
		name: "Dnss", 
		component: (<Dnss />),
		subsublinks: ["dnssmatrix", "newdns"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"dnssmatrix": {
		level: 0+2,
		name: "Dnss Matrix", 
		component: (<DnssMatrix />),
		subsublinks: ["newdns"],
		hasNewButton: true,
		hasListButton: true,
	},
	"dns": {
		level: 0+2,
		name: "Dns",
		subsublinks: [],
		component: (<Dns />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"dnsadmin": {
		level: 0+2,
		name: "Admin",
		component: (<DnsAdmin />),
	},
	"dnsadmins": {
		level: 0+2,
		name: "Admins",
		component: (<DnsAdmins />),
	},
	"dnsassets": {
		level: 0+2,
		name: "Dns Assets",
		component: (<Assets />),
	},
}
