import * as React from 'react'
import { useState, useEffect } from 'react';

import { titlecase } from '../_interfaces';

export function TokenMatrixRow(props) {

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
				<input id="tokentype" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["tokentype"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="supply" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["supply"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="hasdividend" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["hasdividend"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="website" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["website"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="twitter" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["twitter"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="telegram" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["telegram"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="liquidityaddress" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["liquidityaddress"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="burnamount" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["burnamount"] }/>
			</div>
		</td><td className='text-sm' style={cellStyle}>
			<div className='flex flex-row w-full ' >
				<input id="mintlocation" onFocus={cellEdit} onBlur={cellSave} className="w-full px-2" type="text" defaultValue={ props.row.fields["mintlocation"] }/>
			</div>
		</td>
	</tr>
	)

}