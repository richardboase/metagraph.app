import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';

import Spacer from '@/inputs/spacer';
import Select from '@/inputs/select';
import Submit from '@/inputs/submit';
import Input from '@/inputs/input';
import InputChange from '@/inputs/inputChange';

export function BuildingEdit(props) {

	console.log("COLLECTION EDIT", props)

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	const [inputs, setInputs] = useState({
		"xunits": {
			id: "xunits",
			type: "float64",
			value: subject.fields.xunits,
			required: true,
		},"yunits": {
			id: "yunits",
			type: "float64",
			value: subject.fields.yunits,
			required: true,
		},"doors": {
			id: "doors",
			type: "int",
			value: subject.fields.doors,
			required: true,
		},
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="xunits" type='number' required={ true } title="building xunits" placeholder="building xunits" inputChange={handleInputChange} value={ inputs["xunits"].value } />
			<Spacer/>
			
			<Input id="yunits" type='number' required={ true } title="building yunits" placeholder="building yunits" inputChange={handleInputChange} value={ inputs["yunits"].value } />
			<Spacer/>
			
			<Input id="doors" type='number' required={ true } title="building doors" placeholder="building doors" inputChange={handleInputChange} value={ inputs["doors"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["xunits","yunits","doors"]}/>
			<Spacer/>
			
		</div>
	);
}
