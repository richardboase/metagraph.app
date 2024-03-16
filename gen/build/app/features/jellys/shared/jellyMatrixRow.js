import * as React from 'react'
import { useState, useEffect } from 'react';

import { titlecase } from '../_interfaces';

export function JellyMatrixRow(props) {

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
				<input id="name" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["name"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="gender" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["gender"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="element" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["element"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="hp" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["hp"] }/>
			</div>
		</td>
	</tr>
	)

}