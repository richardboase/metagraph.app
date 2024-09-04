import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function CreatorListRowImage(props) {

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
					("name" != "name") && !Array.isArray(props.item.fields["name"]) &&  !(typeof props.item.fields["name"] === 'object')  && (props.item.fields["name"].length > 0) && <>
						<div className='text-base font-bold' title="name">
							"{ props.item.fields["name"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("company" != "name") && !Array.isArray(props.item.fields["company"]) &&  !(typeof props.item.fields["company"] === 'object')  && (props.item.fields["company"].length > 0) && <>
						<div className='text-base font-bold' title="company">
							"{ props.item.fields["company"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("band" != "name") && !Array.isArray(props.item.fields["band"]) &&  !(typeof props.item.fields["band"] === 'object')  && (props.item.fields["band"].length > 0) && <>
						<div className='text-base font-bold' title="band">
							"{ props.item.fields["band"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("artistname" != "name") && !Array.isArray(props.item.fields["artistname"]) &&  !(typeof props.item.fields["artistname"] === 'object')  && (props.item.fields["artistname"].length > 0) && <>
						<div className='text-base font-bold' title="artistname">
							"{ props.item.fields["artistname"] }"
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="editcreator"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}