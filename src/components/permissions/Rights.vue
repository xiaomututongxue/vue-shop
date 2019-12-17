<template>
	<div id="rights">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片-->
		<el-card >
		  <!--表格，展示权限列表-->
		    <el-table :data="tableDatas" style="width: 100%" > 
			   	<el-table-column type='index' label="#" width="180"></el-table-column>
			   	<el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
			   	<el-table-column prop="path" label="路径" width="180"></el-table-column>
			   	<el-table-column prop="level" label="权限等级" width="180">
			   		<!--作用域插槽-->
			   		<template slot-scope="scope">
			   			<!--{{scope.row.level}}-->
			   			<el-tag type="success" v-if='scope.row.level == 0'>一级</el-tag>
						<el-tag type="info" v-else-if='scope.row.level == 1'>二级</el-tag>
						<el-tag type="warning" v-else>三级</el-tag>
			   		</template>
			   	</el-table-column>
    		</el-table>
		</el-card>

	</div>
</template>

<script>
	export default {
		data(){
			return {
				tableDatas:[]
			}
		},
		created(){
			this.gitPermissions()
		},
		methods:{
			//获取所有权限列表的方法
			async gitPermissions(){
				const {data:res} = await this.$http.get('rights/list')
				//console.log(res.data)
				this.tableDatas = res.data
				//console.log(this.tableDatas)
			}
		}
	}
</script>

<style>
</style>