import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
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
			{path:'/Users',component:Users}
		]
	},
	
]

const router = new VueRouter({
routes
})

export default router
