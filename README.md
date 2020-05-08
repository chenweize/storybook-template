# voerka-component-template

本工程模板在VUE工程的基础上进行扩展，支持以下特性：

1. 支持组件开发神器Storybook，能方便地在沙盒环境中进行组件的开发与测试。
2. 配置了JEST单元测试
3. 内置了支持热重载的Mock服务器代理

## 快速入门

### 安装依赖项

> 注意：
> 1. 需要更改`package.json`文件的工程名称。
> 2. 如果出现 ERROR: Found bindings for the following environments: - Windows 64-bit with Node.js ... 。
     解决方案：在控制台输入 yarn add node-sass，然后重新运行即可
```
yarn install
```

### 启动开发服务器

```
yarn serve
```

已经配置好Mock代理服务器，详细配置在vue.config.js，如下：

```javascript
        proxy:{
            "/api": {
                target      : 'http://localhost:7511',
                changeOrigin: false,
                pathRewrite : {
                    "/api"  : "/"              // 将访问/api的请求代理到模拟服务器的
                }
            }, 
            ....更多的配置项....
        }, 
        after: require('./mocks/server.js')()
```

以上配置会`port=7511`启动一个HTTP代理服务器，并自动代理所有`/api`的HTTP请求到http://localhost:7511。

因此，前端所有访问http://api/xxx的请求均被代理到http://localhost:7511/xxx。

注：

1. 使用代理服务器的目的是解决跨域的问题。
2. 代理服务器使用的是Webpack中间件`http-proxy-middleware`，更多的配置可以详见官网或百度。

### 启动Storybook

Storybook是一个开源工具，用于独立开发React、Vue和Angular的UI组件。它能有组织和高效地构建UI组件。本工程模板已经内置，并作了基本配置。启动方法：

```javascript
yarn run stroybook
```

- **Mock代理服务器**

启动后会自动开启Mock代理服务器，使用方法同上说明，但是Mock服务器的配置在`.storybook/middleware.js`，代理如下：

```javascript
const  { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = (router) => {
    router.use(createProxyMiddleware("/api",{
        target: 'http://localhost:7511',
        changeOrigin: false,
        ws: true,
        pathRewrite:{
            "/api":"/"              // 将访问/api的请求代理到模拟服务器的
        }
    }))
}

```

- **Storybook插件**

默认启用了以下Storybook插件

```javascript
		'@storybook/addon-viewport',
		'@storybook/addon-docs',
		'@storybook/addon-actions',
		'@storybook/addon-knobs',
		'@storybook/addon-links',
		'@storybook/addon-backgrounds',
		'@storybook/addon-notes',
		'@storybook/preset-scss',
```

关于`stroybook`开发使用方法请见`stories`文件夹以及官网教程。

### 编写Mock用例

所有的Mocks用例均写在`mocks`文件夹里面，Mock服务器实质上是一个`express `框架，在启动时会自动遍历该文件夹下所有的js文件并载入到路由表中，每个js文件均可以定义多个视图，如下：

```javascript
module.exports = [
	{
		url: '/getCard',						//  =====>  /api/getCard
        // 支持标准的HTTP方法，包括get,post,head,options,patch,delete,put
		method: 'get',
        // 是否延时的豪秒数，用来模拟慢速网络时增加额外的延时响应
		delay: 0, 
        // 请求处理函数，支持
        // 1. 直接返回{}
        // 2. 带响应码 ，如 [302,{...}]
        // 3. 除{}外的其他数据,如return 123
        // 4. 不返回任何值，相当于返回undefined时，则可以自行调用res对象方法
		handler: (req, res) => {
			return {
				title: '来了老弟',
				content: ""
			};
		}
	},
    {
        url:"/a/b",								//  =====>  /api/a/b
        method:"post",
        handler:(req,res)=>{
            res.send(....)
        }
    }
];
```

**注：**

- 上述`req`,`res`是`express`框架的`resquest`和`response`对象，可参阅其文档。
- 工程模板中已经内置了一个上传文件的接口，在`mocks/upload/index.js`，前端可以通过`url=/upload`将文件上传到`public/`，或者可以指定上传路径，如`POST /upload/?path=/a/b`，则文件会上传到`public/a/b`。



### 编译与构建

```
yarn build
```

### 运行单元测试
```
yarn test:unit
```

### 更多配置
See [Configuration Reference](https://cli.vuejs.org/config/).

