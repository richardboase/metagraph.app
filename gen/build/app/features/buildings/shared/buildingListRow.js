import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function BuildingListRow(props) {

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
					("number" != "name") && !Array.isArray(props.item.fields["number"]) &&  !(typeof props.item.fields["number"] === 'object')  && <>
						<div className='text-sm font-bold' title="number">
							{ props.item.fields["number"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("xunits" != "name") && !Array.isArray(props.item.fields["xunits"]) &&  !(typeof props.item.fields["xunits"] === 'object')  && <>
						<div className='text-sm font-bold' title="xunits">
							{ props.item.fields["xunits"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("yunits" != "name") && !Array.isArray(props.item.fields["yunits"]) &&  !(typeof props.item.fields["yunits"] === 'object')  && <>
						<div className='text-sm font-bold' title="yunits">
							{ props.item.fields["yunits"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("floors" != "name") && !Array.isArray(props.item.fields["floors"]) &&  !(typeof props.item.fields["floors"] === 'object')  && <>
						<div className='text-sm font-bold' title="floors">
							{ props.item.fields["floors"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("doors" != "name") && !Array.isArray(props.item.fields["doors"]) &&  !(typeof props.item.fields["doors"] === 'object')  && <>
						<div className='text-sm font-bold' title="doors">
							{ props.item.fields["doors"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			
			<RowEdit object={props.item} editInterface="editbuilding"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}