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

export function BuildingForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="xunits" type='number' required={ true } title="building xunits" placeholder="building xunits" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="yunits" type='number' required={ true } title="building yunits" placeholder="building yunits" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="doors" type='number' required={ true } title="building doors" placeholder="building doors" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["xunits","yunits","doors"]}/>
			<Spacer/>
			
		</div>
	);
}
