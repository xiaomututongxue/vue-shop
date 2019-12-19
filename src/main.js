import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree', ZkTable)
//引入elementUI
import ElementUI from 'element-ui'
//Element库的样式引入
import 'element-ui/lib/theme-chalk/index.css' 
import './assets/rest.css'
Vue.use(ElementUI)
//引入阿里字体
import '../src/assets/font/iconfont.css'   


//引入ajax
import axios from 'axios'
//配置路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//有权限的api添加token
axios.interceptors.request.use( config =>{
		//为请求头,添加token验证Authorization字段
		//console.log(config)
		config.headers.Authorization = window.sessionStorage.getItem('token');
		return config;
});
//axios挂载在vue实例原型对象上，以后就直接使用this.$http
Vue.prototype.$http = axios

Vue.config.productionTip = false

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */)

//定义一个时间过滤器
Vue.filter('dateFilter',function(val){
	const date = new Date(val);
	const y = date.getFullYear();
	const m = (date.getMonth() + 1 + '' ).padStart(2,'0');
	const d = (date.getDate() + '').padStart(2,0);
	const h = (date.getHours() + '').padStart(2,0);
	const f = (date.getMinutes() + '').padStart(2,0);
	const s = (date.getSeconds() + '').padStart(2,0);
	return `${y}-${m}-${d} ${h}:${f}:${s}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')