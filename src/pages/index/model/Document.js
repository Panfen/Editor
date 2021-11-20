import Node from './Node';
import Paragraph from './Paragraph';
import { generateNodeId } from 'src/utils';

export default class Document extends Node {
	nodes = [];

	constructor(id = generateNodeId(), nodes = []) {
		super(id, 'document');
		this.nodes = nodes;
	}

	static create(data) {
		const { id, nodes } = data;
		return new Document(id, nodes.map(Paragraph.create));

	}
}