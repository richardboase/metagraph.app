import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function FurnishingListRowImage(props) {

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
					("state" != "name") && !Array.isArray(props.item.fields["state"]) &&  !(typeof props.item.fields["state"] === 'object')  && (props.item.fields["state"].length > 0) && <>
						<div className='text-base font-bold' title="state">
							"{ props.item.fields["state"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("age" != "name") && !Array.isArray(props.item.fields["age"]) &&  !(typeof props.item.fields["age"] === 'object')  && (props.item.fields["age"].length > 0) && <>
						<div className='text-base font-bold' title="age">
							"{ props.item.fields["age"] }"
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="editfurnishing"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}