import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function AdopterListRowImage(props) {

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
					("fullname" != "name") && !Array.isArray(props.item.fields["fullname"]) &&  !(typeof props.item.fields["fullname"] === 'object')  && (props.item.fields["fullname"].length > 0) && <>
						<div className='text-base font-bold' title="fullname">
							"{ props.item.fields["fullname"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("contactinfo" != "name") && !Array.isArray(props.item.fields["contactinfo"]) &&  !(typeof props.item.fields["contactinfo"] === 'object')  && (props.item.fields["contactinfo"].length > 0) && <>
						<div className='text-base font-bold' title="contactinfo">
							"{ props.item.fields["contactinfo"] }"
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
				
				<RowEdit object={props.item} editInterface="editadopter"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}