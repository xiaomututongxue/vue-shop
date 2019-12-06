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
					<el-input placeholder="请输入内容" v-model="usersData.query" clearable @clear="getBiaoGe">
						<el-button slot="append" icon="el-icon-search" @click="getBiaoGe"></el-button>
					</el-input>
				</el-col>
				<el-col :span="8">
					<el-button type="primary" @click='dialogVisible=true'>添加用户</el-button>
				</el-col>
			</el-row>
		</el-card>
		<!--卡片结束-->
		<!--表格-->
		<el-table :data="userList" border style="width: 100%">
			<el-table-column type="index" label="#"></el-table-column>
			<el-table-column prop="username" label="姓名" ></el-table-column>
			<el-table-column prop="email" label="邮箱" ></el-table-column>
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
				<el-button type="primary" icon="el-icon-edit" circle @click="modification"></el-button>
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
	    
	    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close='onOff'>
	    	<el-form :model="gitForm" :rules="addusers" ref="addRefs" label-width="70px">
	    		<!--用户名-->
	    		<el-form-item label="用户名" prop="username">
				    <el-input v-model="gitForm.username"></el-input>
				</el-form-item>
				<!--密码-->
				<el-form-item label="密码" prop="password">
				    <el-input v-model="gitForm.password"></el-input>
				</el-form-item>
				<!--邮箱-->
				<el-form-item label="邮箱" prop="email">
				    <el-input v-model="gitForm.email"></el-input>
				</el-form-item>
				<!--手机号-->
				<el-form-item label="手机" prop="mobile">
				    <el-input v-model="gitForm.mobile"></el-input>
				</el-form-item>
	    	</el-form>
	    	
	    	<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="addUser">确 定</el-button>
			</span>
	    	
	    </el-dialog>
	    
	    
	</div>
</template>

<script>
	export default {
		data() {
			var checkEmail = (rule, value, callback)=>{
				//自定义一个邮箱的验证规则,使用正则
				const regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
				if(regEmail.test(value)) {
					callback()
				}
				callback(new Error('验证失败'));
			}
			//自定义验证手机号
			var checkMobil = (rule, value, callback)=>{
				//自定义一个邮箱的验证规则,使用正则
				const regMobil = /^1(3|4|5|7|8|9)\d{9}$/;
				if(regMobil.test(value)) {
					callback()
				}
				callback(new Error('验证失败'));
			}
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
				//总的数据条数
				total:0,
				//控制对话框的显示隐藏
				dialogVisible:false,
				gitForm:{
					username:'',
		          	password:'',
		          	email:'',
		          	mobile:''
				},
				//添加用户验证规则
				addusers:{
					username:[
		          		 { required: true, message: '请输入用户名', trigger: 'blur' },
		           		 { min: 3, max: 8, message: '长度在 3 到 8个字符', trigger: 'blur' }
		          	],
		          	password:[
		          		 { required: true, message: '请输入密码', trigger: 'blur' },
		           		 { min: 6, max: 18, message: '长度在 6 到18个字符', trigger: 'blur' }
		          	],
		          	email:[
						 { validator:checkEmail, trigger: 'blur' }
		          	],
		          	mobile:[
		          		{ validator:checkMobil, trigger: 'blur' }
		          	]
				}
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
			},
			//关闭弹框清除里面写的内容
			onOff(){
				this.$refs.addRefs.resetFields();
			},
			addUser(){
				this.$refs.addRefs.validate(async (vali)=>{
					console.log(vali)
					if(!vali){
						return this.$message.error('添加失败')
					}
					//预验证通过,发送ajax请求
					const {data:res} = await this.$http.post('users',this.gitForm);
					if(res.meta.status !== 201 ){
						return this.$message.error(res.meta.msg)
					}
					//关闭对话框
					this.dialogVisible = false;
					this.getBiaoGe();
				})
			},
			//修改每条数据信息
			modification(){
				console.log(1)
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