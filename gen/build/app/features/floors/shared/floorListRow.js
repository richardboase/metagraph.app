import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function FloorListRow(props) {

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
					("rooms" != "name") && !Array.isArray(props.item.fields["rooms"]) &&  !(typeof props.item.fields["rooms"] === 'object')  && <>
						<div className='text-sm font-bold' title="rooms">
							{ props.item.fields["rooms"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			
			<RowEdit object={props.item} editInterface="editfloor"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}