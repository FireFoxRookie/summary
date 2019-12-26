const Vue = require('vue')

const vm = new Vue({
    data: {
        text: '服务端渲染'
    },
    template: '<div>{{text}}</div>'
})

module.exports = {
    vm
}