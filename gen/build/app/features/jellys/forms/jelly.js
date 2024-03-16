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

export function JellyForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ true } title="jelly name" placeholder="jelly name" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="gender" type='text' required={ true } title="jelly gender" placeholder="jelly gender" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="element" type='text' required={ true } title="jelly element" placeholder="jelly element" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="hp" type='number' required={ true } title="jelly hp" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="socialclass" type='text' required={ true } title="jelly socialclass" placeholder="jelly socialclass" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="backstory" type='text' required={ true } title="jelly backstory" placeholder="jelly backstory" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","gender","element","hp","socialclass","backstory"]}/>
			<Spacer/>
			
		</div>
	);
}
