import * as React from 'react'
import { useState, useEffect } from 'react'
import { useUserContext } from '@/context/user'
import { useLocalContext } from '@/context/local'

import Sidebar from '@/features/account/sidebar'

import VisitTab from '@/features/interfaces'

import { InboxConvosGET } from '@/app/fetch'
import AccountInboxCompose from './accountInboxCompose'

export default function AccountInbox(props) {  

	const [userdata, setUserdata] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()

	const [convos, setConvos] = useState([]) 

	// update tabs handles the updated context and sends the user to a new interface
	function selectThread(e) {
		const id = e.target.id
		const context = {
			"conversation": id,
		}
		setLocaldata(VisitTab(localdata, "accountinboxmessages", context))
	}

	function updateConvos() {
		InboxConvosGET(userdata)
        .then((res) => res.json())
		.then((data) => {
			console.log("CONVO", data)
			setConvos(data)
		})
		.catch((e) => {
			console.log(e)
		})		
	}

	useEffect(() => {
		updateConvos()
	}, [])

	return (
		<div className='flex flex-row text-sm cursor-pointer w-full'>
			<Sidebar/>
			<div className='flex flex-col p-4  w-auto w-full'>
				<AccountInboxCompose/>
			{
				convos.map(function (item, i) {
					return (
						<div key={i} id={item.ID} className='flex flex-row m-2' onClick={selectThread}>
							<div>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
								</svg>
							</div>
							<div style={ {pointerEvents: 'none'} } className='flex flex-row'>
							{
								item.Context.Parents && item.Context.Parents.map(function (username, i) {
									return (
										<div key={i} className='mx-2 font-bold'>{username}</div>
									)
								})
							}
							</div>
							<div>{item.Name}</div>
						</div>
					)
				})
			}
			</div>
		</div>
	)

}