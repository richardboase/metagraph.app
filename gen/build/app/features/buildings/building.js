import * as React from 'react'
import { useUserContext } from '@/context/user'
import { useLocalContext } from '@/context/local'
import { useState, useEffect } from 'react'

import VisitTab from '../interfaces'

import { GoBack } from '../interfaces'
import Loading from '@/app/loading'

import { FloorList } from '@/features/floors/shared/floorList'


import { BuildingObjectGET } from './_fetch'

export function Building(props) {  

    const [userdata, setUserdata] = useUserContext()
    const [localdata, setLocaldata] = useLocalContext() 

    const [jdata, setJdata] = useState(localdata.tab.context.object)
    const [subject, setSubject] = useState(localdata.tab.context.object)
    const [image, setImage] = useState()

	// update tabs handles the updated context and sends the user to a new interface
	function editData() {
		setLocaldata(VisitTab(localdata, "editbuilding", localdata.tab.context))
	}

	function getObject() {
		BuildingObjectGET(userdata, subject.Meta.ID)
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			setSubject(data)
			setJdata(JSON.stringify(data.fields))
			if (data.Meta.URIs?.length > 0) {
				setImage("https://storage.googleapis.com/go-gen-test-uploads/" + data.Meta.URIs[data.Meta.URIs.length - 1])
			}
			console.log("IMAGE? src:", image)
		}) 
		.catch((e) => {
            console.error(e)
			setLocaldata(GoBack(localdata))
        })
	}

	useEffect(() => {
		getObject()
	}, [])

    return (
        <>
			{ !subject && <Loading/> }
			{
				subject && <div>
					<div className='text-2xl'>{ subject.Meta.Class } / { subject.fields.name }</div>
					<div className='flex flex-row'>
						{
							image && <div className="m-4" style={ {maxWidth:"40vw"} }>
								<img className='w-full' src={image}/>
							</div>
						}
						<div>
							<table className='m-4'>
								<tbody>
									<tr>
										<td className='font-bold'>name</td>
										<td><div className='px-4'></div></td>
										<td>{ subject.fields["name"] }</td>
									</tr>
								
									<tr>
										<td className='font-bold'>number</td>
										<td><div className='px-4'></div></td>
										<td>{ subject.fields["number"] }</td>
									</tr>
								
									<tr>
										<td className='font-bold'>xunits</td>
										<td><div className='px-4'></div></td>
										<td>{ subject.fields["xunits"] }</td>
									</tr>
								
									<tr>
										<td className='font-bold'>yunits</td>
										<td><div className='px-4'></div></td>
										<td>{ subject.fields["yunits"] }</td>
									</tr>
								
									<tr>
										<td className='font-bold'>doors</td>
										<td><div className='px-4'></div></td>
										<td>{ subject.fields["doors"] }</td>
									</tr>
								</tbody>
							</table>
							<div className='px-4'>
								<button onClick={editData} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-sm text-sm px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
									Edit Data
								</button>
							</div>
						</div>
					</div>
				</div>
			}
            
			<FloorList title="Floor" subject={subject} limit={4} />
			
        </>
    )

}