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


export function TokenEdit(props) {

	console.log("COLLECTION EDIT", props)

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()
	const [subject] = useState(localdata.tab.context.object)

	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	const [inputs, setInputs] = useState({
		
		"tokentype": {
			id: "tokentype",
			type: "string",
			
			value: subject.fields.tokentype,
			
			required: true,
		},
		
		"supply": {
			id: "supply",
			type: "int",
			
			value: subject.fields.supply,
			
			required: true,
		},
		
		"hasdividend": {
			id: "hasdividend",
			type: "string",
			
			value: subject.fields.hasdividend,
			
			required: true,
		},
		
		"website": {
			id: "website",
			type: "string",
			
			value: subject.fields.website,
			
			required: false,
		},
		
		"twitter": {
			id: "twitter",
			type: "string",
			
			value: subject.fields.twitter,
			
			required: false,
		},
		
		"telegram": {
			id: "telegram",
			type: "string",
			
			value: subject.fields.telegram,
			
			required: false,
		},
		
		"liquidityaddress": {
			id: "liquidityaddress",
			type: "string",
			
			value: subject.fields.liquidityaddress,
			
			required: false,
		},
		
		"burnamount": {
			id: "burnamount",
			type: "float64",
			
			value: subject.fields.burnamount,
			
			required: false,
		},
		
		"mintlocation": {
			id: "mintlocation",
			type: "string",
			
			value: subject.fields.mintlocation,
			
			required: true,
		},
		
	})
	function handleInputChange(obj) {
		InputChange(inputs, setInputs, obj)
	}

	return (
		<div className='flex flex-col'>
			
			<Input id="tokentype" type='text' required={ true } title="token tokentype" placeholder="token tokentype" inputChange={handleInputChange} value={ inputs["tokentype"].value } />
			<Spacer/>
			
			<Input id="supply" type='number' required={ true } title="token supply" inputChange={handleInputChange} value={ inputs["supply"].value } />
			<Spacer/>
			
			<Input id="hasdividend" type='text' required={ true } title="token hasdividend" placeholder="token hasdividend" inputChange={handleInputChange} value={ inputs["hasdividend"].value } />
			<Spacer/>
			
			<Input id="website" type='text' required={ false } title="token website" placeholder="token website" inputChange={handleInputChange} value={ inputs["website"].value } />
			<Spacer/>
			
			<Input id="twitter" type='text' required={ false } title="token twitter" placeholder="token twitter" inputChange={handleInputChange} value={ inputs["twitter"].value } />
			<Spacer/>
			
			<Input id="telegram" type='text' required={ false } title="token telegram" placeholder="token telegram" inputChange={handleInputChange} value={ inputs["telegram"].value } />
			<Spacer/>
			
			<Input id="liquidityaddress" type='text' required={ false } title="token liquidityaddress" placeholder="token liquidityaddress" inputChange={handleInputChange} value={ inputs["liquidityaddress"].value } />
			<Spacer/>
			
			<Input id="burnamount" type='number' required={ false } title="token burnamount" inputChange={handleInputChange} value={ inputs["burnamount"].value } />
			<Spacer/>
			
			<Input id="mintlocation" type='text' required={ true } title="token mintlocation" placeholder="token mintlocation" inputChange={handleInputChange} value={ inputs["mintlocation"].value } />
			<Spacer/>
			
			<Submit text="Save" inputs={inputs} submit={props.submit} assert={["tokentype","supply","hasdividend","mintlocation"]}/>
			<Spacer/>
			
		</div>
	);
}
