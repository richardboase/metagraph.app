import { useState, useEffect } from "react"
import { useUserContext } from "@/context/user"

import Spacer from "@/inputs/spacer"

import { RowThumbnail } from "@/components/rowThumbnail"
import { RowDelete } from "@/components/rowDelete"
import { RowEdit } from "@/components/rowEdit"
import { RowOrder } from "@/components/rowOrder"
import { titlecase } from "../_interfaces"

export function PetListRowImage(props) {

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
					("species" != "name") && !Array.isArray(props.item.fields["species"]) &&  !(typeof props.item.fields["species"] === 'object')  && (props.item.fields["species"].length > 0) && <>
						<div className='text-base font-bold' title="species">
							"{ props.item.fields["species"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("breed" != "name") && !Array.isArray(props.item.fields["breed"]) &&  !(typeof props.item.fields["breed"] === 'object')  && (props.item.fields["breed"].length > 0) && <>
						<div className='text-base font-bold' title="breed">
							"{ props.item.fields["breed"] }"
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
					("medicalhistory" != "name") && !Array.isArray(props.item.fields["medicalhistory"]) &&  !(typeof props.item.fields["medicalhistory"] === 'object')  && (props.item.fields["medicalhistory"].length > 0) && <>
						<div className='text-base font-bold' title="medicalhistory">
							"{ props.item.fields["medicalhistory"] }"
						</div>
						<div className="px-4"></div>
					</>
				}{
					("adoptionstatus" != "name") && !Array.isArray(props.item.fields["adoptionstatus"]) &&  !(typeof props.item.fields["adoptionstatus"] === 'object')  && (props.item.fields["adoptionstatus"].length > 0) && <>
						<div className='text-base font-bold' title="adoptionstatus">
							"{ props.item.fields["adoptionstatus"] }"
						</div>
						<div className="px-4"></div>
					</>
				}
			</div>
			<div className="flex flex-rowc ">
				
				<RowEdit object={props.item} editInterface="editpet"/>
				<RowDelete id={props.id} delete={deleteItem}/>
			</div>
		</div>
	)
}