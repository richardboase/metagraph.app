import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function BookcharacterListRow(props) {

	const [userdata, setUserdata] = useUserContext()

	function selectItem(e) {
		console.log("SELECT EVENT", props.id)
		return props.select(props.id)
	}
	function deleteItem() {
		props.delete(props.id)
	}

	return (
		<div className='flex flex-row justify-between items-center w-full my-2'>
			
			<div onClick={selectItem} className='flex flex-row w-full items-center cursor-pointer m-4'>
				<div className='text-xl font-bold' title="name">{ props.item.fields["name"] }</div>
				<div className="px-4"></div>
				<Spacer/><div className='text-xl font-bold' title="age">{ props.item.fields["age"] }</div>
				<div className="px-4"></div>
				<Spacer/><div className='text-xl font-bold' title="gender">{ props.item.fields["gender"] }</div>
				<div className="px-4"></div>
				<Spacer/><div className='text-xl font-bold' title="profession">{ props.item.fields["profession"] }</div>
				<div className="px-4"></div>
				<Spacer/><div className='text-xl font-bold' title="diseases">{ props.item.fields["diseases"] }</div>
				<div className="px-4"></div>
				<Spacer/><div className='text-xl font-bold' title="socialclass">{ props.item.fields["socialclass"] }</div>
				<div className="px-4"></div>
				<Spacer/><div className='text-xl font-bold' title="backstory">{ props.item.fields["backstory"] }</div>
				<div className="px-4"></div>
				<Spacer/>
			</div>
			
			<RowEdit object={props.item} editInterface="editbookcharacter"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}