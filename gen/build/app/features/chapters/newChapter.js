import { useState } from 'react';
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';

import { GoBack } from '@/features/interfaces';

import { ChaptersInitPOST } from './_fetch';

import { ChapterForm } from './forms/chapter';
import { titlecase } from './_interfaces';

export function NewChapter(props) {

  const [userdata, _] = useUserContext()
  const [localdata, setLocaldata] = useLocalContext()

  const [subject] = useState(localdata.tab.context.object)

	function submitNew(inputs) {
		ChaptersInitPOST(
			userdata,
			subject?.Meta.ID,
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
			<ChapterForm submit={submitNew}/>
		</div>
	);
}
