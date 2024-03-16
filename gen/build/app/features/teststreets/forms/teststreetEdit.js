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


export function TeststreetEdit(props) {

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
			
			required: false,
		},
		
		"start": {
			id: "start",
			type: "string",
			
			value: subject.fields.start,
			
			required: false,
		},
		
		"end": {
			id: "end",
			type: "string",
			
			value: subject.fields.end,
			
			required: false,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ true } title="teststreet name" placeholder="teststreet name" inputChange={handleInputChange} value={ inputs["name"].value } />
			<Spacer/>
			
			<Input id="description" type='text' required={ false } title="teststreet description" placeholder="teststreet description" inputChange={handleInputChange} value={ inputs["description"].value } />
			<Spacer/>
			
			<Input id="start" type='text' required={ false } title="teststreet start" placeholder="teststreet start" inputChange={handleInputChange} value={ inputs["start"].value } />
			<Spacer/>
			
			<Input id="end" type='text' required={ false } title="teststreet end" placeholder="teststreet end" inputChange={handleInputChange} value={ inputs["end"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name"]}/>
			<Spacer/>
			
		</div>
	);
}
