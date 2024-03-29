import { generateNodeId } from 'src/utils';
import Node from './Node';

export default class Segment extends Node {
	text = '';
	style = {};

	constructor(id = generateNodeId(), text = '', style = {}) {
	  super(id, 'paragraph');
	  this.text = text;
	  this.style = style;
	}

	static create(data) {
	  const { id, text, style } = data;
	  return new Segment(id, text, style);
	}

	insertText(offset, text) {
	  if (offset < 0 || offset > this.text.length || !text) {
	    return;
	  }
	  this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
	}

	deleteText(offset, length) {
	  if (offset < 0 || offset + length > this.text.length || length === 0) {
	    return;
	  }
	  this.text = this.text.slice(0, offset) + this.text.slice(offset + length);
	  return this.text;
	}

	/**
	 * 2分
	 */
	split(index) {
	  const before = this.text.slice(0, index);
	  const after = this.text.slice(index);
	  this.text = before;
	  return [
	    this,
	    Segment.create({
	      text: after,
	      style: this.style,
	    }),
	  ];
	}

	/**
	 * 3分
	 */
	splitByTwo(index1, index2) {
	  const a = this.text.slice(0, index1);
	  const b = this.text.slice(index1, index2);
	  const c = this.text.slice(index2);
	  this.text = b;
	  return [
	    Segment.create({
	      text: a,
	      style: this.style,
	    }),
	    this,
	    Segment.create({
	      text: c,
	      style: this.style,
	    }),
	  ];
	}

	addStyle(name, value) {
	  if (!name) {
	    return;
	  }
	  if (!value) {
	    delete this.style[name];
	  }
	  this.style = {
	    ...this.style,
	    [name]: value,
	  };
	}
}
