<template>
	<div id="home">
		<el-container>
			<!--头部-->
			<el-header>
				<div class="header-img">
					<img src="../assets/biaoge.jpg" />
					<span>电商后台管理系统</span>
				</div>
			</el-header>
			<!--头部结束-->
			<el-container>
				<!--侧边栏左边开始-->
				<el-aside :width="flag?'64px':'200px'">
					<!--三条杠开始-->
					<div class="adidas" @click="huishou"> | | | </div>
					<!--三条杠结束-->
					<el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :collapse="flag" :collapse-transition="false" router>
						<!--第一个用户管理开始-->
						<el-submenu index="1">
							<template slot="title">
								<i class="el-icon-location"></i>
								<span>用户管理</span>
							</template>
							<el-menu-item index="Users">
								<template slot="title">
									<i class="el-icon-location"></i>
									<span>用户个人信息</span>
								</template>
							</el-menu-item>
							<el-menu-item index="1-2">
								<template slot="title">
									<i class="el-icon-location"></i>
									<span>用户管理菜单2</span>
								</template>
							</el-menu-item>
						</el-submenu>
						<!--第一个用户管理结束-->
						<!--第二个导航开始-->
						<el-submenu index="2">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>商品管理</span>
							</template>
							<el-menu-item index="2-1">
								<template slot="title">
									<i class="el-icon-menu"></i>
									<span>用户商品管理1</span>
								</template>
							</el-menu-item>
							<el-menu-item index="2-2">
								<template slot="title">
									<i class="el-icon-menu"></i>
									<span>用户商品管理2</span>
								</template>
							</el-menu-item>
						</el-submenu>
						<!--第二个导航结束-->
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
				flag:false
			}
		},
		methods:{
			huishou(){
				this.flag = ! this.flag
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
	/*左边样式结束*/
	/*内容样式开始*/
	.el-main {
		background-color: blanchedalmond;
	}
	/*内容样式结束*/
</style>