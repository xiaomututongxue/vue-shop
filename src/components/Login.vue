<template>
	<div id="login">
		<div class="login-content">
			<div class="login-img">
				<img src="../assets/下载 (1).jpg" />
			</div>
			<el-form class="login-form">
				<el-form-item >
					<el-input></el-input>
				</el-form-item>
				<el-form-item >
					<el-input></el-input>
				</el-form-item>
				<el-form-item class="login-btns">
					<el-button type="primary">主要按钮</el-button>
					<el-button type="success">成功按钮</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
</script>

<style scoped="scoped">
	#login {
		height: 100%;
		background-color: pink;
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