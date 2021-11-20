import Node from './Node';
import { generateNodeId } from 'src/utils';

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

}