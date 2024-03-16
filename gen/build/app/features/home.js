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
			
			<div id="arthurs" className='text-xl font-bold m-4' onClick={updateTabEvent}>
			Arthurs
			</div>
			
			<div id="games" className='text-xl font-bold m-4' onClick={updateTabEvent}>
			Games
			</div>
			
			<div id="books" className='text-xl font-bold m-4' onClick={updateTabEvent}>
			Books
			</div>
			
			<div id="towns" className='text-xl font-bold m-4' onClick={updateTabEvent}>
			Towns
			</div>
			
		</div>
	)

}