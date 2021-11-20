import React from 'react';
import DocumentModal from '../../model/Document';
import Document from '../Document';

export default ({ data }) => {

	return (
		<div id="editbox" contentEditable="true">
			<Document data={data} />
		</div>
	)

}