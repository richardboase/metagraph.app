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

import { MusicdetailsList } from '@/features/musicdetailss/shared/musicdetailsList'
import { PicturedetailsList } from '@/features/picturedetailss/shared/picturedetailsList'
import { GamingcarddetailsList } from '@/features/gamingcarddetailss/shared/gamingcarddetailsList'


import { TokenObjectGET, TokenJobPOST } from './_fetch'

export function Token(props) {  

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
		setLocaldata(VisitTab(localdata, "edittoken", localdata.tab.context))
	}

	function getObject() {
		TokenObjectGET(userdata, subject.Meta.ID)
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
					<span className='font-bold'>{ (subject.Meta.Name?.length > 20) ? subject.Meta.Name.substr(0, 20)+"..." : subject.Meta.Name }</span>
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
										<div className='font-bold'>tokenType</div>
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
											(typeof subject.fields["tokentype"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["tokentype"]).forEach(function(k, i) {
														const v = subject.fields["tokentype"][k]
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
											Array.isArray(subject.fields["tokentype"]) && subject.fields["tokentype"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["tokentype"]) && !(typeof subject.fields["tokentype"] === 'object') && <>
												
												
												{ subject.fields["tokentype"] }
												
											</>
										}
									</div>
								</td>
							</tr>
							<Spacer/>
							
							<tr className='flex flex-row'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='font-bold'>supply</div>
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
											(typeof subject.fields["supply"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["supply"]).forEach(function(k, i) {
														const v = subject.fields["supply"][k]
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
											Array.isArray(subject.fields["supply"]) && subject.fields["supply"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["supply"]) && !(typeof subject.fields["supply"] === 'object') && <>
												
												
												{ subject.fields["supply"] }
												
											</>
										}
									</div>
								</td>
							</tr>
							<Spacer/>
							
							<tr className='flex flex-row'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='font-bold'>hasDividend</div>
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
											(typeof subject.fields["hasdividend"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["hasdividend"]).forEach(function(k, i) {
														const v = subject.fields["hasdividend"][k]
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
											Array.isArray(subject.fields["hasdividend"]) && subject.fields["hasdividend"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["hasdividend"]) && !(typeof subject.fields["hasdividend"] === 'object') && <>
												
												
												{ subject.fields["hasdividend"] }
												
											</>
										}
									</div>
								</td>
							</tr>
							<Spacer/>
							
							<tr className='flex flex-row'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='font-bold'>website</div>
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
											(typeof subject.fields["website"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["website"]).forEach(function(k, i) {
														const v = subject.fields["website"][k]
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
											Array.isArray(subject.fields["website"]) && subject.fields["website"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["website"]) && !(typeof subject.fields["website"] === 'object') && <>
												
												
												{ subject.fields["website"] }
												
											</>
										}
									</div>
								</td>
							</tr>
							<Spacer/>
							
							<tr className='flex flex-row'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='font-bold'>twitter</div>
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
											(typeof subject.fields["twitter"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["twitter"]).forEach(function(k, i) {
														const v = subject.fields["twitter"][k]
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
											Array.isArray(subject.fields["twitter"]) && subject.fields["twitter"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["twitter"]) && !(typeof subject.fields["twitter"] === 'object') && <>
												
												
												{ subject.fields["twitter"] }
												
											</>
										}
									</div>
								</td>
							</tr>
							<Spacer/>
							
							<tr className='flex flex-row'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='font-bold'>telegram</div>
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
											(typeof subject.fields["telegram"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["telegram"]).forEach(function(k, i) {
														const v = subject.fields["telegram"][k]
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
											Array.isArray(subject.fields["telegram"]) && subject.fields["telegram"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["telegram"]) && !(typeof subject.fields["telegram"] === 'object') && <>
												
												
												{ subject.fields["telegram"] }
												
											</>
										}
									</div>
								</td>
							</tr>
							<Spacer/>
							
							<tr className='flex flex-row'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='font-bold'>liquidityAddress</div>
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
											(typeof subject.fields["liquidityaddress"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["liquidityaddress"]).forEach(function(k, i) {
														const v = subject.fields["liquidityaddress"][k]
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
											Array.isArray(subject.fields["liquidityaddress"]) && subject.fields["liquidityaddress"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["liquidityaddress"]) && !(typeof subject.fields["liquidityaddress"] === 'object') && <>
												
												
												{ subject.fields["liquidityaddress"] }
												
											</>
										}
									</div>
								</td>
							</tr>
							<Spacer/>
							
							<tr className='flex flex-row'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='font-bold'>burnAmount</div>
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
											(typeof subject.fields["burnamount"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["burnamount"]).forEach(function(k, i) {
														const v = subject.fields["burnamount"][k]
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
											Array.isArray(subject.fields["burnamount"]) && subject.fields["burnamount"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["burnamount"]) && !(typeof subject.fields["burnamount"] === 'object') && <>
												
												
												{ subject.fields["burnamount"] }
												
											</>
										}
									</div>
								</td>
							</tr>
							<Spacer/>
							
							<tr className='flex flex-row'>
								<td className='flex flex-col justify-start'>
									<div className='w-full flex flex-row justify-end'>
										<div className='font-bold'>mintLocation</div>
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
											(typeof subject.fields["mintlocation"] === 'object') && <div className='flex flex-col m-4'>
												{
													Object.keys(subject.fields["mintlocation"]).forEach(function(k, i) {
														const v = subject.fields["mintlocation"][k]
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
											Array.isArray(subject.fields["mintlocation"]) && subject.fields["mintlocation"].map(function(item, i) {
												return (
													<div key={i} className='text-xs'>{item}</div>
												)
											})
										}
										{
											!Array.isArray(subject.fields["mintlocation"]) && !(typeof subject.fields["mintlocation"] === 'object') && <>
												
												
												{ subject.fields["mintlocation"] }
												
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
					Edit Token
					</button>
				</div>
			
			<div className='flex flex-col'>
				
				
				
				
				
				
				

				
				
				<MusicdetailsList title="Musicdetailss" subject={subject} limit={4} />
				
				
				
				<PicturedetailsList title="Picturedetailss" subject={subject} limit={4} />
				
				
				
				<GamingcarddetailsList title="Gamingcarddetailss" subject={subject} limit={4} />
				
				
			</div>
		</div>
    )
}