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

export function ParentForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="NAME" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="Parent name" placeholder="Parent name" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="SPECIES" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="Parent species" placeholder="Parent species" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="AGE" ftype={ {"Name":"INT","Go":"int","Input":"input","Type":"number"} } required={ true } title="Parent age" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="BIRTHDAY" ftype={ {"Name":"DATE","Go":"string","Input":"input","Type":"date"} } required={ true } title="Parent birthday" placeholder="Parent birthday" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="BUILDING_NUMBER" ftype={ {"Name":"INT","Go":"int","Input":"input","Type":"number"} } required={ true } title="Parent building number" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="APARTMENT_NUMBER" ftype={ {"Name":"INT","Go":"int","Input":"input","Type":"number"} } required={ false } title="Parent apartment number" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="STREET" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="Parent street" placeholder="Parent street" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="TOWN_OR_CITY" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="Parent town or city" placeholder="Parent town or city" inputChange={handleInputChange}/><Spacer/>
			
			<Input id="COUNTRY" ftype={ {"Name":"STRING","Go":"string","Input":"input","Type":"text"} } required={ true } title="Parent country" placeholder="Parent country" inputChange={handleInputChange}/><Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["NAME","SPECIES","AGE","BIRTHDAY","BUILDING_NUMBER","STREET","TOWN_OR_CITY","COUNTRY"]}/>
			
		</div>
	);
}
