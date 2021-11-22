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
	 * 拆分成2个paragraph
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

	/**
	 * 拆分成3个segment
	 * TODO: 产生空span标签问题（分割点是否位于两个端点）
	 */ 
	splitAsThree(segmentId, offset1, offset2) {
		const index = this.segments.findIndex(segment => segmentId === segment.id);
		if (index < 0) {
			return [];
		}
		const [before, center, after] = this.segments[index].splitByTwo(offset1, offset2);
		const head = this.segments.slice(0, index);
		const tail = this.segments.slice(index + 1);
		this.segments = head.concat([before, center, after]).concat(tail);
		return [before, center, after];
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