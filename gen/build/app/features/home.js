import * as React from 'react'
import { useUserContext } from '@/context/user'
import { useLocalContext } from '@/context/local'

import VisitTab from '@/features/interfaces'

export default function Home(props) {  

	const [userdata, setUserdata] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()

	// update tabs handles the updated context and sends the user to a new interface
	function updateTabEvent(e) {
		const id = e.target.id
		setLocaldata(VisitTab(localdata, id))
	}

	return (
		<div className='flex flex-col text-sm cursor-pointer' style={ {padding:"30px 60px 30px 60px"} }>
			
			<div id="animals" className='text-xl font-bold m-4' onClick={updateTabEvent}>
			Animals
			</div>
			
			<div id="adopters" className='text-xl font-bold m-4' onClick={updateTabEvent}>
			Adopters
			</div>
			
		</div>
	)

}