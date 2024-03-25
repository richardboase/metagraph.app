import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import VisitTab from '@/features/interfaces';
import { titlecase } from '../_interfaces';

import Loading from '@/app/loading';
import Spacer from '@/inputs/spacer';

import { ThingMatrixRow } from './thingMatrixRow';
import {
	ThingDELETE,
	ThingsListGET,
	ThingOrderPOST,
} from '../_fetch';
import { ObjectPATCH } from '@/app/fetch'


export function ThingMatrix(props) {

	// set props.limit if you want to limit query results

	const [ userdata, setUserdata] = useUserContext()
	const [ localdata, setLocaldata] = useLocalContext()

	const [ list, setList ] = useState(null)

	function updateList() {
		ThingsListGET(userdata, props.subject?.Meta.ID, "admin", props.limit)
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			setList(data)
		})
	}

	useEffect(() => {
		updateList()
	}, [])

	function newobject() {
		setLocaldata(VisitTab(localdata, "newthing", localdata.tab.context))
	}

	function saveUpdate(rowID, fieldID, value) {
		const row = list[rowID]
		console.log("SAVEUPDATE", row, fieldID, value)
		row.fields[fieldID] = value
		ObjectPATCH(userdata, row, fieldID, value)
		.catch(function (e) {
			console.error("FAILED TO SEND", e)
		})
		setList(list)
	}

	// update tabs handles the updated context and sends the user to a new interface
	function selectItem(id) {
		console.log("SELECT Thing", id)
		const next = list[parseInt(id)]
		const context = {
			"_": next.fields.name,
			"object": next,
		}
		setLocaldata(VisitTab(localdata, "thing", context))
	}

	function moveUp(id) {
		const object = list[parseInt(id)]
		console.log("MOVE UP", object)
		ThingOrderPOST(userdata, object.Meta.ID, "up")
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
		ThingOrderPOST(userdata, object.Meta.ID, "down")
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
		ThingDELETE(userdata, object.Meta.ID)
		.then((res) => console.log(res))
		.then(function () {
			updateList()
		})
		.catch(function (e) {
			console.error("FAILED TO SEND", e)
		})
	}

	const cellStyle = {
		border: "1px solid"
	}

	return (
	<>
	{
		!list && <Loading/>
	}
		<table className='w-full'><tbody>
			<tr>
				<td className='flex flex-row justify-center font-bold px-2' style={cellStyle}>
					<div>#</div>
				</td>
				<td className='font-bold px-2' style={cellStyle}>name</td><td className='font-bold px-2' style={cellStyle}>description</td><td className='font-bold px-2' style={cellStyle}>state</td><td className='font-bold px-2' style={cellStyle}>age</td>
			</tr>
			{
				list && list.map(function (row, i) {
					return (
						<ThingMatrixRow id={i} key={i} row={row} save={saveUpdate}/>
					)
				})
			}
			<tr>
				<td className='flex flex-row justify-center font-bold px-2 bg-gray-200' style={cellStyle}>
					<div className='cursor-pointer' onClick={newobject}>+</div>
				</td>
				<td className='font-bold px-2'></td><td className='font-bold px-2'></td><td className='font-bold px-2'></td><td className='font-bold px-2'></td>
			</tr>
		</tbody></table>
		<Spacer/>

	</>
	)

}