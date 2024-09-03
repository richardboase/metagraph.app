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


export function DonationEdit(props) {

	console.log("COLLECTION EDIT", props)

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	const [inputs, setInputs] = useState({
		
		"amount": {
			id: "amount",
			type: "float64",
			
			value: subject.fields.amount,
			
			required: true,
		},
		
		"donorname": {
			id: "donorname",
			type: "string",
			
			value: subject.fields.donorname,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="amount" type='number' required={ true } title="donation amount" inputChange={handleInputChange} value={ inputs["amount"].value } />
			<Spacer/>
			
			<Input id="donorname" type='text' required={ true } title="donation donorname" placeholder="donation donorname" inputChange={handleInputChange} value={ inputs["donorname"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["amount","donorname"]}/>
			<Spacer/>
			
		</div>
	);
}
