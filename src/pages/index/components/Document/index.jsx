import React from 'react';
import Paragraph from '../Paragraph';

export default ({ data }) => {
	const { id, nodes } = data;
	return (
		<div id={id}>
			{nodes.map(paragraph => <Paragraph data={paragraph} />)}
		</div>
	)
}