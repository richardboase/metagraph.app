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
import Object from '@/inputs/object';

import InputChange from '@/inputs/inputChange';


export function CreatorEdit(props) {

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
			
			value: subject.Meta.Name,
			
			required: true,
		},
		
		"company": {
			id: "company",
			type: "string",
			
			value: subject.fields.company,
			
			required: false,
		},
		
		"band": {
			id: "band",
			type: "string",
			
			value: subject.fields.band,
			
			required: false,
		},
		
		"artistname": {
			id: "artistname",
			type: "string",
			
			value: subject.fields.artistname,
			
			required: false,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='text' required={ true } title="creator name" placeholder="creator name" inputChange={handleInputChange} value={ inputs["name"].value } />
			<Spacer/>
			
			<Input id="company" type='text' required={ false } title="creator company" placeholder="creator company" inputChange={handleInputChange} value={ inputs["company"].value } />
			<Spacer/>
			
			<Input id="band" type='text' required={ false } title="creator band" placeholder="creator band" inputChange={handleInputChange} value={ inputs["band"].value } />
			<Spacer/>
			
			<Input id="artistname" type='text' required={ false } title="creator artistname" placeholder="creator artistname" inputChange={handleInputChange} value={ inputs["artistname"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name"]}/>
			<Spacer/>
			
		</div>
	);
}
