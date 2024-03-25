import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function FurnishingListRow(props) {

	const [userdata, setUserdata] = useUserContext()

	function selectItem(e) {
		console.log("SELECT EVENT", props.id)
		return props.select(props.id)
	}
	function deleteItem() {
		props.delete(props.id)
	}

	return (
		<div className='flex flex-row justify-between py-2 items-center w-full'>
			
			<div onClick={selectItem} className='flex flex-row w-full items-center cursor-pointer px-4'>
				{
					props.item.Meta.Name?.length && <>
						<div className='text-lg font-bold' title="Name">{ props.item.Meta.Name }</div>
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
					("state" != "name") && !Array.isArray(props.item.fields["state"]) &&  !(typeof props.item.fields["state"] === 'object')  && <>
						<div className='text-sm font-bold' title="state">
							{ props.item.fields["state"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("age" != "name") && !Array.isArray(props.item.fields["age"]) &&  !(typeof props.item.fields["age"] === 'object')  && <>
						<div className='text-sm font-bold' title="age">
							{ props.item.fields["age"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			
			<RowEdit object={props.item} editInterface="editfurnishing"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}