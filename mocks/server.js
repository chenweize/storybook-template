const express = require('express');
const glob = require('glob');
const util = require('util');
const chokidar = require('chokidar');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const path = require('path');
const fileUpload = require('express-fileupload');

const mockRootDir = path.join(process.cwd(), 'mocks')


async function delay(n) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), n);
	});
}
/**
 * 包装应答函数
 * 如果不是异步函数，则封装为异步 
 * 
 * 并且将函数结果发送给
 * 
 */
function wrapperView(view) {
	return function(req, res, next) {
		async function asyncView() {
			let result = {};
			// 为了模拟慢速网络提供延时功能
			if (view.delay && parseInt(view.delay) > 0) await delay(view.delay);
			//执行处理函数
			if (util.types.isAsyncFunction(view.handler)) {
				result = await view.handler.call(view, req, res);
			} else {
				result = view.handler.call(view, req, res);
			}
			// 处理结果
			// JSON--> 直接返回
			// 数组[应答码，应答结果]
			if (result !== undefined) {
				if (typeof result == 'object') {
					res.json(result);
				} else if (Array.isArray(result)) {
					//如果返回数量，则第一个代表应答码，第二个代表结果
					res.status(result[0]).send(result[1]);
				} else {
					res.send(result);
				}
			} // 如果没有返回任何值，则应由view处理器自行调用res.send或res.sendfile等处理
		}
		asyncView().then(next).catch((err) => {
			console.error(err);
		});
	};
}

function registerRoute(filename, app) {
	let views = require(filename);
	if (!Array.isArray(views)) views = [ views ];
	let viewCount = views.length;
	views.forEach((view) => {
		if (view.handler && typeof view.handler == 'function') {
			let method = view.method.toLowerCase() || 'use';
			// 注册处理函数
			app[method].call(app, view.url, wrapperView(view));
			console.log(`View[${path.relative(__dirname, filename)} - ${view.method}(${view.url})].........loaded`);
		} else {
			viewCount--;
			console.warn(`没有定义${view.url}视图处理函数`);
		}
	});
	// 返回成功注册的路由数量
	return viewCount;
}

function registerRoutes(app) {
	// 遍历文件夹下所有js文件
	let files = glob.sync(path.join(__dirname, '**/*.js'), { ignore: __filename });
	let routeCount = 0,
		mockLastIndex = 0;
	files.forEach((file) => {
		try {
			routeCount += registerRoute(file, app);
			mockLastIndex = app._router.stack.length;
		} catch (e) {
			console.log(`加载${file}失败:${e.stack}.`);
		}
	});
	// Express将注册的路由放在app._router.stack
	// 返回模拟的路由数量和起始索引
	return {
		mockRoutesLength: routeCount,
		mockStartIndex: mockLastIndex - routeCount
	};
} 

// 移除所有路由
function unregisterRoutes() {
	Object.keys(require.cache).forEach((i) => {
		if (i.includes(mockRootDir)) {
			delete require.cache[require.resolve(i)];
			console.log('Remove registed route : ', i);
		}
	});
}

module.exports = (app) => {
	
};

module.exports = function() {
    // es6 polyfill
	require('@babel/register');
    
    const app = express();
	// parse app.body
	// https://expressjs.com/en/4x/api.html#req.body
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
    app.use(fileUpload())

    // 注册路由，并返回路由在缓存中的位置
	let { mockRoutesLength, mockStartIndex } = registerRoutes(app);

	// 监视文件 watch files, hot reload mock server
	chokidar
		.watch(mockRootDir, {
			ignored: /server/,
			ignoreInitial: true
		})
		.on('all', (event, path) => {
			if (event === 'change' || event === 'add') {
				// remove mock routes stack
				app._router.stack.splice(mockStartIndex, mockRoutesLength);
				// clear routes cache
                unregisterRoutes();
                // 重新注册路由
                let { mockRoutesLength:routeLength, mockStartIndex:startIndex } = registerRoutes(app);
                mockRoutesLength=routeLength
                mockStartIndex=startIndex
				console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`));
			}
        });
    // 
	app.listen(7511, () => console.log(`MockServer listening on port 7511!`));
};
