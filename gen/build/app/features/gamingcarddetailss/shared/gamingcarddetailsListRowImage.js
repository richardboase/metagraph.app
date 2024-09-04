import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function GamingcarddetailsListRowImage(props) {

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
					("gametitle" != "name") && !Array.isArray(props.item.fields["gametitle"]) &&  !(typeof props.item.fields["gametitle"] === 'object')  && (props.item.fields["gametitle"].length > 0) && <>
						<div className='text-base font-bold' title="gametitle">
							"{ props.item.fields["gametitle"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("cardtype" != "name") && !Array.isArray(props.item.fields["cardtype"]) &&  !(typeof props.item.fields["cardtype"] === 'object')  && (props.item.fields["cardtype"].length > 0) && <>
						<div className='text-base font-bold' title="cardtype">
							"{ props.item.fields["cardtype"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("cardrarity" != "name") && !Array.isArray(props.item.fields["cardrarity"]) &&  !(typeof props.item.fields["cardrarity"] === 'object')  && (props.item.fields["cardrarity"].length > 0) && <>
						<div className='text-base font-bold' title="cardrarity">
							"{ props.item.fields["cardrarity"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("cardimageurl" != "name") && !Array.isArray(props.item.fields["cardimageurl"]) &&  !(typeof props.item.fields["cardimageurl"] === 'object')  && (props.item.fields["cardimageurl"].length > 0) && <>
						<div className='text-base font-bold' title="cardimageurl">
							"{ props.item.fields["cardimageurl"] }"
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="editgamingcarddetails"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}