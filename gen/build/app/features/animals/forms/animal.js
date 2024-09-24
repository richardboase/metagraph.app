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
			
			<Input id="animal name" type='text' required={ true } title="animal animal name" placeholder="animal animal name" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="animal species" type='text' required={ true } title="animal animal species" placeholder="animal animal species" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="animal age" type='number' required={ true } title="animal animal age" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="animal birthday" type='date' required={ true } title="animal animal birthday" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["animal name","animal species","animal age","animal birthday"]}/>
			<Spacer/>
			
		</div>
	);
}
