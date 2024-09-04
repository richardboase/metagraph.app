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

export function MusicdetailsForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="albumname" type='text' required={ true } title="musicDetails albumname" placeholder="musicDetails albumname" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="trackname" type='text' required={ true } title="musicDetails trackname" placeholder="musicDetails trackname" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="albumimage" type='text' required={ false } title="musicDetails albumimage" placeholder="musicDetails albumimage" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="trackimage" type='text' required={ false } title="musicDetails trackimage" placeholder="musicDetails trackimage" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["albumname","trackname"]}/>
			<Spacer/>
			
		</div>
	);
}
