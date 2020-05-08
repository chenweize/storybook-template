/**
 * 提供Mock中间件
 * 
 * 将访问/api的路由代理到http://localhost:7511/
 * 
 * 因此，前端访问
 * http://localhost:6006/api/a ---> http://localhost:7511/a
 * 
 */
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