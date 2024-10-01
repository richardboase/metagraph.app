import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';

import Spacer from '@/inputs/spacer';
import Submit from '@/inputs/submit';
import Input from '@/inputs/input';
import Textarea from '@/inputs/textarea';
import Checkbox from '@/inputs/checkbox';
import Select from '@/inputs/select';
import CollectionSelect from '@/inputs/collectionSelect';
import Color from '@/inputs/color';
import Object from '@/inputs/object';

import InputChange from '@/inputs/inputChange';

export function AdopterForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="FIRST_NAME" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="adopter first-name" placeholder="adopter first-name" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="MIDDLE_NAMES" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ false } title="adopter middle-names" placeholder="adopter middle-names" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="LAST_NAME" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="adopter last-name" placeholder="adopter last-name" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="ADOPTER_PHONE_NUMBER" ftype={ {"Name":"PHONE","Go":"string","Input":"input","Type":"tel"} } required={ true } title="adopter adopter phone number" placeholder="adopter adopter phone number" inputChange={handleInputChange}/><Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["FIRST_NAME","LAST_NAME","ADOPTER_PHONE_NUMBER"]}/>
			
		</div>
	);
}
