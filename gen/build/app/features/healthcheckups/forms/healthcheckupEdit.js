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


export function HealthcheckupEdit(props) {

	console.error("COLLECTION EDIT", props)

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	const [inputs, setInputs] = useState({
		
		"NOTES": {
			id: "NOTES",
			ftype: {"Name":"STRING","Go":"string","Input":"input","Type":"text"},
			
				value: subject.fields.NOTES,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="NOTES" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="healthCheckup notes" placeholder="healthCheckup notes" inputChange={handleInputChange} value={ inputs["NOTES"].value } /><Spacer/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["NOTES"]}/>
			<Spacer/>
			
		</div>
	);
}
