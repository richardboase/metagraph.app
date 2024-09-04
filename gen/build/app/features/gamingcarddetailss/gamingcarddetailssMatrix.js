import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import { GamingcarddetailsMatrix } from './shared/gamingcarddetailsMatrix';

export function GamingcarddetailssMatrix(props) {

	const [ userdata, setUserdata] = useUserContext()
	const [ localdata, setLocaldata] = useLocalContext()

	const [ parent ] = useState(localdata.tab.context.object)

	return (
		<GamingcarddetailsMatrix subject={parent} />
	)
}