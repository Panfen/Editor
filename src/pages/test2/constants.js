// 采用数据驱动设计模式

export const initDocData = {
	title: '文档标题',
	createTime: '2022-08-08 15:00:00',
	nodes: [
		{
			id: '1',
			type: 'paragraph',
			element: 'div',
			style: '', // 内联样式
			nodes: [
				{
					id: 'ORIGINAL_SEGMENT',
					type: 'segment',
					element: 'span',
					style: '',
					className: '',
					content: ''
				}
			]
		}
	]
};

export const checkList = [
	{
		id: '1',
		name: '血常规'
	},
	{
		id: '2',
		name: '血生化'
	},
	{
		id: '3',
		name: '肝功能'
	},
	{
		id: '4',
		name: '肾功能'
	},
	{
		id: '5',
		name: '电解质'
	}
]