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


export function MusicdetailsEdit(props) {

	console.log("COLLECTION EDIT", props)

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	const [inputs, setInputs] = useState({
		
		"albumname": {
			id: "albumname",
			type: "string",
			
			value: subject.fields.albumname,
			
			required: true,
		},
		
		"trackname": {
			id: "trackname",
			type: "string",
			
			value: subject.fields.trackname,
			
			required: true,
		},
		
		"albumimage": {
			id: "albumimage",
			type: "string",
			
			value: subject.fields.albumimage,
			
			required: false,
		},
		
		"trackimage": {
			id: "trackimage",
			type: "string",
			
			value: subject.fields.trackimage,
			
			required: false,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="albumname" type='text' required={ true } title="musicDetails albumname" placeholder="musicDetails albumname" inputChange={handleInputChange} value={ inputs["albumname"].value } />
			<Spacer/>
			
			<Input id="trackname" type='text' required={ true } title="musicDetails trackname" placeholder="musicDetails trackname" inputChange={handleInputChange} value={ inputs["trackname"].value } />
			<Spacer/>
			
			<Input id="albumimage" type='text' required={ false } title="musicDetails albumimage" placeholder="musicDetails albumimage" inputChange={handleInputChange} value={ inputs["albumimage"].value } />
			<Spacer/>
			
			<Input id="trackimage" type='text' required={ false } title="musicDetails trackimage" placeholder="musicDetails trackimage" inputChange={handleInputChange} value={ inputs["trackimage"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["albumname","trackname"]}/>
			<Spacer/>
			
		</div>
	);
}
