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

export function AnimalListRow(props) {

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
					("species" != "name") && !Array.isArray(props.item.fields["species"]) &&  !(typeof props.item.fields["species"] === 'object')  && <>
						<div className='text-sm font-bold' title="species">
							{ props.item.fields["species"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("age" != "name") && !Array.isArray(props.item.fields["age"]) &&  !(typeof props.item.fields["age"] === 'object')  && <>
						<div className='text-sm font-bold' title="age">
							{ props.item.fields["age"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("birthday" != "name") && !Array.isArray(props.item.fields["birthday"]) &&  !(typeof props.item.fields["birthday"] === 'object')  && <>
						<div className='text-sm font-bold' title="birthday">
							{ props.item.fields["birthday"] }
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
			
			
			
			<RowEdit object={props.item} editInterface="editanimal"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}