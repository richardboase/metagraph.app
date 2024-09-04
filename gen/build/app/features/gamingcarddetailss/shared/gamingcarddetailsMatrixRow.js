import * as React from 'react'
import { useState, useEffect } from 'react';

import { titlecase } from '../_interfaces';

export function GamingcarddetailsMatrixRow(props) {

	const [ row, setRow ] = useState(props.row)

	function cellEdit(e) {
		const id = e.target.id
		row.edit = id
		console.log("edit cell:", id)
		setRow(row)
	}

	function cellSave(e) {
		const id = e.target.id
		console.log("saving cell:", id)
		row.edit = null
		setRow(row)
		props.save(props.id, id, e.target.value)
	}

	const cellStyle = {
		border: "1px solid"
	}

	return (
	<tr>
		<td className='flex flex-row justify-center text-sm max-w-8' style={cellStyle}>
			<div className='font-bold'>{props.id}</div>
		</td>
		<td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="gametitle" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["gametitle"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="cardtype" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["cardtype"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="cardrarity" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["cardrarity"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="cardimageurl" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["cardimageurl"] }/>
			</div>
		</td>
	</tr>
	)

}