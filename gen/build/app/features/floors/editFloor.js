import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';

import { GoBack } from '@/features/interfaces';

import { FloorObjectGET, FloorUpdatePOST } from './_fetch';

import { FloorEdit } from './forms/floorEdit';

export function EditFloor(props) {

	const [userdata, _] = useUserContext()
	const [localdata, setLocaldata] = useLocalContext()

    // make sure the object is current
    const [subject, setSubject] = useState(localdata.tab.context.object)
    useEffect(() => {
        FloorObjectGET(userdata, subject?.Meta.ID)
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
		FloorUpdatePOST(
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
		<>
		{
			subject && <FloorEdit subject={subject} submit={submitEdit}/>
		}
		</>
  	);
}
