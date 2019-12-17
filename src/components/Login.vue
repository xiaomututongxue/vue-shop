<template>
	<div id="login">
		<div class="login-content">
			<div class="login-img">
				<img src="../assets/下载 (1).jpg" />
			</div>
			<el-form class="login-form" :model="loginForm" :rules="loginRule" ref="loginForm">
				<el-form-item prop="username">
					<el-input prefix-icon="el-icon-user-solid" placeholder="请输入用户名" v-model="loginForm.username"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<!--<el-input prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>-->
					<el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
				</el-form-item>
				<el-form-item class="login-btns">
					<el-button type="primary" @click="login">登录</el-button>
					<el-button type="success" @click="loginReset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				loginForm:{
					username:'',
					password:''
				},
				loginRule:{
					username:[
						{ required: true, message: '请输入用户名', trigger: 'blur' },
            			{ min: 3, max: 5, message: '长度在 3 到 8 个字符', trigger: 'blur' }
					],
					password:[
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 6, max: 12, message: '长度在 6到 12个字符', trigger: 'blur' }
					]
				}
			}
		},
		methods:{
			login(){
				this.$refs.loginForm.validate( async valid => {
					console.log(valid)
					if(!valid) return this.$message.error('登录失败')
					//发送ajax		
					//第一种方式
					/*const res = this.$http.post('login',this.loginForm);
					this.$http.post('login',this.loginForm).then(function(res){
						//console.log(res)
						console.log(res.data)
					})*/
					//第二种方式
					/*const res = await this.$http.post('login',this.loginForm)
					console.log(res.data)*/
					//es6中解构赋值
					const {data:res} = await this.$http.post('login',this.loginForm)
					console.log(res)
					if( res.meta.status != 200 ) return this.$message.error(res.meta.msg)
					//然后把这个唯一的token储存起来，使用会话的方式（浏览器只要关闭就会没有）
					window.sessionStorage.setItem('token',res.data.token)
					//登录正确后进入下一个主页，否则不行
					this.$message.success('登录成功')
					//编程式导航
					//成功之后跳转到home页面
					this.$router.push('/home')
				});
			},
			//重置方法
			loginReset(){
				console.log(this.$refs.loginForm.resetFields())
			}
		}
	}
</script>

<style scoped="scoped">
	#login {
		height: 100%;
		background: url(../assets/edb49e621b8ceb81549f1f6dd38e0556.jpg);
		
	}
	.login-content {
		width: 400px;
		height: 300px;
		background-color: #fff;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		border-radius: 15px;
	}
	.login-img {
		width: 150px;
		height: 150px;
		background-color: palegreen;
		border-radius: 50%;
		padding: 10px;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	
	.login-img img {
		width: 150px;
		height: 150px;
		border-radius: 50%;
	}
	.login-form {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 20px;
		box-sizing: border-box;
	}
	.login-btns {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}
</style>