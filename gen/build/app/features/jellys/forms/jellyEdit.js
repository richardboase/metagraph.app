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
			
			required: true,
		},
		
		"hp": {
			id: "hp",
			type: "int",
			
			value: subject.fields.hp,
			
			required: true,
		},
		
		"socialclass": {
			id: "socialclass",
			type: "string",
			
			value: subject.fields.socialclass,
			
			required: true,
		},
		
		"backstory": {
			id: "backstory",
			type: "string",
			
			value: subject.fields.backstory,
			
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
			
			<Input id="gender" type='text' required={ true } title="jelly gender" placeholder="jelly gender" inputChange={handleInputChange} value={ inputs["gender"].value } />
			<Spacer/>
			
			<Input id="element" type='text' required={ true } title="jelly element" placeholder="jelly element" inputChange={handleInputChange} value={ inputs["element"].value } />
			<Spacer/>
			
			<Input id="hp" type='number' required={ true } title="jelly hp" inputChange={handleInputChange} value={ inputs["hp"].value } />
			<Spacer/>
			
			<Input id="socialclass" type='text' required={ true } title="jelly socialclass" placeholder="jelly socialclass" inputChange={handleInputChange} value={ inputs["socialclass"].value } />
			<Spacer/>
			
			<Input id="backstory" type='text' required={ true } title="jelly backstory" placeholder="jelly backstory" inputChange={handleInputChange} value={ inputs["backstory"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","gender","element","hp","socialclass","backstory"]}/>
			<Spacer/>
			
		</div>
	);
}
