import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import VisitTab from '@/features/interfaces'

import { ParagraphObjectGET, ParagraphAdminAddPOST, ParagraphAdminRemovePOST } from './_fetch'

import { ParagraphAdmin } from './paragraphAdmin';

export function ParagraphAdmins(props) {

    const [ userdata, setUserdata] = useUserContext()
    const [ localdata, setLocaldata] = useLocalContext()

    const [project, setProject] = useState(localdata.tab.context.object)

	const [newAdmins, setNewAdmins] = useState()

    console.log("FEATURES >> PROJECTS >> ADMINS", localdata)

	function updateProject() {
		ProjectObjectGET(userdata, project.Meta.ID)
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			setProject(data)
		})
		.catch((e) => {
			console.error(e)
		})
	}

    // update tabs handles the updated context and sends the user to a new interface
    function updateTabEvent(e) {
        const id = e.target.id
        console.log("SELECT PROJECT", id)
        const next = projects[id.split("_")[1]]
        const context = {
            "_": next.name,
            "object": next
        }
        setLocaldata(VisitTab(localdata, "project", context))
    }

	function deleteAdmin(id) {
		const adminID = project.Meta.Moderation.Admins[id]
		ProjectAdminRemovePOST(userdata, project.Meta.ID, adminID)
		.then(updateProject)
	}

	function inputChange(obj) {
		console.log("!!!", obj)
		setNewAdmins(obj.value)
	}

	function addAdmins() {
		newAdmins.forEach(function (admin, i) {
			ProjectAdminAddPOST(userdata, project.Meta.ID, admin)
		})
		updateProject()
	}

    return (
		<div className='flex flex-col'>
			<div className='text-2xl'>Add Admin</div>
			<AutocompleteUsername inputChange={inputChange} />
			<Spacer/>
			<div>
			{
				newAdmins && <button onClick={addAdmins} className="my-4 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
					<div className='flex flex-row'>
						<div className='flex flex-col justify-center'>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</div>
						<div className='flex flex-col justify-center'>
							<div className='text-xl'>Add { newAdmins.join(" & ") }</div>
						</div>
					</div>
				</button>
			}
			</div>
			<Spacer/>
			<div className='text-2xl'>Existing Administrators:</div>
			<Spacer/>
			<div className='flex flex-col'>
				{
					project.Meta.Moderation.Admins.map(function (adminID, i) {
						return (
							<Admin key={adminID} id={i} admin={adminID} delete={deleteAdmin}/>
						)
					})
				}
			</div>
		</div>
    )

}


