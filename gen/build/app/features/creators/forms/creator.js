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

export function CreatorForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ true } title="creator name" placeholder="creator name" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="company" type='text' required={ false } title="creator company" placeholder="creator company" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="band" type='text' required={ false } title="creator band" placeholder="creator band" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="artistname" type='text' required={ false } title="creator artistname" placeholder="creator artistname" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name"]}/>
			<Spacer/>
			
		</div>
	);
}
