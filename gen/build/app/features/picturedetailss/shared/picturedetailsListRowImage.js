import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function PicturedetailsListRowImage(props) {

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
					("seriesname" != "name") && !Array.isArray(props.item.fields["seriesname"]) &&  !(typeof props.item.fields["seriesname"] === 'object')  && (props.item.fields["seriesname"].length > 0) && <>
						<div className='text-base font-bold' title="seriesname">
							"{ props.item.fields["seriesname"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("imagetitle" != "name") && !Array.isArray(props.item.fields["imagetitle"]) &&  !(typeof props.item.fields["imagetitle"] === 'object')  && (props.item.fields["imagetitle"].length > 0) && <>
						<div className='text-base font-bold' title="imagetitle">
							"{ props.item.fields["imagetitle"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("pictureurl" != "name") && !Array.isArray(props.item.fields["pictureurl"]) &&  !(typeof props.item.fields["pictureurl"] === 'object')  && (props.item.fields["pictureurl"].length > 0) && <>
						<div className='text-base font-bold' title="pictureurl">
							"{ props.item.fields["pictureurl"] }"
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="editpicturedetails"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}