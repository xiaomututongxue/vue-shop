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
		<el-table :data="userList" border style="width: 100%">
			<el-table-column type="index" label="#"></el-table-column>
			<el-table-column prop="username" label="姓名" width="180"></el-table-column>
			<el-table-column prop="email" label="邮箱" width="180"></el-table-column>
			<el-table-column prop="mobile" label="联系方式"></el-table-column>
			<el-table-column prop="role_name" label="角色"></el-table-column>
			<el-table-column prop="" label="状态">
				<!--作用域卡槽-->
				<template slot-scope='scope'>
					<!--{{scope.row}}-->
					<el-switch v-model="scope.row.mg_state" @change="onOffChange(scope.row)"></el-switch>
				</template>
			</el-table-column>
			<el-table-column  label="操作">
				<el-button type="primary" icon="el-icon-edit" circle></el-button>
				<el-button type="danger" icon="el-icon-delete" circle></el-button>
				<el-button type="info" icon="el-icon-s-tools" circle></el-button>
			</el-table-column>
		</el-table>
		<!--表格结束-->
		<!--分页功能开始-->
		 <el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="usersData.pagenum"
	      :page-sizes="[1, 2, 3, 4]"
	      :page-size="usersData.pagesize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="total">
	    </el-pagination>
	    
	    
	    
	</div>
</template>

<script>
	export default {
		data() {
			return {
				usersData:{
					//查询的用户
					query:'',
					//当前的页码
					pagenum:1,
					//每一页展示的数据
					pagesize:2
				},
				//所有用户的基本数据
				userList:[],
				total:0
			}
		},
		created(){
			this.getBiaoGe()
		},
		methods:{
			//获取后台用户列表
			async getBiaoGe(){
				const {data:res} =  await this.$http.get('users',{params:this.usersData})
//				console.log(res)
				if(res.meta.status != 200) return this.$message.error(res.meta.msg);
				this.userList = res.data.users;
				this.total = res.data.total
			},
			//状态开关事件
			async onOffChange(datas){
				const {data:res} = await this.$http.put(`users/${datas.id}/state/${datas.mg_state}`)
				console.log(res)
				if(res.meta.status != 200){
					res.data.mg_state = !res.data.mg_state
					return this.$message.error(res.meta.msg)
				}
				this.$message.success('修改成功')
			},
			//展示每一页的数据量
			handleSizeChange(val){
				console.log(val)
				this.usersData.pagesize = val;
				this.getBiaoGe()
			},
			//当前页的改变
			handleCurrentChange(val){
				console.log(val)
				this.usersData.pagenum = val;
				this.getBiaoGe()
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
	.el-pagination {
		margin: 10px 0;
	}
</style>