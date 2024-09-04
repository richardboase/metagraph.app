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


export function GamingcarddetailsEdit(props) {

	console.log("COLLECTION EDIT", props)

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	const [inputs, setInputs] = useState({
		
		"gametitle": {
			id: "gametitle",
			type: "string",
			
			value: subject.fields.gametitle,
			
			required: true,
		},
		
		"cardtype": {
			id: "cardtype",
			type: "string",
			
			value: subject.fields.cardtype,
			
			required: true,
		},
		
		"cardrarity": {
			id: "cardrarity",
			type: "string",
			
			value: subject.fields.cardrarity,
			
			required: true,
		},
		
		"cardimageurl": {
			id: "cardimageurl",
			type: "string",
			
			value: subject.fields.cardimageurl,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="gametitle" type='text' required={ true } title="gamingCardDetails gametitle" placeholder="gamingCardDetails gametitle" inputChange={handleInputChange} value={ inputs["gametitle"].value } />
			<Spacer/>
			
			<Input id="cardtype" type='text' required={ true } title="gamingCardDetails cardtype" placeholder="gamingCardDetails cardtype" inputChange={handleInputChange} value={ inputs["cardtype"].value } />
			<Spacer/>
			
			<Input id="cardrarity" type='text' required={ true } title="gamingCardDetails cardrarity" placeholder="gamingCardDetails cardrarity" inputChange={handleInputChange} value={ inputs["cardrarity"].value } />
			<Spacer/>
			
			<Input id="cardimageurl" type='text' required={ true } title="gamingCardDetails cardimageurl" placeholder="gamingCardDetails cardimageurl" inputChange={handleInputChange} value={ inputs["cardimageurl"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["gametitle","cardtype","cardrarity","cardimageurl"]}/>
			<Spacer/>
			
		</div>
	);
}
