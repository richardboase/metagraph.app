import { useState } from 'react';
import { useUserContext } from '@/context/user';
import { useLocalContext } from '@/context/local';

import { GoBack } from '@/features/interfaces';
import Loading from '@/app/loading';

import { AdopterInitUpload} from './_fetch'

export function InitUploadAdopter(props) {

	const [userdata, _] = useUserContext();
	const [localdata, setLocaldata] = useLocalContext()
	const [file, setFile] = useState();

	const [ loading, setLoading ] = useState()
	const [ element ] = useState(localdata.tab.context.object)

	function handleChangeFile(event) {
		setFile(event.target.files[0])
	}

	function handleSubmitFile(event) {
		event.preventDefault()

		const fileInput = document.getElementById('fileInput');
		const files = fileInput.files;

		if (files.length === 0) {
			console.error('No files selected.');
			return;
		}

		const formData = new FormData();

		for (let i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
			formData.append('fileNames', files[i].name);
		}

		setLoading(true)

		AdopterInitUpload(userdata, element.Meta.ID, formData)
		.then((response) => {
			console.log(response.data);
			if (props.done) {
				props.done()
				console.log("IMAGE CALLBACK")
			}
			setLoading(false)
			setLocaldata(GoBack(localdata))
		})
		.catch(function (e) {
			console.error(e)
			setLoading(false)
		});

	}

	return (
		<div className="flex flex-col" style={ {padding:"30px 60px 30px 60px"} }>
			    {
					loading && <Loading/>
				}
				{
					!loading && <>
						<div className='my-3 font-medium'>File Upload</div>
						<div className='flex flex-col'>
							<input id="fileInput" type="file" onChange={handleChangeFile} multiple/>
							<div>
								<button onClick={handleSubmitFile} className="my-5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
									Upload
								</button>
							</div>
						</div>
					</>
				}
		</div>
	)
}