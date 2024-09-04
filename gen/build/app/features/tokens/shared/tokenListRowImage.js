import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function TokenListRowImage(props) {

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
					("tokentype" != "name") && !Array.isArray(props.item.fields["tokentype"]) &&  !(typeof props.item.fields["tokentype"] === 'object')  && (props.item.fields["tokentype"].length > 0) && <>
						<div className='text-base font-bold' title="tokentype">
							"{ props.item.fields["tokentype"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("supply" != "name") && !Array.isArray(props.item.fields["supply"]) &&  !(typeof props.item.fields["supply"] === 'object')  && (props.item.fields["supply"].length > 0) && <>
						<div className='text-base font-bold' title="supply">
							"{ props.item.fields["supply"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("hasdividend" != "name") && !Array.isArray(props.item.fields["hasdividend"]) &&  !(typeof props.item.fields["hasdividend"] === 'object')  && (props.item.fields["hasdividend"].length > 0) && <>
						<div className='text-base font-bold' title="hasdividend">
							"{ props.item.fields["hasdividend"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("website" != "name") && !Array.isArray(props.item.fields["website"]) &&  !(typeof props.item.fields["website"] === 'object')  && (props.item.fields["website"].length > 0) && <>
						<div className='text-base font-bold' title="website">
							"{ props.item.fields["website"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("twitter" != "name") && !Array.isArray(props.item.fields["twitter"]) &&  !(typeof props.item.fields["twitter"] === 'object')  && (props.item.fields["twitter"].length > 0) && <>
						<div className='text-base font-bold' title="twitter">
							"{ props.item.fields["twitter"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("telegram" != "name") && !Array.isArray(props.item.fields["telegram"]) &&  !(typeof props.item.fields["telegram"] === 'object')  && (props.item.fields["telegram"].length > 0) && <>
						<div className='text-base font-bold' title="telegram">
							"{ props.item.fields["telegram"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("liquidityaddress" != "name") && !Array.isArray(props.item.fields["liquidityaddress"]) &&  !(typeof props.item.fields["liquidityaddress"] === 'object')  && (props.item.fields["liquidityaddress"].length > 0) && <>
						<div className='text-base font-bold' title="liquidityaddress">
							"{ props.item.fields["liquidityaddress"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("burnamount" != "name") && !Array.isArray(props.item.fields["burnamount"]) &&  !(typeof props.item.fields["burnamount"] === 'object')  && (props.item.fields["burnamount"].length > 0) && <>
						<div className='text-base font-bold' title="burnamount">
							"{ props.item.fields["burnamount"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("mintlocation" != "name") && !Array.isArray(props.item.fields["mintlocation"]) &&  !(typeof props.item.fields["mintlocation"] === 'object')  && (props.item.fields["mintlocation"].length > 0) && <>
						<div className='text-base font-bold' title="mintlocation">
							"{ props.item.fields["mintlocation"] }"
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="edittoken"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}