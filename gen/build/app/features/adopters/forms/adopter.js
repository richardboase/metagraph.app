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
			
			<Input id="first-name" type='text' required={ true } title="adopter first-name" placeholder="adopter first-name" inputChange={handleInputChange} value={ inputs["first-name"].value } /><Input id="middle-names" type='text' required={ false } title="adopter middle-names" placeholder="adopter middle-names" inputChange={handleInputChange} value={ inputs["middle-names"].value } /><Input id="last-name" type='text' required={ true } title="adopter last-name" placeholder="adopter last-name" inputChange={handleInputChange} value={ inputs["last-name"].value } />
			<Spacer/>
			
			<Input id="adopter phone number" type='phone' required={ true } title="adopter adopter phone number" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["adopter name","adopter phone number"]}/>
			<Spacer/>
			
		</div>
	);
}
