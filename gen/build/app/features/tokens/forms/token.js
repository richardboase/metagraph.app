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

export function TokenForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="tokentype" type='text' required={ true } title="token tokentype" placeholder="token tokentype" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="supply" type='number' required={ true } title="token supply" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="hasdividend" type='text' required={ true } title="token hasdividend" placeholder="token hasdividend" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="website" type='text' required={ false } title="token website" placeholder="token website" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="twitter" type='text' required={ false } title="token twitter" placeholder="token twitter" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="telegram" type='text' required={ false } title="token telegram" placeholder="token telegram" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="liquidityaddress" type='text' required={ false } title="token liquidityaddress" placeholder="token liquidityaddress" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="burnamount" type='number' required={ false } title="token burnamount" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="mintlocation" type='text' required={ true } title="token mintlocation" placeholder="token mintlocation" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["tokentype","supply","hasdividend","mintlocation"]}/>
			<Spacer/>
			
		</div>
	);
}
