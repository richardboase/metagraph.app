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

export function AnimalForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="name" type='string' required={ true } title="animal name" placeholder="animal name" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="species" type='string' required={ true } title="animal species" placeholder="animal species" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="age" type='number' required={ true } title="animal age" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="birthday" type='date' required={ true } title="animal birthday" placeholder="animal birthday" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="building number" type='number' required={ true } title="animal building number" inputChange={handleInputChange} value={ inputs["BUILDINGNUMBER"].value } /><Input id="apartment number" type='number' required={ false } title="animal apartment number" inputChange={handleInputChange} value={ inputs["APARTMENTNUMBER"].value } /><Input id="street" type='string' required={ true } title="animal street" placeholder="animal street" inputChange={handleInputChange} value={ inputs["STREET"].value } /><Input id="town or city" type='string' required={ true } title="animal town or city" placeholder="animal town or city" inputChange={handleInputChange} value={ inputs["TOWNORCITY"].value } /><Input id="country" type='string' required={ true } title="animal country" placeholder="animal country" inputChange={handleInputChange} value={ inputs["COUNTRY"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["name","species","age","birthday","address"]}/>
			<Spacer/>
			
		</div>
	);
}
