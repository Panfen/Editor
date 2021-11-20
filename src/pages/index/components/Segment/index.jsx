import React from 'react';;

export default ({ data }) => {
	const { id, text, style } = data;
	return (
		<span className="segment" id={id} style={style}>{text}</span>
	)
}