import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import { TownList } from './shared/townList';

export function Towns(props) {

	const [ userdata, setUserdata] = useUserContext()
	const [ localdata, setLocaldata] = useLocalContext()

	const [ parent ] = useState(localdata.tab.context.object)

	return (
		<div style={ {padding:"30px 60px 30px 60px"} }>
			<TownList subject={parent} />
		</div>
	)
}