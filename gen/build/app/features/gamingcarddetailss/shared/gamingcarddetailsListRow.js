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

export function GamingcarddetailsListRow(props) {

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
					("gametitle" != "name") && !Array.isArray(props.item.fields["gametitle"]) &&  !(typeof props.item.fields["gametitle"] === 'object')  && <>
						<div className='text-sm font-bold' title="gametitle">
							{ props.item.fields["gametitle"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("cardtype" != "name") && !Array.isArray(props.item.fields["cardtype"]) &&  !(typeof props.item.fields["cardtype"] === 'object')  && <>
						<div className='text-sm font-bold' title="cardtype">
							{ props.item.fields["cardtype"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("cardrarity" != "name") && !Array.isArray(props.item.fields["cardrarity"]) &&  !(typeof props.item.fields["cardrarity"] === 'object')  && <>
						<div className='text-sm font-bold' title="cardrarity">
							{ props.item.fields["cardrarity"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("cardimageurl" != "name") && !Array.isArray(props.item.fields["cardimageurl"]) &&  !(typeof props.item.fields["cardimageurl"] === 'object')  && <>
						<div className='text-sm font-bold' title="cardimageurl">
							{ props.item.fields["cardimageurl"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			
			
			
			<RowEdit object={props.item} editInterface="editgamingcarddetails"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}