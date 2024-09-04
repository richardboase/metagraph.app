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

export function PicturedetailsListRow(props) {

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
					("seriesname" != "name") && !Array.isArray(props.item.fields["seriesname"]) &&  !(typeof props.item.fields["seriesname"] === 'object')  && <>
						<div className='text-sm font-bold' title="seriesname">
							{ props.item.fields["seriesname"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("imagetitle" != "name") && !Array.isArray(props.item.fields["imagetitle"]) &&  !(typeof props.item.fields["imagetitle"] === 'object')  && <>
						<div className='text-sm font-bold' title="imagetitle">
							{ props.item.fields["imagetitle"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("pictureurl" != "name") && !Array.isArray(props.item.fields["pictureurl"]) &&  !(typeof props.item.fields["pictureurl"] === 'object')  && <>
						<div className='text-sm font-bold' title="pictureurl">
							{ props.item.fields["pictureurl"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			
			
			
			<RowEdit object={props.item} editInterface="editpicturedetails"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}