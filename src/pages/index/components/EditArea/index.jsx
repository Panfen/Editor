import React, { useState } from 'react';
import DocumentModal from '../../model/Document';
import Document from '../Document';

export default ({ data }) => {

	const [document, setDocument] = useState(DocumentModal.create(data));

	const onKeyDown = (e) => {
		if (['Shift', 'Ctrl', 'Alt', 'Meta'].includes(e.key)) {
			return;
		}
		e.preventDefault();

		if (e.key === 'Backspace') {
			// 向后删除
			deleteText(true);
		} else if (e.key === 'Delete') {
			// 向前删除
			deleteText(false);
		} else if (e.key === 'b' && e.metaKey) {
			// 加粗，command + b
			toggleBold();
		} else {
			insertText(e);
		}
	}

	/**
	 * 插入文字
	 */ 
	const insertText = (e) => {
		const sel = window.getSelection();
		if (!sel || !sel.rangeCount) {
			return;
		}
		const text = e.key;
		const range = sel.getRangeAt(0);
		const startContainer = range.startContainer;
		const parentEl = startContainer.parentElement; // span
		const startOffset = range.startOffset;

		if (!range.collapsed || !parentEl) {
			return;
		}

		document.insertText(parentEl.id, startOffset, text);
		setDocument(DocumentModal.create(document));

		// 设置光标
		setTimeout(() => {
			range.setStart(startContainer, startOffset + text.length);
			range.setEnd(startContainer, startOffset + text.length);
			console.log(sel)
			sel.addRange(range);
		});
	}

	/**
	 * 删除文字
	 */ 
	const deleteText = (backward) => {
		const sel = window.getSelection();
		if (!sel || !sel.rangeCount) {
			return;
		}
		const range = sel.getRangeAt(0);
		const startContainer = range.startContainer;
		const parentEl = startContainer.parentElement; // span
		const startOffset = range.startOffset;

		if (!range.collapsed || !parentEl) {
			return;
		}

		const start = backward ? startOffset - 1 : startOffset;
		if (start < 0) {
			return;
		}
		const newText = document.deleteText(parentEl.id, start, 1);
		if (newText === '') {
			// TODO：删除整个segment
		}
		setDocument(DocumentModal.create(document));

		// 设置光标
		setTimeout(() => {
			range.setStart(startContainer, start);
			range.setEnd(startContainer, start);
			sel.addRange(range);
		});
	}

	/**
	 * 加粗
	 */ 
	const toggleBold = () => {
		const sel = window.getSelection();
		if (!sel || !sel.rangeCount) {
			return;
		}
		
		const range = sel.getRangeAt(0);
		const startContainer = range.startContainer;
		const startParentEl = startContainer.parentElement; // span
		const startOffset = range.startOffset;
		const endContainer = range.endContainer;
		const endParentEl = endContainer.parentElement; // span
		const endOffset = range.endOffset;

		if (range.collapsed || !startParentEl || !endParentEl) {
			return;
		}

		document.addInlineStyle(startParentEl.id, startOffset, endParentEl.id, endOffset, 'fontWeight', 'bold');
		setDocument(DocumentModal.create(document));

		// 是否同一个segment的offset
		const offset = startContainer === endContainer ? endOffset - startOffset : endOffset

		// 设置光标
		setTimeout(() => {
			range.setStart(endContainer, offset);
			range.setEnd(endContainer, offset);
			sel.addRange(range);
		});

	}

	return (
		<div id="editbox" contentEditable="true" suppressContentEditableWarning="true" onKeyDown={onKeyDown}>
			<Document data={document} />
		</div>
	)

}