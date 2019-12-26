// 获取文件模块
const fs = require('fs');
// 获取vue对象
const Vue = require('vue');
// 创建一个express服务
const server = require('express')();
// 获取createRenderer方法
const createRenderer = require('vue-server-renderer').createRenderer;
const renderer = createRenderer({
    // 获取公共的模板
    template: fs.readFileSync('./index.tpl.html', 'utf-8')
});
// 设置路由
server.get('/home', (req, res) => {
    const vm = new Vue({
        data: {
            text: '服务端渲染',
            url: req.url
        },
        template: `<div><span>{{text + '，渲染路径：' + url}}</span></div>`
    })
    renderer.renderToString(vm, {title: '服务端渲染'}, (err, html) => {
        if (err) {
            res.status(500).end(err);
            return false;
        }
        res.end(`${html}`)
    })
});
server.listen(3000);