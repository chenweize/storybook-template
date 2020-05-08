
module.exports = {
    devServer: {
        open: false,
        overlay: {
          warnings: false,
          errors: true
        },
        proxy:{
            "/api": {
                target      : 'http://localhost:7511',
                changeOrigin: false,
                pathRewrite : {
                    "/api"  : "/"              // 将访问/api的请求代理到模拟服务器的
                }
            }, 
        }, 
        after: require('./mocks/server.js')()
      },
}