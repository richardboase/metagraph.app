import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import VisitTab from '@/features/interfaces';
import { titlecase } from '../_interfaces';
import Loading from '@/app/loading'
import Spacer from '@/inputs/spacer';

import { ArthurListRow } from './arthurListRow';
import { ArthurListRowJob } from './arthurListRowJob';
import { ArthurListRowImage } from './arthurListRowImage';
import { ArthurDELETE, ArthursListGET, ArthurOrderPOST, ArthurJobPOST } from '../_fetch';



export function ArthurList(props) {

	const [ userdata, setUserdata] = useUserContext()
	const [ localdata, setLocaldata] = useLocalContext()

	const [topics, setTopics] = useState([])

	const [ list, setList ] = useState(null)
	const [ listMode, setListMode ] = useState("modified")

	function updateListMode(e) {
		const mode = e.target.value
		setListMode(mode)
		updateList()
		console.log("NEW MODE", mode)
	}

	function updateList() {
		ArthursListGET(userdata, props.subject?.Meta.ID, listMode, props.limit)
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			setList(data)
		}).catch((e) => {
			console.error("subjetList.updateList:", e)
		})
	}

	function sendToTopic(e) {
		console.log(e)
		const job = e.target.id
		
	}

	useEffect(() => {
		if ("".length) {
			setListMode("")
		} else {
			
			setListMode("admin")
			
		}
		updateList()
	}, [])

	// update tabs handles the updated context and sends the user to a new interface
	function selectItem(id) {
		console.log("SELECT Arthur", id)
		const next = list[parseInt(id)]
		const context = {
			"_": (next.Meta.Name ? next.fields.name : next.fields.name),
			"object": next,
		}
		setLocaldata(VisitTab(localdata, "arthur", context))
	}

	function selectChild() {
		setLocaldata(VisitTab(localdata, "arthurs", context))
	}

	function moveUp(id) {
		const object = list[parseInt(id)]
		console.log("MOVE UP", object)
		ArthurOrderPOST(userdata, object.Meta.ID, "up")
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
		ArthurOrderPOST(userdata, object.Meta.ID, "down")
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
		ArthurDELETE(userdata, object.Meta.ID)
		.then((res) => console.log(res))
		.then(function () {
			updateList()
		})
		.catch(function (e) {
			console.error("FAILED TO SEND", e)
		})
	}

	const jobButtonStyle = {
		borderRadius: "20px",
		backgroundColor: "rgb(96, 165, 250)",
		border: "solid 0px",
		color: "white",
		padding: "6px 10px"
	}

	return (
	<div className='flex flex-col w-full'>
		{
			props.title && <div className="flex flex-row justify-between items-center">
				<div className="flex flex-row">
					<div className='py-4 my-4 text-xl font-bold'>{props.title}:</div>
					<select onChange={updateListMode}>
						<option value="created">Created</option>
						<option value="modified">Modified</option>
						<option value="order">Ordered</option>
						<option value="exif">EXIF</option>
					</select>
				</div>
				{
					(topics.length > 0) && <div className='flex flex-row'>
					{
						topics.map(function (item, i) {
							return (
								<div key={i} className='flex flex-col justify-center'>
									<button key={i} className='text-sm' id={item.topic} onClick={sendToTopic} style={jobButtonStyle}>
									{item.name}
									</button>
								</div>
							)
						})
					}
					</div>
				}
				
			</div>
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
					<div className=' py-2 px-4' key={i}>
						
							<ArthurListRow id={i} listLength={list.length} item={item} select={selectItem} moveUp={moveUp} moveDown={moveDown} delete={deleteItem}/>
						
						
					</div>
				)
			})
		}
		
	</div>
	)

}