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
			<el-table-column prop="username" label="姓名"></el-table-column>
			<el-table-column prop="email" label="邮箱"></el-table-column>
			<el-table-column prop="mobile" label="联系方式"></el-table-column>
			<el-table-column prop="role_name" label="角色"></el-table-column>
			<el-table-column prop="" label="状态">
				<!--作用域卡槽-->
				<template slot-scope='scope'>
					<!--{{scope.row}}-->
					<el-switch v-model="scope.row.mg_state" @change="onOffChange(scope.row)"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				
				<template slot-scope='scope'>
				<!--修改按钮-->
					<el-button @click='editUserInfos(scope.row.id)' type="primary" icon="el-icon-edit" circle ></el-button>
					<!--删除按钮-->
					<el-button @click='deleteData(scope.row.id)' type="danger" icon="el-icon-delete" circle></el-button>
					<!--设置按钮-->
					<el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable='false'>
						<el-button @click='permissionsButton(scope.row)' type="info" icon="el-icon-s-tools" circle></el-button>
					</el-tooltip>
				</template>
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
	    
	    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close='addClose'>
	    	<el-form :model="gitForm" :rules="addFormRul" ref="addFormRef" label-width="70px">
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
	    
	    <!--编辑用户的对话框-->
		<el-dialog  @close='editCloses' title="编辑用户" :visible.sync="editdialogVisibles" width="50%">
		  <!--表单内容-->
		  <el-form :model="editUserForms" :rules="editUserFormRuless" ref="editUserFormRefs" label-width="70px">
			  <!--用户名-->
			  <el-form-item label="用户名" prop="username">
			    <el-input v-model="editUserForms.username" disabled></el-input>
			  </el-form-item>
			  <!--邮箱-->
			  <el-form-item label="邮箱" prop="email">
			    <el-input v-model="editUserForms.email"></el-input>
			  </el-form-item>
			  <!--电话-->
			  <el-form-item label="电话" prop="mobile">
			    <el-input v-model="editUserForms.mobile"></el-input>
			  </el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editdialogVisibles = false">取 消</el-button>
		    <el-button type="primary" @click="editUserSubmits">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!--分配角色对话框-->
		<el-dialog @close='listeningDialog' title="分配角色" :visible.sync="AssignRolesDialogVisible" width="30%">
		  <div>
		  	<!--<pre>
		  		{{userDatas}}
		  	</pre>-->
		  	<p>{{userDatas.role_name}}</p>
		  	<p>{{userDatas.username}}</p>
		  	
		  	<el-select v-model="roleValueId" placeholder="请选择角色">
			    <el-option
			      v-for="item in itemDatas"
			      :key="item.id"
			      :label="item.roleName"
			      :value="item.id">
			    </el-option>
			</el-select>
			
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="AssignRolesDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="SaveTheRole">确 定</el-button>
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
				addFormRul:{
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
				},
				//点击修改弹框的显示和隐藏
				editdialogVisibles:false,
				//根据ID查询到的用户信息
				editUserForms:{},
				editUserFormRuless:{
					email:[
						 { validator:checkEmail, trigger: 'blur' }
		          	],
		          	mobile:[
		          		{ validator:checkMobil, trigger: 'blur' }
		          	]
				},
						//控制分配角色对话框的显示与隐藏
				AssignRolesDialogVisible:false,
				//用户数据
				userDatas:[],
				//角色列表
				itemDatas:[],
				roleValueId:''
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
			//关闭添加对话框
			addClose(){
				this.$refs.addFormRef.resetFields();
			},
			addUser(){
				this.$refs.addFormRef.validate(async (vali)=>{
					console.log(vali)
					if(!vali){
						return this.$message.error('添加失败')
					}
					//预验证通过,发送ajax请求
					const {data:ret} = await this.$http.post('users',this.gitForm);
					if(ret.meta.status !== 201 ){
						return this.$message.error(ret.meta.msg)
					}
					//关闭对话框
					this.dialogVisible = false;
					this.getBiaoGe();
				})
			},
			//根据ID查询到要修改的用户的操作
			async editUserInfos(id){
				const {data:res} = await this.$http.get('users/' + id);
				console.log(res)
				if(res.meta.status !== 200) return this.$message.error(ret.meta.msg)
				this.editUserForms = res.data;
				this.editdialogVisibles = true;
			},
			//清除内容
			editCloses(){
				
				this.$refs.editUserFormRefs.resetFields();
				
			},
			//修改完成确认提交
			editUserSubmits(){
				//预校验
				this.$refs.editUserFormRefs.validate( async vali => {
					//预校验失败
					if(!vali) return this.$message.error('编辑失败')
					//预校验成功
					const {data:res} = await this.$http.put('users/' + this.editUserForms.id,{
						id:this.editUserForms.id,
						email:this.editUserForms.email,
						mobile:this.editUserForms.mobile
					})
					if(res.meta.status !== 200 ) return this.$message.error('更新失败');
					//更新成功操作
					//1.提示用户成功
					this.$message.success('更新成功');
					//关闭修改信息对话窗口
					this.editdialogVisibles = false;
					//重新渲染页面
					this.getBiaoGe()
				})
			},
			//根据用户的ID删除整行的个人数据
			async deleteData(id){
				//alert(id)
				const ress = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).catch(err=> err)
		        console.log(ress)
		        //确定：confirm  取消：cancel
		        if ( ress != 'confirm' ) return this.$message.info('取消删除')
		        //调用api实现删除数据
		        const {data:rets} = await this.$http.delete('users/' + id )
		        if (rets.meta.status!=200) return this.$message.error('删除数据失败')
		        this.$message.success('删除数据成功')
		        //删除数据成功后重新自动刷新页面
		        this.getBiaoGe()
			},
			//设置分配角色
			async permissionsButton(role){
				//alert(123)
				this.userDatas= role
				//让对话框显示
				this.AssignRolesDialogVisible = true;
				const {data:res} = await this.$http.get('roles')
				if(res.meta.status!=200){
					return this.$message.error('获取失败')
				}
				//this.$message.success('获取成功')
				this.itemDatas = res.data;
				console.log(this.itemDatas)
			},
			//点击确定按钮保存分配后的角色
			async SaveTheRole(){
				//alert(123)
				//防止没修改角色点确定
				if(!this.roleValueId){
					return this.$message.info('请选择设置角色')
				}
				//点击确定按钮之后发送的ajax
				const {data:res} = await this.$http.put(`users/${this.userDatas.id}/role`,{
					rid:this.roleValueId
					
				});
				if(res.meta.status != 200){
					return this.$message.error('设置角色失败');
				}
				this.$message.success('设置角色成功');
				//重新加载页面
				this.getBiaoGe()
				//
				//关闭对话框
				this.AssignRolesDialogVisible = false;
			},
			//监听角色对话框的关闭
			listeningDialog(){
				this.roleValueId = '';
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