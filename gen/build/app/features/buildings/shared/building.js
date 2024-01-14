import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"

export function Preview(props) {

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
				<div className='text-xl font-bold' title="xunits">{ props.item.fields["xunits"] }</div>
				<div className="px-4"></div>
				<Spacer/><div className='text-xl font-bold' title="yunits">{ props.item.fields["yunits"] }</div>
				<div className="px-4"></div>
				<Spacer/><div className='text-xl font-bold' title="doors">{ props.item.fields["doors"] }</div>
				<div className="px-4"></div>
				<Spacer/>
			</div>
			
			<RowEdit object={props.item} editInterface="editbuilding"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}