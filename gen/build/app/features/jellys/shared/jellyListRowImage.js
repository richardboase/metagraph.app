import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function JellyListRowImage(props) {

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
			
			<div><img src={props.item.Meta.Media.Preview}/></div>
			
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
					("gender" != "name") && !Array.isArray(props.item.fields["gender"]) &&  !(typeof props.item.fields["gender"] === 'object')  && <>
						<div className='text-sm font-bold' title="gender">
							{ props.item.fields["gender"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("element" != "name") && !Array.isArray(props.item.fields["element"]) &&  !(typeof props.item.fields["element"] === 'object')  && <>
						<div className='text-sm font-bold' title="element">
							{ props.item.fields["element"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("hp" != "name") && !Array.isArray(props.item.fields["hp"]) &&  !(typeof props.item.fields["hp"] === 'object')  && <>
						<div className='text-sm font-bold' title="hp">
							{ props.item.fields["hp"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc my-2">
				
				<RowEdit object={props.item} editInterface="editjelly"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}