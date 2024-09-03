import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function HealthcheckupListRowImage(props) {

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
					("notes" != "name") && !Array.isArray(props.item.fields["notes"]) &&  !(typeof props.item.fields["notes"] === 'object')  && (props.item.fields["notes"].length > 0) && <>
						<div className='text-base font-bold' title="notes">
							"{ props.item.fields["notes"] }"
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="edithealthcheckup"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}