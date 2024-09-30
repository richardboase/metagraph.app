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


export function AnimalEdit(props) {

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
		
		"species": {
			id: "species",
			type: "string",
			
			value: subject.fields.species,
			
			required: true,
		},
		
		"age": {
			id: "age",
			type: "uint",
			
			value: subject.fields.age,
			
			required: true,
		},
		
		"birthday": {
			id: "birthday",
			type: "date",
			
			value: subject.fields.birthday,
			
			required: true,
		},
		
		"address": {
			id: "address",
			type: "address",
			
			value: subject.fields.address,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="NAME" type='string' required={ true } title="animal name" placeholder="animal name" inputChange={handleInputChange} value={ inputs["NAME"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="SPECIES" type='string' required={ true } title="animal species" placeholder="animal species" inputChange={handleInputChange} value={ inputs["SPECIES"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="AGE" type='number' required={ true } title="animal age" inputChange={handleInputChange} value={ inputs["AGE"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="BIRTHDAY" type='date' required={ true } title="animal birthday" placeholder="animal birthday" inputChange={handleInputChange} value={ inputs["BIRTHDAY"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="BUILDINGNUMBER" type='number' required={ true } title="animal building number" inputChange={handleInputChange} value={ inputs["BUILDINGNUMBER"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="APARTMENTNUMBER" type='number' required={ false } title="animal apartment number" inputChange={handleInputChange} value={ inputs["APARTMENTNUMBER"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="STREET" type='string' required={ true } title="animal street" placeholder="animal street" inputChange={handleInputChange} value={ inputs["STREET"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="TOWNORCITY" type='string' required={ true } title="animal town or city" placeholder="animal town or city" inputChange={handleInputChange} value={ inputs["TOWNORCITY"].value } /><Spacer/>
			<Spacer/>
			
			<Input id="COUNTRY" type='string' required={ true } title="animal country" placeholder="animal country" inputChange={handleInputChange} value={ inputs["COUNTRY"].value } /><Spacer/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","species","age","birthday","building number","street","town or city","country"]}/>
			<Spacer/>
			
		</div>
	);
}
