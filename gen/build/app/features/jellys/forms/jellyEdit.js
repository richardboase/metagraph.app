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


export function JellyEdit(props) {

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
		
		"gender": {
			id: "gender",
			type: "string",
			
			value: subject.fields.gender,
			
			required: true,
		},
		
		"element": {
			id: "element",
			type: "string",
			
			value: subject.fields.element,
			
			required: false,
		},
		
		"hp": {
			id: "hp",
			type: "int",
			
			value: subject.fields.hp,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ true } title="jelly name" placeholder="jelly name" inputChange={handleInputChange} value={ inputs["name"].value } />
			<Spacer/>
			
			<Select id="gender" type='text' required={ true } reference={ "" } referenceParent={ subject } title="jelly gender" options={ ["male","female"] } placeholder="jelly gender" inputChange={handleInputChange} value={ inputs["gender"].value } />
			<Spacer/>
			
			<Select id="element" type='text' required={ false } reference={ "jellynames" } referenceParent={ subject } title="jelly element" options={ null } placeholder="jelly element" inputChange={handleInputChange} value={ inputs["element"].value } />
			<Spacer/>
			
			<Input id="hp" type='number' required={ true } title="jelly hp" inputChange={handleInputChange} value={ inputs["hp"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","gender","hp"]}/>
			<Spacer/>
			
		</div>
	);
}
