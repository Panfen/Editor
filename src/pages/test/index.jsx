import React, { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import './index.scss';

const checkList = [
	{
		key: '1',
		name: '血常规'
	},
	{
		key: '2',
		name: '血生化'
	},
	{
		key: '3',
		name: '肝功能'
	},
	{
		key: '4',
		name: '肾功能'
	},
	{
		key: '5',
		name: '电解质'
	}
]

let id = 0

export default (props) => {

	const [html, setHtml] = useState('')
	const [tempHtml, setTempHtml]= useState('')
	const [previousInfo, setPreviousInfo] = useState({}); // 光标位置
	const [parentNode, setParentNode] = useState();
	const [isTypeChinese, setIsTypeChinese] = useState(false);
	const editorRef = useRef();

	useEffect(() => {
		initData();
	}, []);

	const initData = () => {
		setHtml(`<div><span id="INITTIAL_ID"></span></div>`)
	}

	const onSelect = (check) => {
		editorRef.current.focus();

		const { offset = 0, id = 'INITTIAL_ID' } = previousInfo;
		const targetNode = document.getElementById(id);
		const content = targetNode.textContent;
		// 前部分文字处理
		targetNode.textContent = content.substr(0, offset);
		// 插入引用项
		const tagNode = createNode(check.key, 'tag', '#' + check.name);
		targetNode.parentNode.insertBefore(tagNode, targetNode.nextSibling);

		if (offset < content.length) {
			// 后部分文字处理
			const textNode = createNode('', '', content.substr(offset));
			targetNode.parentNode.insertBefore(textNode, tagNode.nextSibling);
		}
		
		const sel = window.getSelection();
		var range = document.createRange();
		// 设置选中节点的当前range
		range.selectNode(tagNode);
		sel.removeAllRanges();
		sel.addRange(range);
		// 光标移到节点之后
		sel.collapseToEnd();
	}

	const onBlur = (e) => {
		const sel = window.getSelection();
		const { anchorNode, anchorOffset } = sel;
		setPreviousInfo({
			id: anchorNode?.parentElement?.id,
			offset: anchorOffset,
		});
	}

	const onClick = () => {
		const sel = window.getSelection();
		if (sel.anchorNode.parentNode.className === 'tag') {
			message.warning('请不要在引用标签内部输入')
		}
	}

	/**
	 * 创建span节点
	 */ 
	const createNode = (id = '', className = '', text = '') => {
		const newId = generateId(id);
		const node = document.createElement('span');
		node.setAttribute('id', newId);
		node.setAttribute('class', className);
		node.textContent = text;
		return node;
	}

	const generateId = (id = '') => {
		return id + '-' + new Date().getTime();
	}

	/**
	 * 光标移动至某个节点后
	 */ 
	const collapseNode = (id) => {
		setTimeout(() => {
			const sel = window.getSelection();
			var range = document.createRange();
			// 设置选中节点的当前range
			range.selectNode(document.getElementById(id));
			sel.removeAllRanges();
			sel.addRange(range);
			// 光标移到节点之后
			sel.collapseToEnd();
		});
	}

	const onInput = (e) => {
		// console.log(isTypeChinese)
		if (editorRef.current.childNodes[0].nodeType === 3) {
			const id = generateId()
			setHtml(`<div><span id="${id}">${editorRef.current.textContent}</span></div>`);
			collapseNode(id);
		}

		
		editorRef.current.childNodes.forEach((_node) => {
			if (_node.nodeName === 'DIV') {
				// 换行后为span添加id
				_node.childNodes.forEach(childNode => {
					if (!childNode?.getAttribute('id')) {
						childNode.setAttribute('id', generateId());
					}
				});
				// 换行后在上一行末尾添加分号
				if (_node.previousSibling) {
					const content = _node.previousSibling.lastChild.textContent;
					if (!content.endsWith('；')) {
						const textNode = createNode('', '', '；');
						_node.previousSibling.appendChild(textNode);
					}
				}
			}

			// 处理引用项后输入和删除引用项
			_node.childNodes.forEach((node) => {
				const check = checkList.find(item => item.key === node.id?.split('-')[0]);
				if (node.className === 'tag') {
					if (node.textContent.length > check.name.length + 1) {
						// 新文本节点的内容
						const textNodeCont = node.textContent.substr(check.name.length + 1);
						// 引用项内容重置
						node.textContent = `#${check.name}`;
						// 添加文本节点
						const textNode = createNode('', '', textNodeCont)
						_node.insertBefore(textNode, node.nextSibling);

						const sel = window.getSelection();
						var range = document.createRange();
						// 设置选中节点的当前range
						range.selectNode(textNode);
						sel.removeAllRanges();
						sel.addRange(range);
						// 光标移到节点之后
						sel.collapseToEnd();
					} else if (node.textContent.length < check.name.length + 1) {
						_node.removeChild(node);
					}
				}
			})
		});
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
				{checkList.map(check => <div key={check.key} onClick={() => onSelect(check)}>{check.name}</div>)}
			</div>

			<div 
				ref={editorRef} 
				className="editor" 
				contentEditable="true" 
				onInput={onInput}
				onClick={onClick}
				onBlur={onBlur}
				dangerouslySetInnerHTML={{ __html: html }}
				onCompositionStart={onCompositionStart}
				onCompositionEnd={onCompositionEnd}
			/>

		</div>
	)
}