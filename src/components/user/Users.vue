<template>
	<div id="users">
		<!--面包屑-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--面包屑结束-->
		<!--卡片-->
		<el-card>

			<!--栅格系统-->
			<el-row :gutter="50">
				<el-col :span="16">
					<el-input placeholder="请输入内容">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				<el-col :span="8">
					<el-button type="primary">添加用户</el-button>
				</el-col>
			</el-row>
		</el-card>
		<!--卡片结束-->
		<!--表格-->
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="name" label="姓名" width="180"></el-table-column>
			
			<el-table-column prop="date" label="邮箱" width="180"></el-table-column>
			
			<el-table-column prop="address" label="地址"></el-table-column>
			<el-table-column prop="beizhu" label="备注"></el-table-column>
			<el-table-column  label="操作">
				<el-button type="primary" icon="el-icon-edit"></el-button>
				<el-button type="primary" icon="el-icon-delete"></el-button>
			</el-table-column>
			

		</el-table>
		
		<!--表格结束-->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [{
					date: '306968428@qq.com',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄',
					beizhu: ''
				}, {
					date: '306968428@qq.com',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄'
				}, {
					date: '306968428@qq.com',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '306968428@qq.com',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄'
				}]
			}
		}
	}
</script>

<style>
	#users {
		background-color: #EEE8AA;
	}
	
	.el-card {
		margin: 10px 0;
	}
</style>