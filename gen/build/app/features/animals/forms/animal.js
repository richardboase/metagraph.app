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

export function AnimalForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ true } title="animal name" placeholder="animal name" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="species" type='text' required={ true } title="animal species" placeholder="animal species" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="age" type='number' required={ false } title="animal age" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","species"]}/>
			<Spacer/>
			
		</div>
	);
}
