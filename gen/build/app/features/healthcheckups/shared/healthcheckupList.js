import * as React from 'react'
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';
import { useState, useEffect } from 'react';

import VisitTab from '@/features/interfaces';
import { titlecase } from '../_interfaces';
import Loading from '@/app/loading'
import Spacer from '@/inputs/spacer';

import { HealthcheckupListRow } from './healthcheckupListRow';
import { HealthcheckupListRowJob } from './healthcheckupListRowJob';
import { HealthcheckupListRowImage } from './healthcheckupListRowImage';
import { HealthcheckupDELETE, HealthcheckupsListGET, HealthcheckupOrderPOST, HealthcheckupJobPOST } from '../_fetch';


import { ParentJobPOST } from '@/features/Parents/_fetch'


export function HealthcheckupList(props) {

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
		HealthcheckupsListGET(userdata, props.subject?.Meta.ID, listMode, props.limit)
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
		
		ParentJobPOST(userdata, props.subject?.Meta.ID, job)
		.then((res) => console.log(res))
		.catch((e) => {
            console.error(e)
        })
		
	}

	useEffect(() => {
		if ("".length) {
			setListMode("")
		} else {
			
			
			
		}
		updateList()
	}, [])

	// update tabs handles the updated context and sends the user to a new interface
	function selectItem(id) {
		console.log("SELECT Healthcheckup", id)
		const next = list[parseInt(id)]
		const context = {
			"_": (next.Meta.Name ? next.fields.name : next.fields.name),
			"object": next,
		}
		setLocaldata(VisitTab(localdata, "healthcheckup", context))
	}

	function selectChild() {
		setLocaldata(VisitTab(localdata, "healthcheckups", context))
	}

	function moveUp(id) {
		const object = list[parseInt(id)]
		console.log("MOVE UP", object)
		HealthcheckupOrderPOST(userdata, object.Meta.ID, "up")
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
		HealthcheckupOrderPOST(userdata, object.Meta.ID, "down")
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
		HealthcheckupDELETE(userdata, object.Meta.ID)
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
			!list && <div className="p-4">
				<Loading/>
			</div>
		}
		
		
		{
			list && list.map(function (item, i) {

				return (
					<div className=' py-2 px-4' key={i}>
						
							<HealthcheckupListRow id={i} listLength={list.length} item={item} select={selectItem} moveUp={moveUp} moveDown={moveDown} delete={deleteItem}/>
						
						
					</div>
				)
			})
		}
		
	</div>
	)

}