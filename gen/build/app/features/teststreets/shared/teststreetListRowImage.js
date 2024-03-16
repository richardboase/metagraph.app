import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function TeststreetListRowImage(props) {

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
					("description" != "name") && !Array.isArray(props.item.fields["description"]) &&  !(typeof props.item.fields["description"] === 'object')  && <>
						<div className='text-sm font-bold' title="description">
							{ props.item.fields["description"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("start" != "name") && !Array.isArray(props.item.fields["start"]) &&  !(typeof props.item.fields["start"] === 'object')  && <>
						<div className='text-sm font-bold' title="start">
							{ props.item.fields["start"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("end" != "name") && !Array.isArray(props.item.fields["end"]) &&  !(typeof props.item.fields["end"] === 'object')  && <>
						<div className='text-sm font-bold' title="end">
							{ props.item.fields["end"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="editteststreet"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}