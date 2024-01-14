import * as React from 'react'
import { useUserContext } from '@/context/user'
import { useLocalContext } from '@/context/local'
import { useState, useEffect } from 'react'

import { GoBack } from '../interfaces'
import Loading from '@/app/loading'

import { StreetList } from '@/features/streets/shared/streetList'


import { QuarterObjectGET } from './_fetch'

export function Quarter(props) {  

    const [userdata, setUserdata] = useUserContext()
    const [localdata, setLocaldata] = useLocalContext() 

    const [jdata, setJdata] = useState(localdata.tab.context.object)
    const [subject, setSubject] = useState(localdata.tab.context.object)
	function getObject() {
		QuarterObjectGET(userdata, subject.Meta.ID)
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			setSubject(data)
			setJdata(JSON.stringify(data.fields))
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
				!subject && <div>
					
				</div>
			}
            
			<StreetList title="Street" subject={subject} limit={4} />
			
        </>
    )

}