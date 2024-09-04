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

export function GamingcarddetailsForm(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	const [inputs, setInputs] = useState({})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="gametitle" type='text' required={ true } title="gamingCardDetails gametitle" placeholder="gamingCardDetails gametitle" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="cardtype" type='text' required={ true } title="gamingCardDetails cardtype" placeholder="gamingCardDetails cardtype" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="cardrarity" type='text' required={ true } title="gamingCardDetails cardrarity" placeholder="gamingCardDetails cardrarity" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Input id="cardimageurl" type='text' required={ true } title="gamingCardDetails cardimageurl" placeholder="gamingCardDetails cardimageurl" inputChange={handleInputChange}/>
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["gametitle","cardtype","cardrarity","cardimageurl"]}/>
			<Spacer/>
			
		</div>
	);
}
