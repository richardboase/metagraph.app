import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import { FloorList } from './shared/floorList';

export function Floors(props) {

	const [ userdata, setUserdata] = useUserContext()
	const [ localdata, setLocaldata] = useLocalContext()

	const [ parent ] = useState(localdata.tab.context.object)

	return (
		<div style={ {padding:"30px 60px 30px 60px"} }>
			<FloorList subject={parent} />
		</div>
	)
}