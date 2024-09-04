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

export function PicturedetailsForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="seriesname" type='text' required={ true } title="pictureDetails seriesname" placeholder="pictureDetails seriesname" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="imagetitle" type='text' required={ true } title="pictureDetails imagetitle" placeholder="pictureDetails imagetitle" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="pictureurl" type='text' required={ true } title="pictureDetails pictureurl" placeholder="pictureDetails pictureurl" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["seriesname","imagetitle","pictureurl"]}/>
			<Spacer/>
			
		</div>
	);
}
