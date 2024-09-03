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


export function PetEdit(props) {

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
		
		"breed": {
			id: "breed",
			type: "string",
			
			value: subject.fields.breed,
			
			required: true,
		},
		
		"age": {
			id: "age",
			type: "int",
			
			value: subject.fields.age,
			
			required: true,
		},
		
		"medicalhistory": {
			id: "medicalhistory",
			type: "string",
			
			value: subject.fields.medicalhistory,
			
			required: true,
		},
		
		"adoptionstatus": {
			id: "adoptionstatus",
			type: "string",
			
			value: subject.fields.adoptionstatus,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ true } title="pet name" placeholder="pet name" inputChange={handleInputChange} value={ inputs["name"].value } />
			<Spacer/>
			
			<Input id="species" type='text' required={ true } title="pet species" placeholder="pet species" inputChange={handleInputChange} value={ inputs["species"].value } />
			<Spacer/>
			
			<Input id="breed" type='text' required={ true } title="pet breed" placeholder="pet breed" inputChange={handleInputChange} value={ inputs["breed"].value } />
			<Spacer/>
			
			<Input id="age" type='number' required={ true } title="pet age" inputChange={handleInputChange} value={ inputs["age"].value } />
			<Spacer/>
			
			<Input id="medicalhistory" type='text' required={ true } title="pet medicalhistory" placeholder="pet medicalhistory" inputChange={handleInputChange} value={ inputs["medicalhistory"].value } />
			<Spacer/>
			
			<Input id="adoptionstatus" type='text' required={ true } title="pet adoptionstatus" placeholder="pet adoptionstatus" inputChange={handleInputChange} value={ inputs["adoptionstatus"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","species","breed","age","medicalhistory","adoptionstatus"]}/>
			<Spacer/>
			
		</div>
	);
}
