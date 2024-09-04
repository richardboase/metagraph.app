import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function MusicdetailsListRowImage(props) {

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
					("albumname" != "name") && !Array.isArray(props.item.fields["albumname"]) &&  !(typeof props.item.fields["albumname"] === 'object')  && (props.item.fields["albumname"].length > 0) && <>
						<div className='text-base font-bold' title="albumname">
							"{ props.item.fields["albumname"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("trackname" != "name") && !Array.isArray(props.item.fields["trackname"]) &&  !(typeof props.item.fields["trackname"] === 'object')  && (props.item.fields["trackname"].length > 0) && <>
						<div className='text-base font-bold' title="trackname">
							"{ props.item.fields["trackname"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("albumimage" != "name") && !Array.isArray(props.item.fields["albumimage"]) &&  !(typeof props.item.fields["albumimage"] === 'object')  && (props.item.fields["albumimage"].length > 0) && <>
						<div className='text-base font-bold' title="albumimage">
							"{ props.item.fields["albumimage"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("trackimage" != "name") && !Array.isArray(props.item.fields["trackimage"]) &&  !(typeof props.item.fields["trackimage"] === 'object')  && (props.item.fields["trackimage"].length > 0) && <>
						<div className='text-base font-bold' title="trackimage">
							"{ props.item.fields["trackimage"] }"
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="editmusicdetails"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}