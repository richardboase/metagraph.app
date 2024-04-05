import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function BookcharacterListRowImage(props) {

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
					("name" != "name") && !Array.isArray(props.item.fields["name"]) &&  !(typeof props.item.fields["name"] === 'object')  && (props.item.fields["name"].length > 0) && <>
						<div className='text-base font-bold' title="name">
							"{ props.item.fields["name"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("age" != "name") && !Array.isArray(props.item.fields["age"]) &&  !(typeof props.item.fields["age"] === 'object')  && (props.item.fields["age"].length > 0) && <>
						<div className='text-base font-bold' title="age">
							"{ props.item.fields["age"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("gender" != "name") && !Array.isArray(props.item.fields["gender"]) &&  !(typeof props.item.fields["gender"] === 'object')  && (props.item.fields["gender"].length > 0) && <>
						<div className='text-base font-bold' title="gender">
							"{ props.item.fields["gender"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("profession" != "name") && !Array.isArray(props.item.fields["profession"]) &&  !(typeof props.item.fields["profession"] === 'object')  && (props.item.fields["profession"].length > 0) && <>
						<div className='text-base font-bold' title="profession">
							"{ props.item.fields["profession"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("diseases" != "name") && !Array.isArray(props.item.fields["diseases"]) &&  !(typeof props.item.fields["diseases"] === 'object')  && (props.item.fields["diseases"].length > 0) && <>
						<div className='text-base font-bold' title="diseases">
							"{ props.item.fields["diseases"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("socialclass" != "name") && !Array.isArray(props.item.fields["socialclass"]) &&  !(typeof props.item.fields["socialclass"] === 'object')  && (props.item.fields["socialclass"].length > 0) && <>
						<div className='text-base font-bold' title="socialclass">
							"{ props.item.fields["socialclass"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("backstory" != "name") && !Array.isArray(props.item.fields["backstory"]) &&  !(typeof props.item.fields["backstory"] === 'object')  && (props.item.fields["backstory"].length > 0) && <>
						<div className='text-base font-bold' title="backstory">
							"{ props.item.fields["backstory"] }"
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="editbookcharacter"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}