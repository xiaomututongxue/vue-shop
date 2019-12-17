<template>
	<div id="roles">
		<!--面包屑导航的展示-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片区域-->
		<el-card>
			<!--表格区域-->
			<el-table :data='rolesList' style='width=100%' border>
				<el-table-column type='expand'>
					<template slot-scope='scope'>
						<!--{{scope.row}}-->
						<el-row :class="['bottomBorder',i1===0?'topBorder':'','ceter']" v-for='(item1,i1) in scope.row.children' :key='item1.id'>
							<!--一级权限-->
							<el-col :span='5'>
								<el-tag type='success'>{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!--二级和三级-->
							<el-col :span='19'>
								<el-row :class="[ i2===0?'':'topBorder','ceter' ]" v-for='(item2,i2) in item1.children' :key='item2.id'>
									<el-col :span='6'>
										<el-tag type='warning'>{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									
									<el-col :span='18' >
										<el-tag type='primary' @close='removRoles()' closable v-for='(item3,i3) in item2.children' :key='item3.id'>{{ item3.authName }}</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type='index' label='#'></el-table-column>
				<el-table-column label="角色名称" prop="roleName" ></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc" ></el-table-column>
				<el-table-column label="操作" width='400'>
					<template slot-scope='scope'>
						<!--编辑角色-->
						<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
						<!--删除角色-->
						<el-button type="success" icon="el-icon-delete" size="mini">删除</el-button>
						
						<!--分配-->
						<el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
						
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
				rolesList:[]
			}
		},
		methods:{
			//获取所有的角色列表数据
			 async getRolesList(){
				const {data:res } = await this.$http.get('roles');
				this.rolesList = res.data;
				console.log(this.rolesList)
			},
			removRoles(){
				alert(1)
			}
		},
		created(){
			this.getRolesList()
		}
	}
</script>

<style scoped>
	.el-tag {
		margin: 7px;
	}
	/*上边框线*/
	.topBorder {
		border-top: 1px solid #eee;
	}
	/*下边框线*/
	.bottomBorder {
		border-bottom: 1px solid #eee;
	}
	/*实现垂直居中的类(小tag)*/
	.ceter {
		display: flex;
		align-items: center;
	}
</style>