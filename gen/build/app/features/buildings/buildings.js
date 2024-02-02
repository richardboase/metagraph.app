import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import Loading from '@/app/loading'

import { AI } from './forms/ai';
import { BuildingList } from './shared/buildingList';

export function Buildings(props) {

	const [ userdata, setUserdata] = useUserContext()
	const [ localdata, setLocaldata] = useLocalContext()

	const [ subject ] = useState(localdata.tab.context.object)

	const [promptToggle, setPromptToggle] = useState(true)

	function updateList(state) {
		setPromptToggle(state)
	}

	return (
		<div style={ {padding:"30px 60px 30px 60px"} }>
			<AI subject={subject} updateList={updateList} collection="buildings"/>
			{
				!promptToggle && <Loading/>
			}
			{
				promptToggle && <BuildingList subject={subject} native={true} />
			}
		</div>
	)
}