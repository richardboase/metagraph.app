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

export function AdopterListRow(props) {

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
					("contactnumber" != "name") && !Array.isArray(props.item.fields["contactnumber"]) &&  !(typeof props.item.fields["contactnumber"] === 'object')  && <>
						<div className='text-sm font-bold' title="contactnumber">
							{ props.item.fields["contactnumber"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("address" != "name") && !Array.isArray(props.item.fields["address"]) &&  !(typeof props.item.fields["address"] === 'object')  && <>
						<div className='text-sm font-bold' title="address">
							{ props.item.fields["address"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			
			
			
			<RowEdit object={props.item} editInterface="editadopter"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}