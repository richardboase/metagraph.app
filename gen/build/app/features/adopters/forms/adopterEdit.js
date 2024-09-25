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
		
		"adoptername": {
			id: "adoptername",
			type: "person.name",
			
			value: subject.fields.adoptername,
			
			required: true,
		},
		
		"adopterphonenumber": {
			id: "adopterphonenumber",
			type: "phone",
			
			value: subject.fields.adopterphonenumber,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="first-name" type='name' required={ true } title="adopter first-name" placeholder="adopter first-name" inputChange={handleInputChange} value={ inputs["firstname"].value } /><Input id="middle-names" type='name' required={ false } title="adopter middle-names" placeholder="adopter middle-names" inputChange={handleInputChange} value={ inputs["middlenames"].value } /><Input id="last-name" type='name' required={ true } title="adopter last-name" placeholder="adopter last-name" inputChange={handleInputChange} value={ inputs["lastname"].value } />
			<Spacer/>
			
			<Input id="adopter phone number" type='phone' required={ true } title="adopter adopter phone number" placeholder="adopter adopter phone number" inputChange={handleInputChange} value={ inputs["adopterphonenumber"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["adopter name","adopter phone number"]}/>
			<Spacer/>
			
		</div>
	);
}
