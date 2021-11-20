import React from 'react';;

export default ({ data }) => {
	const { id, text, style } = data;
	return (
		<span id={id} style={style}>{text}</span>
	)
}