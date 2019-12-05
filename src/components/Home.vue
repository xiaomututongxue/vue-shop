<template>
	<div id="home">
		<el-container>
			<!--头部-->
			<el-header>
				<div class="header-img">
					<img src="../assets/biaoge.jpg" />
					<span>电商后台管理系统</span>
				</div>
				<div class="fanhui" @click="fanhui">
					<el-button type="success" round>退出登录</el-button>
				</div>
			</el-header>
			<!--头部结束-->
			<el-container>
				<!--侧边栏左边开始-->
				<el-aside :width="flag?'64px':'200px'">
					<!--三条杠开始-->
					<div class="adidas" @click="huishou"> | | | </div>
					<!--三条杠结束-->
					<el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :collapse="flag" :collapse-transition="false" router :default-active="path">
						<!--第一个用户管理开始-->
						<el-submenu :index="list.id+''" v-for="list in lists" :key="list.id">
							<template slot="title">
								<i :class="iconObj[list.id]"></i>
								<span>{{list.authName}}</span>
							</template>
							<el-menu-item :index="song.path +''" v-for="song in list.children" :key="song.id" @click="savepath(song.path)">
								<template slot="title">
									<!--<i :class="iconObj[list.id]"></i>-->
									<i :class="iconObjSong"></i>
									<span>{{song.authName}}</span>
								</template>
							</el-menu-item>
							
						</el-submenu>
						<!--第一个用户管理结束-->
						
					</el-menu>
				</el-aside>
				<!--侧边栏左边结束-->
				<!--内容区开始-->
				<el-main>
					<router-view></router-view>
				</el-main>
				<!--内容区结束-->
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				path:'',
				flag:false,
				lists:[],
				iconObj:{
					125:'iconfont iconManagement',
					103:'iconfont iconquanxianguanli',
					101:'iconfont iconshangpinguanli',
					102:'iconfont icondingdan',
					145:'iconfont iconshujutongji'
				},
				iconObjSong:{
					110:'iconfont iconyonghuliebiao',
					111:'iconfont iconjiaoseliebiao',
					112:'iconfont iconquanxianliebiao',
					104:'iconfont iconsp-list',
					115:'iconfont iconfenleiliebiao',
					121:'iconfont iconshangpinfenlei',
					107:'iconfont icondingdanliebiao',
					146:'iconfont iconbaobiao'
				}
			}
		},
		created(){
			this.getMenuList();
			//获取本地存储的path
			this.path = window.sessionStorage.getItem('path');
		},
		methods:{
			huishou(){
				this.flag = ! this.flag
			},
			fanhui(){
				//点击清除本地存储
				window.sessionStorage.clear();
				//点击回到登录页面
				this.$router.push('/login')
			},
			async getMenuList(){
				const {data:res} = await this.$http.get('menus')
				//console.log(res.data)
				if(res.meta.status != 200) return this.$message.error(res.mate.msg)
				this.lists = res.data;
			},
			//存储本地path
			savepath(path){
				window.sessionStorage.setItem('path',path)
				this.path = path
			}
		}
	}
</script>

<style>
	#home {
		width: 100%;
		height: 100%;
		background-color: #ccc;
	}
	/*头部开始*/
	.el-header {
		background-color: powderblue;
		display: flex;
		justify-content: space-between;
	}
	.header-img img {
		height: 60px;
		width: 60px;
		border-radius: 50%;
	}
	.header-img span {
		width: 60px;
		height: 60px;
		line-height: 60px;
		vertical-align: top;
		margin-left: 50px;
		font-size: 23px;
		color: #fff;
	}
	.fanhui {
		padding: 10px;
	}
	/*头部样式结束*/
	.el-container {
		height: 100%;
	}
	/*三条杠样式开始*/
	.adidas {
		height: 30px;
		background: #333;
		color: #fff;
		font-size: 23px;
		text-align: center;
		cursor: pointer;
	}
	/*三条杠样式结束*/	
	/*左边样式开始*/
	.el-aside {
		background-color: palegoldenrod;
	}
	.el-menu{
		border: none!important;
	}
	.iconfont {
		margin-right: 10px;
	}
	/*左边样式结束*/
	/*内容样式开始*/
	.el-main {
		background-color: blanchedalmond;
	}
	/*内容样式结束*/
</style>