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


export function AdopterEdit(props) {

	console.error("COLLECTION EDIT", props)

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	const [inputs, setInputs] = useState({
		
		"ADOPTER_NAME": {
			id: "ADOPTER_NAME",
			ftype: null,
			
				value: "",
			
			required: true,
		},
		
		"ADOPTER_PHONE_NUMBER": {
			id: "ADOPTER_PHONE_NUMBER",
			ftype: {"Name":"PHONE","Go":"string","Input":"input","Type":"tel"},
			
				value: subject.fields.ADOPTER_PHONE_NUMBER,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="FIRST_NAME" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="adopter first-name" placeholder="adopter first-name" inputChange={handleInputChange} value={ inputs["FIRST_NAME"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="MIDDLE_NAMES" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ false } title="adopter middle-names" placeholder="adopter middle-names" inputChange={handleInputChange} value={ inputs["MIDDLE_NAMES"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="LAST_NAME" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="adopter last-name" placeholder="adopter last-name" inputChange={handleInputChange} value={ inputs["LAST_NAME"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="ADOPTER_PHONE_NUMBER" ftype={ {"Name":"PHONE","Go":"string","Input":"input","Type":"tel"} } required={ true } title="adopter adopter phone number" placeholder="adopter adopter phone number" inputChange={handleInputChange} value={ inputs["ADOPTER_PHONE_NUMBER"].value } /><Spacer/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["FIRST_NAME","LAST_NAME","ADOPTER_PHONE_NUMBER"]}/>
			<Spacer/>
			
		</div>
	);
}
