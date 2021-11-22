
// 工具栏
export const tools = [
	{
		id: 0,
		children: [
			{
				title: '撤销',
				key: 'undo',
				type: 'icon'
			},
			{
				title: '重做',
				key: 'redo',
				type: 'icon'
			},
			{
				title: '清除格式',
				key: 'stop',
				type: 'icon'
			}
		]
	},
	{
		id: 1,
		children: [
			{
				title: '字体大小',
				key: 'font-size',
				type: 'icon'
			},
			{
				title: '字体颜色',
				key: 'font-colors',
				type: 'icon'
			},
			{
				title: '加粗',
				key: 'bold',
				type: 'icon'
			},
			{
				title: '斜体',
				key: 'italic',
				type: 'icon'
			},
			{
				title: '下划线',
				key: 'underline',
				type: 'icon'
			},
			{
				title: '行高',
				key: 'line-height',
				type: 'icon'
			},
		]
	},
	{
		id: 3,
		children: [
			{
				title: '居中',
				key: 'align-center',
				type: 'icon'
			},
			{
				title: '居左',
				key: 'align-left',
				type: 'icon'
			},
			{
				title: '居右',
				key: 'align-right',
				type: 'icon'
			},
		]
	},
	{
		id: 4,
		children: [
			{
				title: '有序列表',
				key: 'ordered-list',
				type: 'icon'
			},
			{
				title: '无须列表',
				key: 'unordered-list',
				type: 'icon'
			},
		]
	}
];

// 初始化数据
export const initData = {
	type: 'document',
	nodes: [
		{
			type: 'paragraph',
			segments: [
				{
					text: 'abc',
					style: {
						color: 'red'
					}
				},
				{
					text: 'def',
					style: {
						color: 'green'
					}
				},
			],
			style: {
				// textAlign: 'center'
			}
		}
	]
}
