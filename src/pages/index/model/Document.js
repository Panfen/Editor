import Node from './Node';
import Paragraph from './Paragraph';
import Segment from './Segment';
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

	insertText(id, offset, text) {
		const node = this.findNodeById(id);
		if (!node || !(node instanceof Segment)) {
			return;
		}
		node.insertText(offset, text);
	}

	deleteText(id, offset, length) {
		const node = this.findNodeById(id);
		if (!node || !(node instanceof Segment)) {
			return;
		}
		const newText = node.deleteText(offset, length);
		// segment删空内容后，移出整个segment元素
		if (newText === '') {
			const pNode = this.findParentNodeById(id);
			const index = pNode.segments.findIndex(seg => seg.id === id);
			pNode.segments.splice(index, 1);
		};
	}

	addInlineStyle(startId, startOffset, endId, endOffset, name, value) {
		const nodes = this.findSegmentsByStartAndEnd(startId, endId);

		if (nodes.length < 1) {
			return [startId, startOffset, endId, endOffset];
		}

		// 在同一个segment
		if (startId === endId) {
			const para = this.findParentNodeById(nodes[0].id);
			const [, center, ] = para.splitAsThree(nodes[0].id, startOffset, endOffset);
			center.addStyle(name, value);
			return;
		}

		// 拆分第一个segment
		const fist = nodes[0];
		const fistPara = this.findParentNodeById(fist.id);
		const [, after] = fistPara.split(fist.id, startOffset);
		after.addStyle(name, value);

		// 拆分最后一个segment
		const last = nodes[nodes.length - 1];
		const lastPara = this.findParentNodeById(last.id);
		const [before, af] = lastPara.split(last.id, endOffset);
		before.addStyle(name, value);

		nodes.slice(1, nodes.length - 1).forEach(node => node.addStyle(name, value));
	}

	findParentNodeById(id) {
		if (this.id === id) {
			return null;
		}
		for (const node of this.nodes) {
			if (node.id === id) {
				return this;
			}
			if (node.type === 'paragraph') {
				for (const segment of node.segments) {
					if (segment.id === id) {
						return node;
					}
				}
			}
		}
	}

	findNodeById(id) {
		if (this.id === id) {
			return this;
		}
		for (const node of this.nodes) {
			if (node.id === id) {
				return node;
			}
			for (const segment of node.segments) {
				if (segment.id === id) {
					return segment;
				}
			}
		}
	}

	findSegmentsByStartAndEnd(startId, endId) {
		const result = [];
		let findStart = false;
		for (const node of this.nodes) {
			for (const segment of node.segments) {
				if (segment.id === startId) {
					result.push(segment);
					findStart = true;
					continue;
				}
				if (segment.id === endId) {
					result.push(segment);
					return result;
				}
				if (findStart) {
					result.push(segment);
				}
			}
		}
		return result;
	}
}