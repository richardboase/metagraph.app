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

import InputChange from '@/inputs/inputChange';


export function CharacterEdit(props) {

	console.log("COLLECTION EDIT", props)

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	const [inputs, setInputs] = useState({
		"name": {
			id: "name",
			type: "string",
			value: subject.fields.name,
			required: true,
		},"age": {
			id: "age",
			type: "int",
			value: subject.fields.age,
			required: true,
		},"gender": {
			id: "gender",
			type: "string",
			value: subject.fields.gender,
			required: true,
		},"diseases": {
			id: "diseases",
			type: "string",
			value: subject.fields.diseases,
			required: true,
		},"profession": {
			id: "profession",
			type: "string",
			value: subject.fields.profession,
			required: true,
		},"socialclass": {
			id: "socialclass",
			type: "string",
			value: subject.fields.socialclass,
			required: true,
		},"backstory": {
			id: "backstory",
			type: "string",
			value: subject.fields.backstory,
			required: true,
		},
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ true } title="character name" placeholder="character name" inputChange={handleInputChange} value={ inputs["name"].value } />
			<Spacer/>
			
			<Input id="age" type='number' required={ true } title="character age" inputChange={handleInputChange} value={ inputs["age"].value } />
			<Spacer/>
			
			<Input id="gender" type='text' required={ true } title="character gender" placeholder="character gender" inputChange={handleInputChange} value={ inputs["gender"].value } />
			<Spacer/>
			
			<Input id="diseases" type='text' required={ true } title="character diseases" placeholder="character diseases" inputChange={handleInputChange} value={ inputs["diseases"].value } />
			<Spacer/>
			
			<Input id="profession" type='text' required={ true } title="character profession" placeholder="character profession" inputChange={handleInputChange} value={ inputs["profession"].value } />
			<Spacer/>
			
			<Input id="socialclass" type='text' required={ true } title="character socialclass" placeholder="character socialclass" inputChange={handleInputChange} value={ inputs["socialclass"].value } />
			<Spacer/>
			
			<Input id="backstory" type='text' required={ true } title="character backstory" placeholder="character backstory" inputChange={handleInputChange} value={ inputs["backstory"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","age","gender","diseases","profession","socialclass","backstory"]}/>
			<Spacer/>
			
		</div>
	);
}
