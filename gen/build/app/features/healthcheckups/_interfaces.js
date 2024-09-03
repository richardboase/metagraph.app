import * as React from 'react'

import { HealthcheckupsMatrix } from './healthcheckupsMatrix'
import { Healthcheckups } from './healthcheckups'
import { Healthcheckup } from './healthcheckup'
import { HealthcheckupAdmin } from './healthcheckupAdmin'
import { HealthcheckupAdmins } from './healthcheckupAdmins'
import { Assets } from './assets'
import { NewHealthcheckup } from './newHealthcheckup'
import { EditHealthcheckup } from './editHealthcheckup'
import { DeleteHealthcheckup } from './deleteHealthcheckup'
import { InitUploadHealthcheckup } from './initUploadHealthcheckup'
import { UploadHealthcheckup } from './uploadHealthcheckup'

export var HealthcheckupInterfaces = {
	"deletehealthcheckup": {
		level: -1,
		name: "Delete", 
		component: (<DeleteHealthcheckup/>),
	},
	"newhealthcheckup": {
		level: 2+2,
		name: "New Healthcheckup",
		component: (<NewHealthcheckup />),
	},
	
	"edithealthcheckup": {
		level: -1,
		name: "Edit Healthcheckup", 
		component: (<EditHealthcheckup />),
	},  
	"healthcheckups": {
		level: 2+1,
		name: "Healthcheckups", 
		component: (<Healthcheckups />),
		subsublinks: ["healthcheckupsmatrix", "newhealthcheckup"],
		hasNewButton: true,
		hasSpreadsheetButton: true,
	},
	"healthcheckupsmatrix": {
		level: 2+2,
		name: "Healthcheckups Matrix", 
		component: (<HealthcheckupsMatrix />),
		subsublinks: ["newhealthcheckup"],
		hasNewButton: true,
		hasListButton: true,
	},
	"healthcheckup": {
		level: 2+2,
		name: "Healthcheckup",
		subsublinks: [],
		component: (<Healthcheckup />),
		hasDeleteButton: true,
		hasEditButton: true,
	},
	"healthcheckupadmin": {
		level: 2+2,
		name: "Admin",
		component: (<HealthcheckupAdmin />),
	},
	"healthcheckupadmins": {
		level: 2+2,
		name: "Admins",
		component: (<HealthcheckupAdmins />),
	},
	"healthcheckupassets": {
		level: 2+2,
		name: "Healthcheckup Assets",
		component: (<Assets />),
	},
}
