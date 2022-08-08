import React, { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import './index.scss';

const checkList = [
	{
		id: '1',
		name: '血常规'
	},
	{
		id: '2',
		name: '血生化'
	},
	{
		id: '3',
		name: '肝功能'
	},
	{
		id: '4',
		name: '肾功能'
	},
	{
		id: '5',
		name: '电解质'
	}
]

let id = 0

export default () => {

	const [html, setHtml] = useState(''); // html数据
	const [tempHtml, setTempHtml]= useState('')
	const [previousInfo, setPreviousInfo] = useState({}); // 光标位置
	const [parentNode, setParentNode] = useState();
	const [isTypeChinese, setIsTypeChinese] = useState(false);
	const editorRef = useRef();

	useEffect(() => {
		renderHtml(tempHtml)
	}, [tempHtml]);

	const renderHtml = (html) => {
		if (!html) {
			return;
		}
		console.log('html：', html)
		// editorRef.current.innerHTML = `<span id=${++id}>${html}</span>`;
	}

	const onSelect = (check) => {
		editorRef.current.focus();

		if (parentNode?.className === 'tag') {
			message.error('此处无法插入引用');
			return;
		}

		const { offset, previousSibling } = previousInfo

		let position = offset || 0;
		let find = false;
		if (previousSibling) {
			editorRef.current.childNodes.forEach(node => {
				if (!find) {
					if (node.id !== previousSibling.id) {
						position += node.nodeName === 'SPAN' ? 44 + node.textContent.length : node.textContent.length
						console.log('position1', position)
					} else {
						position += node.nodeName === 'SPAN' ? 44 + node.textContent.length : node.textContent.length
						find = true
						console.log('position2', position)
					}
				}
			})
		}
		const nodeId = new Date().getTime() + '';
		const newHtml = html.slice(0, position) + `<span id="${nodeId}" class="tag">#${check.name}</span>` + html.slice(position);

		editorRef.current.innerHTML = newHtml;
		setHtml(newHtml)
		setTimeout(() => {
			const newNode = document.getElementById(nodeId);
			const sel = window.getSelection();
			sel.removeAllRanges();
			var range = document.createRange();
			// 设置选中节点的当前range
			range.selectNode(newNode);
			sel.addRange(range);
			// 光标移到节点之后
			sel.collapseToEnd();
		}, 100);
	}

	const onBlur = (e) => {
		console.log('onBlur')
		const { anchorNode, anchorOffset } = getSelection();
		setPreviousInfo({
			previousSibling: anchorNode?.previousSibling,
			offset: anchorOffset,
		});
	}

	const onClick = () => {
		const sel = window.getSelection();
		console.log(sel)
		if (sel.anchorNode.parentNode.className === 'tag') {
			message.warning('请不要在引用标签内部输入')
		}
	}

	const onInput = (e) => {
		console.log(isTypeChinese)
		console.log(editorRef.current.textContent); // 获取纯文本
		setHtml(editorRef.current.innerHTML);
	}

	/**
	 * 中文输入开始事件（先于onInput执行）
	 */ 
	const onCompositionStart = () => {
		setIsTypeChinese(true);
	}

	/**
	 * 中文输入结束事件
	 */ 
	const onCompositionEnd = () => {
		setIsTypeChinese(false)
	}


	return (
		<div className="test-container">

			<div className="tag-box">
				{checkList.map(check => <div key={check.id} onClick={() => onSelect(check)}>{check.name}</div>)}
			</div>

			<div 
				ref={editorRef} 
				className="editor" 
				contentEditable="true" 
				onInput={onInput}
				onClick={onClick}
				onBlur={onBlur}
				onCompositionStart={onCompositionStart}
				onCompositionEnd={onCompositionEnd}
			/>

		</div>
	)
}