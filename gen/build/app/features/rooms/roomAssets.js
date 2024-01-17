import * as React from 'react'
import { useUserContext } from '@/context/user'
import { useLocalContext } from '@/context/local'
import { useState, useEffect } from 'react'

import VisitTab from '../interfaces'

import { GoBack } from '../interfaces'
import Loading from '@/app/loading'

import { AssetsUser, AssetsWallet } from '@/app/fetch'

import { RoomObjectGET } from './_fetch'

export function RoomAssets(props) {  

	const [userdata, setUserdata] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext() 
	const [subject, setSubject] = useState(localdata.tab.context.object)
	const [assets, setAssets] = useState()

	function getObject() {
		RoomObjectGET(userdata, subject.Meta.ID)
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			setSubject(data)
		}) 
		.catch((e) => {
			console.error(e)
			setLocaldata(GoBack(localdata))
		})
	}

	function getAssets() {
		AssetsWallet(userdata, subject.Meta.ID)
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			setAssets(data)
		}) 
		.catch((e) => {
			console.error(e)
			setLocaldata(GoBack(localdata))
		})
	}

	useEffect(() => {
		getObject()
		getAssets()
	}, [])

	return (
		<div style={ {padding:"30px 60px 30px 60px"} }>

		</div>
	)

}