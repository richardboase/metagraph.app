import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';

import { GoBack } from '@/features/interfaces';

import { HealthcheckupObjectGET, HealthcheckupUpdatePOST } from './_fetch';

import { HealthcheckupEdit } from './forms/healthcheckupEdit';

export function EditHealthcheckup(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()

	// make sure the object is current
	const [subject, setSubject] = useState(localdata.tab.context.object)
	useEffect(() => {
		HealthcheckupObjectGET(userdata, subject?.Meta.ID)
		.then((res) => res.json())
		.then((data) => {
			console.log("UPDATED OBJECT",data)
			setSubject(data)
		})
		.catch((e) => {
			console.log(e)
			setLocaldata(GoBack(localdata))
		})
	}, [])

	function submitEdit(inputs) {
		HealthcheckupUpdatePOST(
			userdata,
			subject.Meta.ID,
			inputs
		)
		.then((res) => console.log(res))
		.then(function () {
			// return to previous interface
			setLocaldata(GoBack(localdata))
		})
		.catch(function (e) {
			console.error("FAILED TO SEND", e)
		})
	}

	return (
		<div style={ {padding:"30px 60px 30px 60px"} }>
		{
			subject && <HealthcheckupEdit subject={subject} submit={submitEdit}/>
		}
		</div>
  	);
}
