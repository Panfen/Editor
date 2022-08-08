import React, { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import { initDocData, checkList } from './constants'; 
import './index.scss';

export default () => {

	const [docData, setDocData] = useState({ ...initDocData });
	const [docHtml, setDocHtml] = useState('');
	const [parentNode, setParentNode] = useState();
	const [currentSegId, setCurrentSegId] = useState(); // 记录当前信息
	const [isTypeChinese, setIsTypeChinese] = useState(false); // 是否是中文输入
	const editorRef = useRef();

	useEffect(() => {
		renderDoc();
	}, [docData]);

	const onSelect = (check) => {
		const segId = new Date().getTime() + '';
		const newSeg = {
			id: segId,
			className: 'tag',
			type: 'segment',
			element: 'span',
			content: `#${check.name}`
		};
		const index = docData.nodes[0].nodes.findIndex(seg => seg.id === currentSegId);
		docData.nodes[0].nodes.splice(index + 1, 0, newSeg);
		if (docData.nodes[0].nodes[index].content) {
			docData.nodes[0].nodes[index].content += ';'
		}
		setDocData({ ...docData });
		setCurrentSegId(segId);

		setFocus(segId);
	}

	const onBlur = (e) => {
		// console.log('onBlur')
	}

	const onClick = () => {
		const sel = window.getSelection();
		console.log(sel)
		// 记录片段的id
		setCurrentSegId(sel.anchorNode.parentNode.id || 'ORIGINAL_SEGMENT');
	}

	/**
	 * 输入事件处理
	 */ 
	const onKeyDown = (e) => {
		// 必须加上
		e.preventDefault(); 
		console.log(e.key)
		switch(e.key) {
			case 'Meta':
				break;
			case 'Backspace':
				deleteText();
				break;
			default:
				insertText(e.key);
				break;
		}
	}

	/**
	 * 插入文字
	 */ 
	const insertText = (text) => {
		const sel = window.getSelection();
		if (!sel) {
			return;
		}
		const range = sel.getRangeAt(0);
		const startContainer = range.startContainer;
		const startOffset = range.startOffset;

		if (!isTypeChinese) {

		}
		docData.nodes.forEach(paragraph => {
			paragraph.nodes.forEach(segment => {
				if (segment.id === currentSegId) {
					segment.content = segment.content.substr(0, startOffset) + text + segment.content.substr(startOffset);
				}
			})
		});

		setDocData({ ...docData });

		setTimeout(() => {
			const newNode = document.getElementById(currentSegId);
			const sel = window.getSelection();
			sel.removeAllRanges();
			var range = document.createRange();
			// 设置选中节点的当前range
			range.setStart(newNode.firstChild, 0);
			range.setEnd(newNode.firstChild, startOffset + text.length)
			sel.addRange(range);
			// 光标移到节点之后
			sel.collapseToEnd();
		});
	}

	const setFocus = (segId) => {
		setTimeout(() => {
			const newNode = document.getElementById(segId);
			const sel = window.getSelection();
			sel.removeAllRanges();
			var range = document.createRange();
			// 设置选中节点的当前range
			range.selectNode(newNode);
			sel.addRange(range);
			// 光标移到节点之后
			sel.collapseToEnd();
		});
	}

	/**
	 *
	 */ 
	const deleteText = () => {
		const index = docData.nodes[0].nodes.findIndex(seg => seg.id === currentSegId);
		const content = docData.nodes[0].nodes[index].content;
		docData.nodes[0].nodes[index].content = content.substr(0, content.length - 1);
		setDocData({ ...docData });
		setFocus(currentSegId);
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
		setIsTypeChinese(false);
	}

	/**
	 * 返回数据对应的html
	 */ 
	const renderDoc = () => {
		let html = '';
		docData.nodes.forEach(paragraph => {
			html += `<div id="${paragraph.id}" style="${paragraph.style}" >`;
			paragraph.nodes.forEach(segment => {
				html += `<span class="${segment.className}" id="${segment.id}" style="${segment.style}">${segment.content}</span>`
			});
			html += '</div>';
		});
		return html
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
				onKeyDown={onKeyDown}
				onClick={onClick}
				onBlur={onBlur}
				onCompositionStart={onCompositionStart}
				onCompositionEnd={onCompositionEnd}
				dangerouslySetInnerHTML={{ __html: renderDoc() }}
			/>

		</div>
	)
}