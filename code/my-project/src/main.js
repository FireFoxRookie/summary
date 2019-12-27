import Vue from 'vue';
import App from './App.vue';
import iview from 'iview';
// import elementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'iview/dist/styles/iview.css';
Vue.config.productionTip = false;
Vue.use(iview);
// Vue.use(elementUI);
new Vue({
    render: h => h(App)
}).$mount('#app');
