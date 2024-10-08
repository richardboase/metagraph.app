import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function ParentListRowImage(props) {

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
					("species" != "name") && !Array.isArray(props.item.fields["species"]) &&  !(typeof props.item.fields["species"] === 'object')  && (props.item.fields["species"].length > 0) && <>
						<div className='text-base font-bold' title="species">
							"{ props.item.fields["species"] }"
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
				}{
					("birthday" != "name") && !Array.isArray(props.item.fields["birthday"]) &&  !(typeof props.item.fields["birthday"] === 'object')  && (props.item.fields["birthday"].length > 0) && <>
						<div className='text-base font-bold' title="birthday">
							"{ props.item.fields["birthday"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("address" != "name") && !Array.isArray(props.item.fields["address"]) &&  !(typeof props.item.fields["address"] === 'object')  && (props.item.fields["address"].length > 0) && <>
						<div className='text-base font-bold' title="address">
							"{ props.item.fields["address"] }"
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="editparent"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}