import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';

import Spacer from '@/inputs/spacer';
import Submit from '@/inputs/submit';
import Input from '@/inputs/input';
import Color from '@/inputs/color';
import Checkbox from '@/inputs/checkbox';
import Select from '@/inputs/select';
import CollectionSelect from '@/inputs/collectionSelect';
import Object from '@/inputs/object';

import InputChange from '@/inputs/inputChange';


export function ParentEdit(props) {

	console.error("COLLECTION EDIT", props)

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	const [inputs, setInputs] = useState({
		
		"NAME": {
			id: "NAME",
			ftype: {"Name":"STRING","Go":"string","Input":"input","Type":"text"},
			
				value: subject.fields.NAME,
			
			required: true,
		},
		
		"SPECIES": {
			id: "SPECIES",
			ftype: {"Name":"STRING","Go":"string","Input":"input","Type":"text"},
			
				value: subject.fields.SPECIES,
			
			required: true,
		},
		
		"AGE": {
			id: "AGE",
			ftype: {"Name":"INT","Go":"int","Input":"input","Type":"number"},
			
				value: subject.fields.AGE,
			
			required: true,
		},
		
		"BIRTHDAY": {
			id: "BIRTHDAY",
			ftype: {"Name":"DATE","Go":"string","Input":"input","Type":"date"},
			
				value: subject.fields.BIRTHDAY,
			
			required: true,
		},
		
		"ADDRESS": {
			id: "ADDRESS",
			ftype: null,
			
				value: "",
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="NAME" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="Parent name" placeholder="Parent name" inputChange={handleInputChange} value={ inputs["NAME"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="SPECIES" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="Parent species" placeholder="Parent species" inputChange={handleInputChange} value={ inputs["SPECIES"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="AGE" ftype={ {"Name":"INT","Go":"int","Input":"input","Type":"number"} } required={ true } title="Parent age" inputChange={handleInputChange} value={ inputs["AGE"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="BIRTHDAY" ftype={ {"Name":"DATE","Go":"string","Input":"input","Type":"date"} } required={ true } title="Parent birthday" placeholder="Parent birthday" inputChange={handleInputChange} value={ inputs["BIRTHDAY"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="BUILDING_NUMBER" ftype={ {"Name":"INT","Go":"int","Input":"input","Type":"number"} } required={ true } title="Parent building number" inputChange={handleInputChange} value={ inputs["BUILDING_NUMBER"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="APARTMENT_NUMBER" ftype={ {"Name":"INT","Go":"int","Input":"input","Type":"number"} } required={ false } title="Parent apartment number" inputChange={handleInputChange} value={ inputs["APARTMENT_NUMBER"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="STREET" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="Parent street" placeholder="Parent street" inputChange={handleInputChange} value={ inputs["STREET"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="TOWN_OR_CITY" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="Parent town or city" placeholder="Parent town or city" inputChange={handleInputChange} value={ inputs["TOWN_OR_CITY"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="COUNTRY" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="Parent country" placeholder="Parent country" inputChange={handleInputChange} value={ inputs["COUNTRY"].value } /><Spacer/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["NAME","SPECIES","AGE","BIRTHDAY","BUILDING_NUMBER","STREET","TOWN_OR_CITY","COUNTRY"]}/>
			<Spacer/>
			
		</div>
	);
}
