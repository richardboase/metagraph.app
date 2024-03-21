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


export function BuildingEdit(props) {

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
		
		"description": {
			id: "description",
			type: "string",
			
			value: subject.fields.description,
			
			required: false,
		},
		
		"number": {
			id: "number",
			type: "int",
			
			value: subject.fields.number,
			
			required: false,
		},
		
		"xunits": {
			id: "xunits",
			type: "float64",
			
			value: subject.fields.xunits,
			
			required: true,
		},
		
		"yunits": {
			id: "yunits",
			type: "float64",
			
			value: subject.fields.yunits,
			
			required: true,
		},
		
		"doors": {
			id: "doors",
			type: "int",
			
			value: subject.fields.doors,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ false } title="building name" placeholder="building name" inputChange={handleInputChange} value={ inputs["name"].value } />
			<Spacer/>
			
			<Input id="description" type='text' required={ false } title="building description" placeholder="building description" inputChange={handleInputChange} value={ inputs["description"].value } />
			<Spacer/>
			
			<Input id="number" type='number' required={ false } title="building number" inputChange={handleInputChange} value={ inputs["number"].value } />
			<Spacer/>
			
			<Input id="xunits" type='number' required={ true } title="building xunits" inputChange={handleInputChange} value={ inputs["xunits"].value } />
			<Spacer/>
			
			<Input id="yunits" type='number' required={ true } title="building yunits" inputChange={handleInputChange} value={ inputs["yunits"].value } />
			<Spacer/>
			
			<Input id="doors" type='number' required={ true } title="building doors" inputChange={handleInputChange} value={ inputs["doors"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["xunits","yunits","doors"]}/>
			<Spacer/>
			
		</div>
	);
}
