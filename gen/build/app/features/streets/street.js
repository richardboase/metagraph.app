import * as React from 'react'
import { useUserContext } from '@/context/user'
import { useLocalContext } from '@/context/local'
import { useState, useEffect } from 'react'
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

import VisitTab from '../interfaces'
import { GetInterfaces } from '@/features/interfaces'
import { GoBack } from '../interfaces'
import Loading from '@/app/loading'
import Spacer from '@/inputs/spacer';
import { RowThumbnail } from '@/components/rowThumbnail'

import { BuildingList } from '@/features/buildings/shared/buildingList'


import { StreetObjectGET, StreetJobPOST } from './_fetch'

export function Street(props) {  

    const [userdata, setUserdata] = useUserContext()
    const [localdata, setLocaldata] = useLocalContext() 

    const [jdata, setJdata] = useState(localdata.tab.context.object)
    const [subject, setSubject] = useState(localdata.tab.context.object)
    const [image, setImage] = useState()

	const interfaces = GetInterfaces()

	var date = new Date(subject.Meta.Modified * 1000);
	const dateTime = formatRelative(date, new Date())

	// update tabs handles the updated context and sends the user to a new interface
	function editData() {
		setLocaldata(VisitTab(localdata, "editstreet", localdata.tab.context))
	}

	function getObject() {
		StreetObjectGET(userdata, subject.Meta.ID)
		.then((res) => res.json())
		.then((data) => {
			console.log(data)
			setSubject(data)
			setJdata(JSON.stringify(data.fields))
			
			console.log("IMAGE? src:", image)
		}) 
		.catch((e) => {
            console.error(e)
			setLocaldata(GoBack(localdata))
        })
	}

	// update tabs handles the updated context and sends the user to a new interface
	function updateTabEvent(e) {
		console.log("UPDATE TAB EVENT:", e.target.id)
		updateTab(e.target.id)
	}
	function updateTab(tabname) {
		setLocaldata(VisitTab(localdata, tabname, localdata?.tab?.context))
	}

	useEffect(() => {
		getObject()
	}, [])

	const editButtonStyle = {
		borderRadius: "20px",
		backgroundColor: "white",
		border: "solid 1px black",
		color: "black",
		padding: "6px 10px"
	}

	const childButtonStyle = {
		borderRadius: "20px",
		backgroundColor: "rgb(52, 211, 153)",
		border: "solid 0px",
		color: "white",
		padding: "6px 10px"
	}

    return (
		<div className='flex flex-col w-full' style={ {padding:"30px 60px 30px 60px"} }>
			{ !subject && <Loading/> }
			<div className='flex flex-col'>
				<div className='flex flex-row text-base'>
					<span className='uppercase text-base'>{ subject.Meta.ClassName }</span>
					<div className='px-2'>/</div>
					<span className='font-bold'>{ (subject.Meta.Name.length > 20) ? subject.Meta.Name.substr(0, 20)+"..." : subject.Meta.Name }</span>
				</div>
				{
					subject?.Meta.Media.Image && <img className='m-4' src={'https://storage.googleapis.com/go-gen-test-uploads/'+subject.Meta.Media.URIs[subject.Meta.Media.URIs.length-1]}/>
				}
				<div className='flex flex-wrap my-4'>
					{
						localdata.tab.subsublinks.map(function (tabname, i) {
							if (tabname.length == 0) { return }
							const tab = interfaces[tabname]
							return (
								<button id={tabname} key={i} className='text-sm m-2' onClick={updateTabEvent} style={childButtonStyle}>
									{tab.name}
								</button>
							)
						})
					}
				</div>
			</div>
			<hr/>
			<div className="flex flex-col w-full">
				<div className='flex flex-row'>
				{
					image && <div className="m-4" style={ {maxWidth:"40vw"} }>
						<img className='w-full' src={image}/>
					</div>
				}
					<table className='m-4 w-full'>
						<tbody>
							<tr className='flex flex-row text-sm'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className=''>Updated</div>
									</div>
								</td>
								<td className='flex flex-col justify-start'>
								</td>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='text-xs'>{ dateTime }</div>
									</div>
								</td>
							</tr>
							<Spacer/>
							
							<tr className='flex flex-row'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='font-bold'>name</div>
									</div>
								</td>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='px-2'>:</div>
									</div>
								</td>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										{
											(typeof subject.fields["name"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["name"]).forEach(function(k, i) {
														const v = subject.fields["name"][k]
														return (
															<div key={i} className='flex flex-row text-xs m-2'>
																<div className=''>{k}</div>
																<div className='px-2'>:</div>
																<div className=''>{v}</div>
															</div>
														)
													})
												}
											</div>
										}
										{
											Array.isArray(subject.fields["name"]) && subject.fields["name"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["name"]) && !(typeof subject.fields["name"] === 'object') && <>
												
												{ subject.Meta.Name }
												
												
											</>
										}
									</div>
								</td>
							</tr>
							<Spacer/>
							
							<tr className='flex flex-row'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='font-bold'>zoning</div>
									</div>
								</td>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='px-2'>:</div>
									</div>
								</td>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										{
											(typeof subject.fields["zoning"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["zoning"]).forEach(function(k, i) {
														const v = subject.fields["zoning"][k]
														return (
															<div key={i} className='flex flex-row text-xs m-2'>
																<div className=''>{k}</div>
																<div className='px-2'>:</div>
																<div className=''>{v}</div>
															</div>
														)
													})
												}
											</div>
										}
										{
											Array.isArray(subject.fields["zoning"]) && subject.fields["zoning"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["zoning"]) && !(typeof subject.fields["zoning"] === 'object') && <>
												
												
												{ subject.fields["zoning"] }
												
											</>
										}
									</div>
								</td>
							</tr>
							<Spacer/>
							
							<tr className='flex flex-row'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='font-bold'>length</div>
									</div>
								</td>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='px-2'>:</div>
									</div>
								</td>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										{
											(typeof subject.fields["length"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["length"]).forEach(function(k, i) {
														const v = subject.fields["length"][k]
														return (
															<div key={i} className='flex flex-row text-xs m-2'>
																<div className=''>{k}</div>
																<div className='px-2'>:</div>
																<div className=''>{v}</div>
															</div>
														)
													})
												}
											</div>
										}
										{
											Array.isArray(subject.fields["length"]) && subject.fields["length"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["length"]) && !(typeof subject.fields["length"] === 'object') && <>
												
												
												{ subject.fields["length"] }
												
											</>
										}
									</div>
								</td>
							</tr>
							<Spacer/>
							
						</tbody>
					</table>
				</div>
			</div>
			
				<div className='flex flex-row justify-start items-center my-4'>
					<button className='text-sm' onClick={editData} style={editButtonStyle}>
					Edit Street
					</button>
				</div>
			
			<div className='flex flex-col'>
				
				
				

				
				
				<BuildingList title="Buildings" subject={subject} limit={4} />
				
				
			</div>
		</div>
    )
}