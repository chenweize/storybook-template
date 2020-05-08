
module.exports = [
	{
		url: '/getCard',
		method: 'get',
		delay: 0, // 是否延时的豪秒
		handler: (req, res) => {
			return {
				title: 'StoryBook',
				content: "Storybook是一个开源工具，用于独立开发React、Vue和Angular的UI组件。它能有组织和高效地构建UI组件。本文以构建 React 组件库为例说明如何使用。"
			};
		}
	}
];
