import Node from './Node';
import Segment from './Segment';
import { generateNodeId } from 'src/utils';

export default class Paragraph extends Node {

	style = {};
	segments = [];

	constructor(id = generateNodeId(), style = {}, segments = []) {
		super(id, 'paragraph');
		this.style = style;
		this.segments = segments;
	}

	static create(data) {
		const { id, style, segments } = data;
		return new Paragraph(id, style, segments.map(Segment.create));
	}

	/**
	 * 段落拆分
	 */ 
	split(segmentId, offset, splitSelf = false) {
		const index = this.segments.findIndex(segment => segmentId === segment.id);
		if (index < 0) {
			return [];
		}

		const [before, after] = this.segments[index].split(offset);
		const head = this.segments.slice(0, index);
		const tail = this.segments.slice(index + 1);

		if (splitSelf) {
			//
		} else {
			this.segments = head.concat([before, after]).concat(tail);
			return [before, after];
		}
	}

	addStyle(name, value) {
		if (!name) {
			return
		}
		if (!value) {
			delete this.style[name]
		}
		this.style = {
			...this.style,
			[name]: value
		}
	}

}