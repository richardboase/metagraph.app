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


export function PicturedetailsEdit(props) {

	console.log("COLLECTION EDIT", props)

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	const [inputs, setInputs] = useState({
		
		"seriesname": {
			id: "seriesname",
			type: "string",
			
			value: subject.fields.seriesname,
			
			required: true,
		},
		
		"imagetitle": {
			id: "imagetitle",
			type: "string",
			
			value: subject.fields.imagetitle,
			
			required: true,
		},
		
		"pictureurl": {
			id: "pictureurl",
			type: "string",
			
			value: subject.fields.pictureurl,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="seriesname" type='text' required={ true } title="pictureDetails seriesname" placeholder="pictureDetails seriesname" inputChange={handleInputChange} value={ inputs["seriesname"].value } />
			<Spacer/>
			
			<Input id="imagetitle" type='text' required={ true } title="pictureDetails imagetitle" placeholder="pictureDetails imagetitle" inputChange={handleInputChange} value={ inputs["imagetitle"].value } />
			<Spacer/>
			
			<Input id="pictureurl" type='text' required={ true } title="pictureDetails pictureurl" placeholder="pictureDetails pictureurl" inputChange={handleInputChange} value={ inputs["pictureurl"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["seriesname","imagetitle","pictureurl"]}/>
			<Spacer/>
			
		</div>
	);
}
