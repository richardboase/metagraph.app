import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import VisitTab from '@/features/interfaces';
import { titlecase } from '../_interfaces';
import Loading from '@/app/loading'
import Spacer from '@/inputs/spacer';

import { BookcharacterListRow } from './bookcharacterListRow';
import { BookcharacterListRowJob } from './bookcharacterListRowJob';
import { BookcharacterDELETE, BookcharactersListGET, BookcharacterOrderPOST } from '../_fetch';

export function BookcharacterList(props) {

	const [ userdata, setUserdata] = useUserContext()
	const [ localdata, setLocaldata] = useLocalContext()

	const [ list, setList ] = useState(null)

	var mode = "modified"
	
	

	function updateList() {
		BookcharactersListGET(userdata, props.subject?.Meta.ID, mode, props.limit)
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			setList(data)
		})
	}

	useEffect(() => {
		updateList()
	}, [])

	// update tabs handles the updated context and sends the user to a new interface
	function selectItem(id) {
		console.log("SELECT Bookcharacter", id)
		const next = list[parseInt(id)]
		const context = {
			"_": next.fields.name,
			"object": next,
		}
		setLocaldata(VisitTab(localdata, "bookcharacter", context))
	}

	function selectChild() {
		setLocaldata(VisitTab(localdata, "bookcharacters", context))
	}

	function moveUp(id) {
		const object = list[parseInt(id)]
		console.log("MOVE UP", object)
		BookcharacterOrderPOST(userdata, object.Meta.ID, "up")
		.then((res) => console.log(res))
		.then(function () {
			updateList()
		})
		.catch(function (e) {
			console.error("FAILED TO SEND", e)
		})
	}

	function moveDown(id) {
		const object = list[parseInt(id)]
		console.log("MOVE DOWN", object)
		BookcharacterOrderPOST(userdata, object.Meta.ID, "down")
		.then((res) => console.log(res))
		.then(function () {
			updateList()
		})
		.catch(function (e) {
			console.error("FAILED TO SEND", e)
		})
	}

	function deleteItem(id) {
		const object = list[parseInt(id)]
		console.log("DELETING", object)
		BookcharacterDELETE(userdata, object.Meta.ID)
		.then((res) => console.log(res))
		.then(function () {
			updateList()
		})
		.catch(function (e) {
			console.error("FAILED TO SEND", e)
		})
	}

	return (
	<div className='flex flex-col my-4'>
	{
		props.title && <div className='py-4 my-4 text-xl font-bold cursor-pointer' onClick={selectChild}>{props.title}s:</div>
	}
	{
		props.title && <hr/>
	}
	{
		!list && <Loading/>
	}
	{
		list && list.map(function (item, i) {

			return (
				<div key={i}>
					
					<BookcharacterListRow id={i} listLength={list.length} item={item} select={selectItem} moveUp={moveUp} moveDown={moveDown} delete={deleteItem}/>
					
					
					<Spacer/>
				</div>
			)
		})
	}
	</div>
	)

}