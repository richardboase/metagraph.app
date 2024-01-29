import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';

import Spacer from '@/inputs/spacer';
import Submit from '@/inputs/submit';
import Input from '@/inputs/input';
import Textarea from '@/inputs/textarea';
import InputChange from '@/inputs/inputChange';
import Checkbox from '@/inputs/checkbox';
import Select from '@/inputs/select';
import CollectionSelect from '@/inputs/collectionSelect';
import Color from '@/inputs/color';

export function CharacterForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ true } title="character name" placeholder="character name" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="age" type='number' required={ true } title="character age" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="gender" type='text' required={ true } title="character gender" placeholder="character gender" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="diseases" type='text' required={ true } title="character diseases" placeholder="character diseases" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="profession" type='text' required={ true } title="character profession" placeholder="character profession" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="socialclass" type='text' required={ true } title="character socialclass" placeholder="character socialclass" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="backstory" type='text' required={ true } title="character backstory" placeholder="character backstory" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","age","gender","diseases","profession","socialclass","backstory"]}/>
			<Spacer/>
			
		</div>
	);
}
