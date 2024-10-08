import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import AutocompleteUsername from '@/inputs/autocompleteUsername'
import Spacer from '@/inputs/spacer'
import VisitTab from '@/features/interfaces'

import { HealthcheckupObjectGET, HealthcheckupAdminPOST } from './_fetch'

import { HealthcheckupAdmin } from './healthcheckupAdmin';

export function HealthcheckupAdmins(props) {

    const [ userdata, setUserdata] = useUserContext()
    const [ localdata, setLocaldata] = useLocalContext()

    const [object, setObject] = useState(localdata.tab.context.object)

	const [newAdmins, setNewAdmins] = useState()

	function updateObject() {
		ObjectObjectGET(userdata, object.Meta.ID)
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			setObject(data)
		})
		.catch((e) => {
			console.error(e)
		})
	}

	function deleteAdmin(id) {
		const adminID = object.Meta.Moderation.Admins[id]
		HealthcheckupAdminPOST(userdata, object.Meta.ID, "remove", adminID)
		.then(function () {
			updateObject()
		}).error(function (e) {
			console.error(e)
		})
	}

	function inputChange(obj) {
		console.log("!!!", obj)
		setNewAdmins(obj.value)
	}

	function addAdmins() {
		newAdmins.forEach(function (admin, i) {
			HealthcheckupAdminPOST(userdata, object.Meta.ID, "add", admin)
			.then(function () {
				updateObject()
			}).error(function (e) {
				console.error(e)
			})
		})
	}

    return (
		<div style={ {padding:"30px 60px 30px 60px"} } className='flex flex-col'>
			<div className='text-xl'>Add Admin</div>
			<AutocompleteUsername inputChange={inputChange} />
			{
				newAdmins && <div>
					<button onClick={addAdmins} className="my-4 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
						<div className='flex flex-row'>
							<div className='flex flex-col justify-center'>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
								</svg>
							</div>
							<div className='flex flex-col justify-center'>
								<div className='text-lg'>Add { newAdmins.join(" & ") }</div>
							</div>
						</div>
					</button>
				</div>
			}
			<Spacer/>
			<div className='text-base'>Existing Administrators:</div>
			<Spacer/>
			<div className='flex flex-col'>
				{
					object.Meta.Moderation.Admins.map(function (adminID, i) {
						return (
							<HealthcheckupAdmin key={adminID} id={i} admin={adminID} delete={deleteAdmin}/>
						)
					})
				}
			</div>
		</div>
    )

}


