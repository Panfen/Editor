import React from 'react';
import Segment from '../Segment';

export default ({ data }) => {
	const { id, style, segments } = data;
	return (
		<div id={id} style={style}>
			{segments.map(segment => <Segment data={segment} />)}
		</div>
	)
}