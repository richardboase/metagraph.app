import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import VisitTab from '@/features/interfaces';
import { titlecase } from '../_interfaces';

import Loading from '@/app/loading';
import Spacer from '@/inputs/spacer';

import { AdopterMatrixRow } from './adopterMatrixRow';
import {
	AdopterDELETE,
	AdoptersListGET,
	AdopterOrderPOST,
} from '../_fetch';
import { ObjectPATCH } from '@/app/fetch'


export function AdopterMatrix(props) {

	// set props.limit if you want to limit query results

	const [ userdata, setUserdata] = useUserContext()
	const [ localdata, setLocaldata] = useLocalContext()

	const [ list, setList ] = useState(null)

	function updateList() {
		AdoptersListGET(userdata, props.subject?.Meta.ID, "admin", props.limit)
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
		setLocaldata(VisitTab(localdata, "newadopter", localdata.tab.context))
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
		console.log("SELECT Adopter", id)
		const next = list[parseInt(id)]
		const context = {
			"_": next.fields.name,
			"object": next,
		}
		setLocaldata(VisitTab(localdata, "adopter", context))
	}

	function moveUp(id) {
		const object = list[parseInt(id)]
		console.log("MOVE UP", object)
		AdopterOrderPOST(userdata, object.Meta.ID, "up")
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
		AdopterOrderPOST(userdata, object.Meta.ID, "down")
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
		AdopterDELETE(userdata, object.Meta.ID)
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
				<td className='font-bold px-2' style={cellStyle}>adopter name</td><td className='font-bold px-2' style={cellStyle}>adopter phone number</td>
			</tr>
			{
				list && list.map(function (row, i) {
					return (
						<AdopterMatrixRow id={i} key={i} row={row} save={saveUpdate}/>
					)
				})
			}
			<tr>
				<td className='flex flex-row justify-center font-bold px-2 bg-gray-200' style={cellStyle}>
					<div className='cursor-pointer' onClick={newobject}>+</div>
				</td>
				<td className='font-bold px-2'></td><td className='font-bold px-2'></td>
			</tr>
		</tbody></table>
		<Spacer/>

	</>
	)

}