import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { RowPay } from "@/components/rowPay"
import { RowMint } from "@/components/rowMint"
import { titlecase } from "../_interfaces"

export function MusicdetailsListRow(props) {

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
					("albumname" != "name") && !Array.isArray(props.item.fields["albumname"]) &&  !(typeof props.item.fields["albumname"] === 'object')  && <>
						<div className='text-sm font-bold' title="albumname">
							{ props.item.fields["albumname"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("trackname" != "name") && !Array.isArray(props.item.fields["trackname"]) &&  !(typeof props.item.fields["trackname"] === 'object')  && <>
						<div className='text-sm font-bold' title="trackname">
							{ props.item.fields["trackname"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("albumimage" != "name") && !Array.isArray(props.item.fields["albumimage"]) &&  !(typeof props.item.fields["albumimage"] === 'object')  && <>
						<div className='text-sm font-bold' title="albumimage">
							{ props.item.fields["albumimage"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("trackimage" != "name") && !Array.isArray(props.item.fields["trackimage"]) &&  !(typeof props.item.fields["trackimage"] === 'object')  && <>
						<div className='text-sm font-bold' title="trackimage">
							{ props.item.fields["trackimage"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			
			
			
			<RowEdit object={props.item} editInterface="editmusicdetails"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}