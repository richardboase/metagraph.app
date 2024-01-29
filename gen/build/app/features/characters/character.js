import * as React from 'react'
import { useUserContext } from '@/context/user'
import { useLocalContext } from '@/context/local'
import { useState, useEffect } from 'react'

import VisitTab from '../interfaces'

import { GoBack } from '../interfaces'
import Loading from '@/app/loading'



import { CharacterObjectGET } from './_fetch'

export function Character(props) {  

    const [userdata, setUserdata] = useUserContext()
    const [localdata, setLocaldata] = useLocalContext() 

    const [jdata, setJdata] = useState(localdata.tab.context.object)
    const [subject, setSubject] = useState(localdata.tab.context.object)
    const [image, setImage] = useState()

	// update tabs handles the updated context and sends the user to a new interface
	function editData() {
		setLocaldata(VisitTab(localdata, "editcharacter", localdata.tab.context))
	}

	function getObject() {
		CharacterObjectGET(userdata, subject.Meta.ID)
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
        <div style={ {padding:"30px 60px 30px 60px"} }>
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
							<table className='m-4 w-full'>
								<tbody>
									<tr className='flex flex-row'>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='font-bold'>name</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='px-2'>:</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className=''>{ subject.fields["name"] }</div>
											</div>
										</td>
									</tr>
								
									<tr className='flex flex-row'>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='font-bold'>age</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='px-2'>:</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className=''>{ subject.fields["age"] }</div>
											</div>
										</td>
									</tr>
								
									<tr className='flex flex-row'>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='font-bold'>gender</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='px-2'>:</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className=''>{ subject.fields["gender"] }</div>
											</div>
										</td>
									</tr>
								
									<tr className='flex flex-row'>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='font-bold'>diseases</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='px-2'>:</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className=''>{ subject.fields["diseases"] }</div>
											</div>
										</td>
									</tr>
								
									<tr className='flex flex-row'>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='font-bold'>profession</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='px-2'>:</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className=''>{ subject.fields["profession"] }</div>
											</div>
										</td>
									</tr>
								
									<tr className='flex flex-row'>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='font-bold'>socialclass</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='px-2'>:</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className=''>{ subject.fields["socialclass"] }</div>
											</div>
										</td>
									</tr>
								
									<tr className='flex flex-row'>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='font-bold'>backstory</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className='px-2'>:</div>
											</div>
										</td>
										<td className='flex flex-col justify-start'>
											<div className='w-full flex flex-row justify-end'>
												<div className=''>{ subject.fields["backstory"] }</div>
											</div>
										</td>
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
            
        </div>
    )

}