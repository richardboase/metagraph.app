import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function BuildingListRowImage(props) {

	const [userdata, setUserdata] = useUserContext()

	function selectItem(e) {
		console.log("SELECT EVENT", props.id)
		return props.select(props.id)
	}
	function deleteItem() {
		props.delete(props.id)
	}

	return (
		<div className='flex flex-col justify-between items-center w-full'>
			
			<div className='flex flex-col w-full justify-center items-center m-4'>
				<div className="px-4"></div>
				{
					("name" != "name") && !Array.isArray(props.item.fields["name"]) &&  !(typeof props.item.fields["name"] === 'object')  && (props.item.fields["name"].length > 0) && <>
						<div className='text-base font-bold' title="name">
							"{ props.item.fields["name"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("description" != "name") && !Array.isArray(props.item.fields["description"]) &&  !(typeof props.item.fields["description"] === 'object')  && (props.item.fields["description"].length > 0) && <>
						<div className='text-base font-bold' title="description">
							"{ props.item.fields["description"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("number" != "name") && !Array.isArray(props.item.fields["number"]) &&  !(typeof props.item.fields["number"] === 'object')  && (props.item.fields["number"].length > 0) && <>
						<div className='text-base font-bold' title="number">
							"{ props.item.fields["number"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("xunits" != "name") && !Array.isArray(props.item.fields["xunits"]) &&  !(typeof props.item.fields["xunits"] === 'object')  && (props.item.fields["xunits"].length > 0) && <>
						<div className='text-base font-bold' title="xunits">
							"{ props.item.fields["xunits"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("yunits" != "name") && !Array.isArray(props.item.fields["yunits"]) &&  !(typeof props.item.fields["yunits"] === 'object')  && (props.item.fields["yunits"].length > 0) && <>
						<div className='text-base font-bold' title="yunits">
							"{ props.item.fields["yunits"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("floors" != "name") && !Array.isArray(props.item.fields["floors"]) &&  !(typeof props.item.fields["floors"] === 'object')  && (props.item.fields["floors"].length > 0) && <>
						<div className='text-base font-bold' title="floors">
							"{ props.item.fields["floors"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("doors" != "name") && !Array.isArray(props.item.fields["doors"]) &&  !(typeof props.item.fields["doors"] === 'object')  && (props.item.fields["doors"].length > 0) && <>
						<div className='text-base font-bold' title="doors">
							"{ props.item.fields["doors"] }"
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="editbuilding"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}