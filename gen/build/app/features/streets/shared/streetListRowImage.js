import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function StreetListRowImage(props) {

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
			
			<div onClick={selectItem} className='flex flex-row w-full items-center cursor-pointer px-4'>
				{
					props.item.Meta.Name?.length && <>
						<div className='text-sm font-bold' title="Name">{ props.item.Meta.Name }</div>
					</>
				}
				<div className="px-4"></div>
				{
					("name" != "name") && !Array.isArray(props.item.fields["name"]) &&  !(typeof props.item.fields["name"] === 'object')  && <>
						<div className='text-sm font-bold' title="name">
							{ props.item.fields["name"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("zoning" != "name") && !Array.isArray(props.item.fields["zoning"]) &&  !(typeof props.item.fields["zoning"] === 'object')  && <>
						<div className='text-sm font-bold' title="zoning">
							{ props.item.fields["zoning"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("length" != "name") && !Array.isArray(props.item.fields["length"]) &&  !(typeof props.item.fields["length"] === 'object')  && <>
						<div className='text-sm font-bold' title="length">
							{ props.item.fields["length"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="editstreet"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}