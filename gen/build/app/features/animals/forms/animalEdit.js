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
		
		"animalname": {
			id: "animalname",
			type: "string",
			
			value: subject.fields.animalname,
			
			required: true,
		},
		
		"animalspecies": {
			id: "animalspecies",
			type: "string",
			
			value: subject.fields.animalspecies,
			
			required: true,
		},
		
		"animalage": {
			id: "animalage",
			type: "uint",
			
			value: subject.fields.animalage,
			
			required: true,
		},
		
		"animalbirthday": {
			id: "animalbirthday",
			type: "date",
			
			value: subject.fields.animalbirthday,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="animal name" type='string' required={ true } title="animal animal name" placeholder="animal animal name" inputChange={handleInputChange} value={ inputs["animal name"].value } />
			<Spacer/>
			
			<Input id="animal species" type='string' required={ true } title="animal animal species" placeholder="animal animal species" inputChange={handleInputChange} value={ inputs["animal species"].value } />
			<Spacer/>
			
			<Input id="animal age" type='number' required={ true } title="animal animal age" inputChange={handleInputChange} value={ inputs["animal age"].value } />
			<Spacer/>
			
			<Input id="animal birthday" type='date' required={ true } title="animal animal birthday" placeholder="animal animal birthday" inputChange={handleInputChange} value={ inputs["animal birthday"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["animal name","animal species","animal age","animal birthday"]}/>
			<Spacer/>
			
		</div>
	);
}
