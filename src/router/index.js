import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/permissions/Roles.vue'
import Rights from '../components/permissions/Rights.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Goods.vue'
Vue.use(VueRouter)

const routes = [
	{path:'/',redirect:'/login'},
	{path:'/Login',component:Login},
	{
		path:'/Home',
		component:Home,
		redirect:'/welcome',
		children:[
			{path:'/Welcome',component:Welcome},
			{path:'/Users',component:Users},
			{path:'/Roles',component:Roles},
			{path:'/Rights',component:Rights},
			{path:'/Categories',component:Categories},
			{path:'/Params',component:Params},
			{path:'/Goods',component:Goods},
		]
	},
	
]

const router = new VueRouter({
routes
})
//路由导航卫士
router.beforeEach((to,from,next)=>{
	//如果用户想要访问登录login页面,没必要做任何验证,直接放行
	if(to.path == '/login') return next();
	//获取token
	const tokenStr = window.sessionStorage.getItem('token');
	if(!tokenStr) return next('/login')
	next();
})

export default router
