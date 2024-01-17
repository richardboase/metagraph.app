import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import VisitTab from '@/features/interfaces';
import { titlecase } from '../_interfaces';

import Loading from '@/app/loading';
import Spacer from '@/inputs/spacer';

import { BuildingMatrixRow } from './buildingMatrixRow';
import {
	BuildingDELETE,
	BuildingsListGET,
	BuildingMoveUpPOST,
	BuildingMoveDownPOST,
} from '../_fetch';
import { ObjectPATCH } from '@/app/fetch'


export function BuildingMatrix(props) {

	// set props.limit if you want to limit query results

	const [ userdata, setUserdata] = useUserContext()
	const [ localdata, setLocaldata] = useLocalContext()

	const [ list, setList ] = useState(null)

	function updateList() {
		BuildingsListGET(userdata, props.subject?.Meta.ID, props.limit)
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			setList(data)
		})
	}

	useEffect(() => {
		updateList()
	}, [])

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
		console.log("SELECT Building", id)
		const next = list[parseInt(id)]
		const context = {
			"_": next.fields.name,
			"object": next,
		}
		setLocaldata(VisitTab(localdata, "building", context))
	}

	function moveUp(id) {
		const object = list[parseInt(id)]
		console.log("MOVE UP", object)
		BuildingMoveUpPOST(userdata, object.Meta.ID)
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
		BuildingMoveDownPOST(userdata, object.Meta.ID)
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
		BuildingDELETE(userdata, object.Meta.ID)
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
		<table className='w-full' style={cellStyle}><tbody>
			<tr>
				<td className='flex flex-row justify-center font-bold px-2' style={cellStyle}>
					<div>#</div>
			</td>
				<td className='font-bold px-2' style={cellStyle}>name</td><td className='font-bold px-2' style={cellStyle}>number</td><td className='font-bold px-2' style={cellStyle}>xunits</td><td className='font-bold px-2' style={cellStyle}>yunits</td><td className='font-bold px-2' style={cellStyle}>doors</td>
			</tr>
			{
				list && list.map(function (row, i) {
					return (
						<BuildingMatrixRow id={i} key={i} row={row} save={saveUpdate}/>
					)
				})
			}
		</tbody></table>
		<Spacer/>

	</>
	)

}