import React from 'react';
import './index.scss';

export default () => {

	const onSelect = () => {
		console.log(document.getSelection())
		const res = document.execCommand('insertHTML', false, '<span>血生化</span>');
		console.log(res)
	}

	return (
		<div className="test-container">
			<div className="tag-box">
				<div onClick={onSelect}>血常规</div>
				<div onClick={onSelect}>血生化</div>
				<div onClick={onSelect}>CTCTCTCT</div>
			</div>
			<div className="editor" contentEditable="true">
				
			</div>
		</div>
	)
}