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

	console.log("COLLECTION EDIT", props)

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	const [inputs, setInputs] = useState({
		
		"name": {
			id: "name",
			type: "string",
			
			value: subject.Meta.Name,
			
			required: true,
		},
		
		"contactnumber": {
			id: "contactnumber",
			type: "string",
			
			value: subject.fields.contactnumber,
			
			required: true,
		},
		
		"address": {
			id: "address",
			type: "string",
			
			value: subject.fields.address,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ true } title="adopter name" placeholder="adopter name" inputChange={handleInputChange} value={ inputs["name"].value } />
			<Spacer/>
			
			<Input id="contactnumber" type='text' required={ true } title="adopter contactnumber" placeholder="adopter contactnumber" inputChange={handleInputChange} value={ inputs["contactnumber"].value } />
			<Spacer/>
			
			<Input id="address" type='text' required={ true } title="adopter address" placeholder="adopter address" inputChange={handleInputChange} value={ inputs["address"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","contactnumber","address"]}/>
			<Spacer/>
			
		</div>
	);
}
