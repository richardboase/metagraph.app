import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { RowPay } from "@/components/rowPay"
import { titlecase } from "../_interfaces"

export function BookcharacterListRow(props) {

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
					("age" != "name") && !Array.isArray(props.item.fields["age"]) &&  !(typeof props.item.fields["age"] === 'object')  && <>
						<div className='text-sm font-bold' title="age">
							{ props.item.fields["age"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("gender" != "name") && !Array.isArray(props.item.fields["gender"]) &&  !(typeof props.item.fields["gender"] === 'object')  && <>
						<div className='text-sm font-bold' title="gender">
							{ props.item.fields["gender"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("profession" != "name") && !Array.isArray(props.item.fields["profession"]) &&  !(typeof props.item.fields["profession"] === 'object')  && <>
						<div className='text-sm font-bold' title="profession">
							{ props.item.fields["profession"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("diseases" != "name") && !Array.isArray(props.item.fields["diseases"]) &&  !(typeof props.item.fields["diseases"] === 'object')  && <>
						<div className='text-sm font-bold' title="diseases">
							{ props.item.fields["diseases"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("socialclass" != "name") && !Array.isArray(props.item.fields["socialclass"]) &&  !(typeof props.item.fields["socialclass"] === 'object')  && <>
						<div className='text-sm font-bold' title="socialclass">
							{ props.item.fields["socialclass"] }
						</div>
						<div className="px-4"></div>
					</>
				}{
					("backstory" != "name") && !Array.isArray(props.item.fields["backstory"]) &&  !(typeof props.item.fields["backstory"] === 'object')  && <>
						<div className='text-sm font-bold' title="backstory">
							{ props.item.fields["backstory"] }
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<RowPay id={props.id} item={props.item}/>

			
			<RowEdit object={props.item} editInterface="editbookcharacter"/>
			<RowDelete id={props.id} delete={deleteItem}/>
		</div>
	)
}