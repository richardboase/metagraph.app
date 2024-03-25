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


export function ThingEdit(props) {

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
		
		"description": {
			id: "description",
			type: "string",
			
			value: subject.fields.description,
			
			required: true,
		},
		
		"state": {
			id: "state",
			type: "string",
			
			value: subject.fields.state,
			
			required: true,
		},
		
		"age": {
			id: "age",
			type: "int",
			
			value: subject.fields.age,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ true } title="thing name" placeholder="thing name" inputChange={handleInputChange} value={ inputs["name"].value } />
			<Spacer/>
			
			<Input id="description" type='text' required={ true } title="thing description" placeholder="thing description" inputChange={handleInputChange} value={ inputs["description"].value } />
			<Spacer/>
			
			<Input id="state" type='text' required={ true } title="thing state" placeholder="thing state" inputChange={handleInputChange} value={ inputs["state"].value } />
			<Spacer/>
			
			<Input id="age" type='number' required={ true } title="thing age" inputChange={handleInputChange} value={ inputs["age"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","description","state","age"]}/>
			<Spacer/>
			
		</div>
	);
}
