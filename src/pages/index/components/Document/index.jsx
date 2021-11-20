import React from 'react';
import Paragraph from '../Paragraph';

export default ({ data }) => {
	const { id, nodes } = data;
	return (
		<div className="document" id={id}>
			{nodes.map(paragraph => <Paragraph key={paragraph.id} data={paragraph} />)}
		</div>
	)
}