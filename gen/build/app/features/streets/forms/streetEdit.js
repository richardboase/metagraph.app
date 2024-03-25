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


export function StreetEdit(props) {

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
			
			required: false,
		},
		
		"zoning": {
			id: "zoning",
			type: "string",
			
			value: subject.fields.zoning,
			
			required: false,
		},
		
		"length": {
			id: "length",
			type: "int",
			
			value: subject.fields.length,
			
			required: false,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ false } title="street name" placeholder="street name" inputChange={handleInputChange} value={ inputs["name"].value } />
			<Spacer/>
			
			<Input id="zoning" type='text' required={ false } title="street zoning" placeholder="street zoning" inputChange={handleInputChange} value={ inputs["zoning"].value } />
			<Spacer/>
			
			<Input id="length" type='number' required={ false } title="street length" inputChange={handleInputChange} value={ inputs["length"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={[]}/>
			<Spacer/>
			
		</div>
	);
}
