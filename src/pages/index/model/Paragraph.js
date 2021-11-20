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

}