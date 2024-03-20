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
import Color from '@/inputs/color';

import { GamesChatGPTPOST, GamesChatGPTCollectionPOST } from '../_fetch'

export function AI(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()

	console.log("AI SUBJECT", props.subject)

	const [toggle, setToggle] = useState(false)

	function toggleState() {
		setToggle(!toggle)
	}

	const [select, setSelect] = useState('prompt')
	function updateSelect(e) {
		setSelect(e.target.id)
	}

	function sendPrompt() {
		props.updateList(false)
		const payload = {
			"prompt": document.getElementById("textinput").value,
		}
		switch (select) {
		case "prompt":
			GamesChatGPTPOST(userdata, props.subject.Meta.ID, "create", payload)
			.then((res) => {
				console.log(res)
				props.updateList(true)
			}) 
			.catch((e) => {
				console.error(e)
				props.updateList(true)
			})
			break
		case "create":
			GamesChatGPTPOST(userdata, props.subject.Meta.ID, "create", payload)
			.then((res) => {
				console.log(res)
				props.updateList(true)
			}) 
			.catch((e) => {
				console.error(e)
				props.updateList(true)
			})
			break
		case "modify":
			GamesChatGPTCollectionPOST(userdata, props.subject.Meta.ID, props.collection, payload)
			.then((res) => {
				console.log(res)
				props.updateList(true)
			}) 
			.catch((e) => {
				console.error(e)
				props.updateList(true)
			})
			break
		}
	}

	const buttonStyle = {
		borderRadius: "12px",
		backgroundColor: "rgb(96, 165, 250)",
		border: "solid 0px",
		color: "white",
		padding: "6px 10px"
	}

	const buttonStyleSelected = {
		borderRadius: "12px",
		backgroundColor: "white",
		border: "solid 0px rgb(96, 165, 250)",
		color: "rgb(96, 165, 250)",
		padding: "6px 10px"
	}

	return (
		<div className='flex flex-col'>
			{
				!toggle && <div className="flex flex-col justify-center rounded-l-lg bg-gray-400" onClick={toggleState}>
					<div>
						<button style={buttonStyle} className='flex flex-row items-center'>
							<div id="home" className="flex flex-col justify-center items-center cursor-pointer" style={ {width:"36px",height:"36px"} }>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" style={ {pointerEvents:"none"} }>
								<path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
								</svg>
							</div>
							<div>AI Assistant</div>
						</button>
					</div>
				</div>
			}
			{
				toggle && <>
					<div className='flex flex-row justify-between items-center py-2'>
						<div className='flex flex-row items-center'>
							{
								(select == "prompt") && <button id="prompt" onClick={updateSelect} style={buttonStyleSelected}>Prompt</button>
							}
							{
								(select != "prompt") && <button id="prompt" onClick={updateSelect} style={buttonStyle}>Prompt</button>
							}
							<div className='p-2'></div>
							{
								(select == "create") && <button id="create"  onClick={updateSelect} style={buttonStyleSelected}>Create</button>
							}
							{
								(select != "create") && <button id="create"  onClick={updateSelect} style={buttonStyle}>Create</button>
							}
							<div className='p-2'></div>
							{
								(select == "modify") && <button id="modify" onClick={updateSelect} style={buttonStyleSelected}>Modify</button>
							}
							{
								(select != "modify") && <button id="modify" onClick={updateSelect} style={buttonStyle}>Modify</button>
							}
						</div>
						<div>
							<button onClick={sendPrompt} style={buttonStyle}>Send</button>
						</div>
					</div>
					<textarea id='textinput' placeholder={"your "+select+" prompt..."} className='border p-2'></textarea>
				</>
			}
		</div>
	);
}
