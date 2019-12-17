<template>
	<div id="roles">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片-->
		<el-card >
		  <!--表格-->
		   <el-table :data="tableDatas" style="width: 100%" >
		   	  <el-table-column  type='index' label='#'></el-table-column>
		   	  <el-table-column label="权限" type="expand">
		   	 	<!--作用域插槽-->
		   	 	<template slot-scope='scope'>
		   	 		<!--{{scope.row}}-->
		   	 		<el-row :class="['downBorder',i1==0?'topBorder':'','middle']" v-for='(item1,i1) in scope.row.children' :key='item1.id'>
		   	 			<!--一级权限-->
		   	 			<el-col :span='5'>
		   	 				<el-tag type='success' @close='deleteData(scope.row,item1.id)' closable >{{item1.authName}}</el-tag>
		   	 				<i class="el-icon-caret-right"></i>
		   	 			</el-col>
		   	 			<!--二级三级-->
		   	 			<el-col :span='19'>
		   	 				<el-row :class="[i2==0?'':'topBorder','middle']" v-for='(item2,i2) in item1.children' :key='item2.id'>
		   	 					<el-col :span='6'>
		   	 						<el-tag type='warning' @close='deleteData(scope.row,item2.id)' closable >{{item2.authName}}</el-tag>
		   	 						<i class="el-icon-caret-right"></i>
		   	 					</el-col>
		   	 					<el-col :span='18'>
		   	 						<el-tag type='primary' @close='deleteData(scope.row,item3.id)' closable v-for='(item3,i3) in item2.children' :key='item3.id'>{{item3.authName}}</el-tag>
		   	 					</el-col>
		   	 				</el-row>
		   	 			</el-col>
		   	 		</el-row>
		   	 	</template>
		   	  </el-table-column>
		   	  <el-table-column  prop='roleName' label='角色名称'></el-table-column>
		   	  <el-table-column  prop='roleDesc' label='角色描述'></el-table-column>
		   	  <el-table-column   label='操作'>
		   	  	<template slot-scope='scope'>
			   	  	<!--编辑角色-->
			   	  	<el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
			   	  	<!--删除权限-->
					<el-button type="success" icon="el-icon-delete" size='mini'>删除</el-button>
					<!--分配-->
					<!--assignPermissions：分配权限-->
					<el-button @click='assignPermissions(scope.row)' type="warning" icon="el-icon-share" size='mini'>分配权限</el-button>
				</template>
		   	  </el-table-column>
		   </el-table>
		</el-card>
		<!--分配权限的对话框-->
		<el-dialog @close='permissionsClose' title="分配权限" :visible.sync="distributionDialogVisible" width="30%">
		  <!--权限列表展示-->
		  <el-tree ref='treeRef' :default-checked-keys="treeArrKeys"  node-key="id" default-expand-all  show-checkbox :data="treeLists" :props="treeProps"></el-tree>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="distributionDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="determine">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				tableDatas:[],
				distributionDialogVisible:false,
				treeLists:[],
				treeProps:{
					children :'children',
					label :'authName'
				},
				treeArrKeys:[],
				//储存角色id
				rolesId:''
			}
		},
		created(){
			this.getRolesData()
		},
		methods:{
			//获取角色列表数据
			async getRolesData(){
				const {data:res} = await this.$http.get('roles')
				this.tableDatas = res.data
				console.log(this.tableDatas)
			},
//			删除指定权限
			async deleteData(role,rightsId){
				//alert(123)
				const ret = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		       	}).catch(err => err)
		       	if(ret != 'confirm' ) return this.$message.info('取消删除')
		       	//调用api接口
		       	const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
		       	if(res.meta.status !== 200){
		       		return this.$message.error('操作失败')
		       	}
		       	//删除成功后重新加载页面
		       	this.$message.success('删除成功')
//		       	不加载页面
		       	//this.getRolesData()
		       	//加载页面
		       	role.children = res.data
			},
			//分配权限
			async assignPermissions(role){
				//储存角色id
				this.rolesId = role.id
				const {data:res} = await this.$http.get('rights/tree')
				if(res.meta.status !==200) {
					return this.$message.error('获取失败')
				}
				this.treeLists = res.data
				//调用递归
				this.getRightsChecked(role,this.treeArrKeys)
				console.log(this.treeArrKeys)
				this.distributionDialogVisible = true
			},
			getRightsChecked(node,arr){
				//node节点  arr数组
				if(!node.children){
					return arr.push(node.id)
				}
				node.children.forEach(item => {
					//操作递归
					this.getRightsChecked(item,arr)
				})
				
			},
			//监听权限分配de对话框关闭
			permissionsClose(){
				this.treeArrKey = []
			},
			//点击确定按钮，实现权限分配
			async determine(){
//				alert(123)
				//获取全选和非全选
				const arr = [
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedKeys()
				]
				console.log(arr)
				const stringArr = arr.join(',')
				console.log(stringArr)
				//发送ajax请求
				/*const {data:res} = await this.$http.post(`roles/${this.rolesId}/rights`,{
					rids:stringArr
				})*/
				const {data:res} = await this.$http.post(`roles/${this.rolesId}/rights`,{
				 	rids:stringArr
				})
				if(res.meta.status !== 200){
					return this.$message.error('更新失败')
				}
				this.$message.success('更新成功')
				this.getRolesData()
				this.distributionDialogVisible = false
			}
		}
	}
</script>

<style>
	.el-tag {
		margin: 10px;
	}
	/*shangbiankuangxian*/
	.topBorder {
		border-top: 1px solid #CCCCCC;
	}
	/*下边框线*/
	.downBorder {
		border-top: 1px solid #CCCCCC;
	}
	.middle {
		display: flex;
		align-items: center;
	}
</style>