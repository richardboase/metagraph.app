import * as React from 'react'

import { DonationsMatrix } from './donationsMatrix'
import { Donations } from './donations'
import { Donation } from './donation'
import { DonationAdmin } from './donationAdmin'
import { DonationAdmins } from './donationAdmins'
import { Assets } from './assets'
import { NewDonation } from './newDonation'
import { EditDonation } from './editDonation'
import { DeleteDonation } from './deleteDonation'
import { InitUploadDonation } from './initUploadDonation'
import { UploadDonation } from './uploadDonation'

export var DonationInterfaces = {
	"deletedonation": {
		level: -1,
		name: "Delete", 
		component: (<DeleteDonation/>),
	},
	"newdonation": {
		level: 0+2,
		name: "New Donation",
		component: (<NewDonation />),
	},
	
	"editdonation": {
		level: -1,
		name: "Edit Donation", 
		component: (<EditDonation />),
	},  
	"donations": {
		level: 0+1,
		name: "Donations", 
		component: (<Donations />),
		subsublinks: ["donationsmatrix", "newdonation"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"donationsmatrix": {
		level: 0+2,
		name: "Donations Matrix", 
		component: (<DonationsMatrix />),
		subsublinks: ["newdonation"],
		hasNewButton: true,
		hasListButton: true,
	},
	"donation": {
		level: 0+2,
		name: "Donation",
		subsublinks: [],
		component: (<Donation />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"donationadmin": {
		level: 0+2,
		name: "Admin",
		component: (<DonationAdmin />),
	},
	"donationadmins": {
		level: 0+2,
		name: "Admins",
		component: (<DonationAdmins />),
	},
	"donationassets": {
		level: 0+2,
		name: "Donation Assets",
		component: (<Assets />),
	},
}
