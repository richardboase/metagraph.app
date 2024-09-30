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

export function ClassofthingsForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="NAME" type='string' required={ true } title="classOfThings name" placeholder="classOfThings name" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="SPECIES" type='string' required={ true } title="classOfThings species" placeholder="classOfThings species" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="AGE" type='number' required={ true } title="classOfThings age" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="BIRTHDAY" type='date' required={ true } title="classOfThings birthday" placeholder="classOfThings birthday" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="BUILDINGNUMBER" type='number' required={ true } title="classOfThings building number" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="APARTMENTNUMBER" type='number' required={ false } title="classOfThings apartment number" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="STREET" type='string' required={ true } title="classOfThings street" placeholder="classOfThings street" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="TOWNORCITY" type='string' required={ true } title="classOfThings town or city" placeholder="classOfThings town or city" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="COUNTRY" type='string' required={ true } title="classOfThings country" placeholder="classOfThings country" inputChange={handleInputChange}/><Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","species","age","birthday","building number","street","town or city","country"]}/>
			
		</div>
	);
}
