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

export function CreatorListRow(props) {

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
					("company" != "name") && !Array.isArray(props.item.fields["company"]) &&  !(typeof props.item.fields["company"] === 'object')  && <>
						<div className='text-sm font-bold' title="company">
							{ props.item.fields["company"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("band" != "name") && !Array.isArray(props.item.fields["band"]) &&  !(typeof props.item.fields["band"] === 'object')  && <>
						<div className='text-sm font-bold' title="band">
							{ props.item.fields["band"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("artistname" != "name") && !Array.isArray(props.item.fields["artistname"]) &&  !(typeof props.item.fields["artistname"] === 'object')  && <>
						<div className='text-sm font-bold' title="artistname">
							{ props.item.fields["artistname"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			
			
			
			<RowEdit object={props.item} editInterface="editcreator"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}