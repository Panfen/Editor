import React, { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import { initDocData, checkList } from './constants'; 
import './index.scss';

let isTypeChinese = false;

export default () => {

	const [docData, setDocData] = useState(JSON.parse(JSON.stringify(initDocData)));
	const [docHtml, setDocHtml] = useState('');
	const [curParId, setCurParId] = useState(); // 当前paragraphId
	const [curSegId, setCurSegId] = useState(); // 当前segmentId
	const [curParIndex, setCurParIndex] = useState(0);
	const [curSegIndex, setCurSegIndex] = useState(0);
	const editorRef = useRef();

	useEffect(() => {
		renderDoc();
	}, [docData]);

	useEffect(() => {
		if (curParId && curSegId) {
			const curParIndex = getIndex(docData, curParId);
			const curSegIndex = getIndex(docData.nodes[curParIndex], curSegId);
			setCurParIndex(curParIndex);
			setCurSegIndex(curSegIndex);
		}
	}, [curSegId, curParId])

	/**
	 * 插入一个tag
	 */ 
	const onSelect = (check) => {
		addSegment(curSegId, `#${check.name}`, 'tag')
	}

	/**
	 * 增加一个分片
	 */ 
	const addSegment = (previousSegId, text, className, showSemicolon = true) => {
		const segId = generateId();
		const newSeg = {
			id: segId,
			className: className,
			type: 'segment',
			element: 'span',
			content: text
		};
		const index = docData.nodes[curParIndex].nodes.findIndex(seg => seg.id === previousSegId);
		docData.nodes[curParIndex].nodes.splice(index + 1, 0, newSeg);
		if (showSemicolon && docData.nodes[curParIndex].nodes[index].content) {
			docData.nodes[curParIndex].nodes[index].content += ';'
		}
		setDocData({ ...docData });
		setCurSegId(segId);
		setFocus(segId);
	}

	const onBlur = (e) => {
		
	}

	/**
	 * 编辑器点击事件
	 */ 
	const onClick = () => {
		const sel = window.getSelection();
		console.log(sel)

		// 完全空白开始
		if (!docData.nodes.length) {
			createPraAndSeg();
			return
		}

		if (sel.anchorNode.id) {
			setCurParId(sel.anchorNode.id);
			setCurSegId(sel.anchorNode.firstChild.id)
		} else {
			setCurParId(sel.anchorNode.parentNode.parentNode.id);
			setCurSegId(sel.anchorNode.parentNode.id);
		}
	}

	/**
	 * 产生一个段落一个分片
	 */ 
	const createPraAndSeg = (text = '', offset) => {
		const parId = generateId();
		const segId = generateId();
		docData.nodes.splice(curParIndex + 1, 0, {
			id: parId,
			type: 'paragraph',
			element: 'div',
			style: '', // 内联样式
			nodes: [
				{
					id: segId,
					type: 'segment',
					element: 'span',
					style: '',
					className: '',
					content: text
				}
			]
		});
		setDocData({ ...docData });
		setCurParId(parId);
		setCurSegId(segId);
		setFocus(segId, offset);
	}

	/**
	 * 输入事件处理
	 */ 
	const onKeyDown = (e) => {
		console.log('onKeyDown')
		// 必须加上
		e.preventDefault();
		const text = e.key;
		switch(text) {
			case 'Meta':
			case 'Shift':
				break;
			case 'Backspace':
				deleteText();
				break;
			case 'Enter':
				breakParagraph();
				break;
			case 'ArrowLeft':
				moveFocus(-1);
				break;
			case 'ArrowRight':
				moveFocus(+1);
				break;
			case 'ArrowUp':
				break;
			case 'ArrowDown':
				break;
			default:
				setTimeout(() => {
					insertText(text);
				});
				break;
		}
	}

	/**
	 * 插入文字
	 */ 
	const insertText = (text) => {
		const sel = window.getSelection();
		if (!sel || isTypeChinese) {
			return;
		}
		// 在tag之后输入，需要新建segment
		if (sel.anchorNode.parentNode.className === 'tag') {
			addSegment(sel.anchorNode.parentNode.id, text, '', false);
		} else {
			const range = sel.getRangeAt(0);
			const startOffset = range.startOffset;

			if (!isTypeChinese) {

			}
			docData.nodes.forEach(paragraph => {
				paragraph.nodes.forEach(segment => {
					if (segment.id === curSegId) {
						segment.content = segment.content.substr(0, startOffset) + text + segment.content.substr(startOffset);
					}
				})
			});

			setDocData({ ...docData });
			setFocus(curSegId);
		}
	}

	/**
	 * 设置光标
	 */ 
	const setFocus = (segId, offset) => {
		setCurSegId(segId);
		setTimeout(() => {
			const newNode = document.getElementById(segId);
			const sel = window.getSelection();
			sel.removeAllRanges();
			var range = document.createRange();
			// 设置选中节点的当前range
			if (newNode.firstChild) {
				range.setStart(newNode.firstChild, 0);
				range.setEnd(newNode.firstChild, offset === undefined ? newNode.firstChild.length : offset);
			} else {
				range.selectNode(newNode);
			}
			sel.addRange(range);
			// 光标移到节点之后
			sel.collapseToEnd();
		});
	}

	/**
	 * 移动光标
	 */ 
	const moveFocus = (offset) => {
		const { anchorOffset } = window.getSelection();
		const contLen = docData.nodes[curParIndex].nodes[curSegIndex].content.length;
		const newOffset = anchorOffset + offset;
		// 右移超出边界
		if (newOffset > contLen) {
			// 如果有下一个节点，进入下一个节点
			if (curSegIndex < docData.nodes[curParIndex].nodes.length - 1) {
				setFocus(docData.nodes[curParIndex].nodes[curSegIndex + 1].id, 1);
			}
		} else if (newOffset < 0) { // 左移超出边界
			// 如果前面还有节点，进入前一个节点
			if (curSegIndex !== 0) {
				setFocus(docData.nodes[curParIndex].nodes[curSegIndex - 1].id, docData.nodes[curParIndex].nodes[curSegIndex - 1].content.length - 1);
			}
		} else {
			setFocus(curSegId, anchorOffset + offset);
		}
	}

	/**
	 * 删除文字
	 */ 
	const deleteText = () => {
		const { anchorNode, anchorOffset } = window.getSelection();
		const content = docData.nodes[curParIndex].nodes[curSegIndex].content;
		// 针对tag，采取整个删除
		if (anchorNode.parentNode.className === 'tag') {
			docData.nodes[curParIndex].nodes.splice(curSegIndex, 1);
			setDocData({ ...docData });
			setFocus(docData.nodes[curParIndex].nodes[curSegIndex - 1].id);
		} else {
			const newContent = content.substr(0, anchorOffset - 1) + content.substr(anchorOffset);
			docData.nodes[curParIndex].nodes[curSegIndex].content = newContent;
			// 删除为空
			if (newContent === '') {
				// 删除segment
				docData.nodes[curParIndex].nodes.splice(curSegIndex, 1);
				if (!docData.nodes[curParIndex].nodes.length) {
					// 删除paragraph
					if (curParIndex !== 0) {
						docData.nodes.splice(curParIndex, 1);
					} else {
						// 保留第一个paragraph，置空第一个segment
						docData.nodes[0].nodes[0] = {
							id: generateId(),
							type: 'segment',
							element: 'span',
							style: '',
							className: '',
							content: ''
						}
					}
				}
				setDocData({ ...docData });
				if (curSegIndex !== 0) {
					setFocus(docData.nodes[curParIndex].nodes[curSegIndex - 1].id);
				} else {
					if (curParIndex !== 0) {
						setCurParId(docData.nodes[curParIndex - 1].id);
						const len = docData.nodes[curParIndex - 1].nodes.length;
						setFocus(docData.nodes[curParIndex - 1].nodes[len - 1].id);
					} else {
						setFocus(docData.nodes[0].nodes[0].id);
					}
				}
			} else {
				setDocData({ ...docData });
				setFocus(curSegId, anchorOffset -1);
			}
		}
	}

	/**
	 * 回车换行
	 */ 
	const breakParagraph = () => {
		const { anchorOffset, isCollapsed } = window.getSelection();
		// 非光标收取，不执行
		if (!isCollapsed) {
			return;
		}
		const parIndex = getIndex(docData, curParId);
		const segIndex = getIndex(docData.nodes[parIndex], curSegId);
		const content = docData.nodes[parIndex].nodes[segIndex].content;
		docData.nodes[parIndex].nodes[segIndex].content = content.substr(0, anchorOffset);
		// 新建段落+分片
		createPraAndSeg(content.substr(anchorOffset), 0);
	}

	/**
	 * 中文输入开始事件（先于onInput执行）
	 */ 
	const onCompositionStart = () => {
		console.log('中文输入开始')
		isTypeChinese = true;
	}

	/**
	 * 中文输入结束事件
	 */ 
	const onCompositionEnd = (e) => {
		isTypeChinese = false;
		insertText(e.data)
	}

	/**
	 * 
	 */ 
	const getIndex = (data, id) => {
		return data.nodes.findIndex(item => item.id === id);
	}

	const generateId = () => {
		return new Date().getTime() + Math.random() + '';
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

	const onReset = () => {
		setDocData(JSON.parse(JSON.stringify(initDocData)));
	}

	const onGetValue = () => {
		console.log(editorRef.current.textContent);
	}

	const onGetHtml = () => {
		console.log(renderDoc())
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

			<div className="btn-box">
				<a className="btn" onClick={onReset}>清空数据</a>
				<a className="btn" onClick={onGetValue}>获取数据</a>
				<a className="btn" onClick={onGetHtml}>获取html</a>
			</div>

		</div>
	)
}