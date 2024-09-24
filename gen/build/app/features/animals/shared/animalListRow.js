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
					("animal name" != "name") && !Array.isArray(props.item.fields["animal name"]) &&  !(typeof props.item.fields["animal name"] === 'object')  && <>
						<div className='text-sm font-bold' title="animal name">
							{ props.item.fields["animal name"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("animal species" != "name") && !Array.isArray(props.item.fields["animal species"]) &&  !(typeof props.item.fields["animal species"] === 'object')  && <>
						<div className='text-sm font-bold' title="animal species">
							{ props.item.fields["animal species"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("animal age" != "name") && !Array.isArray(props.item.fields["animal age"]) &&  !(typeof props.item.fields["animal age"] === 'object')  && <>
						<div className='text-sm font-bold' title="animal age">
							{ props.item.fields["animal age"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("animal birthday" != "name") && !Array.isArray(props.item.fields["animal birthday"]) &&  !(typeof props.item.fields["animal birthday"] === 'object')  && <>
						<div className='text-sm font-bold' title="animal birthday">
							{ props.item.fields["animal birthday"] }
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