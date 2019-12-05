<template>
	<div id="user">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
		  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片-->
		<el-card>
		 	<!--搜索栏-->
		  <!--栅格系统-->
		  <el-row :gutter="60">
			  <el-col :span="10">
			  	<el-input placeholder="请输入内容" v-model='userInfo.query' clearable @clear='getUsersList'>
				    <el-button slot="append" icon="el-icon-search" @click='getUsersList'></el-button>
				  </el-input>
			  </el-col>
			  <el-col :span="6"> 
			  	
			  	<el-button type="primary" @click="open">添加用户</el-button>
			  </el-col>
			</el-row>
		</el-card>
		<!--表格展示数据-->
		<el-table :data='usesList' border stripe>
			<el-table-column label='#' type='index'></el-table-column>
			<el-table-column label='姓名' prop='username'></el-table-column>
			<el-table-column label='邮箱' prop='email'></el-table-column>
			<el-table-column label='电话' prop='mobile'></el-table-column>
			<el-table-column label='角色' prop='role_name'></el-table-column>
			<el-table-column label='状态'>
				<!--作用域插槽-->
				<templat slot-scope='scope'>
					<!--{{ scope.row }}-->
					<el-switch v-model="scope.row.mg_state" @change='stateChange(scope.row)'></el-switch>
				</templat>
			</el-table-column>
			<el-table-column label='操作'>
				<template slot-scope='scope'>
					<!--修改按钮-->
				  <el-button type="primary" icon="el-icon-edit" circle size='mini'></el-button>
				  <!--删除按钮-->
				  <el-button type="danger" icon="el-icon-delete" circle size='mini'></el-button>
				  <!--设置按钮-->
				   <el-tooltip class="item" effect="dark" content="设置角色" placement="top" :enterable='false'>
				   	<el-button type="danger" icon="el-icon-s-tools" circle size='mini'></el-button>
			    </el-tooltip>
				</template>
			</el-table-column>
		</el-table>
		<!--分页功能-->
		<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
   </el-pagination>
   
 
		
	
	
	</div>
	
	
	
</template>

<script>
	export default {
		data(){
			return {
          userInfo:{
          	//要查询用户
          	query:'',
          	//当前的页码(第几页)
          	pagenum:1,
          	//每页展示的数据,默认给2
          	pagesize:2
          },
          	//所有的用户基本数据
          usesList:[],
         	// 总的数据条数
          total:0
			}
		},
		created(){
			this.getUsersList();
		},
		methods:{
			//获取用户列表(表格中的)
			async getUsersList(){
				const {data:res} = await this.$http.get('users',{ params:this.userInfo })
				//console.log(res)
				if(res.meta.status !== 200 ){
					return this.$message.error(res.meta.msg)
				}
				this.usesList = res.data.users;
				this.total = res.data.total;
			},
			async stateChange(datas){
				const {data:res} = await this.$http.put(`users/${datas.id}/state/${datas.mg_state}`)
				console.log(res)
				if(res.meta.status !== 200 ){
					res.data.mg_state = !res.data.mg_state;
					return this.$message.error(res.meta.msg)
				}
				this.$message.success('修改成功')
			},
			handleSizeChange(val){
				//每页展示的数据量
				console.log(val)
				this.userInfo.pagesize = val;
				this.getUsersList();
				
			},
			handleCurrentChange(val){
				//当前页的改变
				console.log(val);
				this.userInfo.pagenum = val;
				this.getUsersList();
			},
			open() {
        this.$alert('<strong>这是 <i>HTML</i> 片段</strong>', '添加用户', {
          dangerouslyUseHTMLString: true
        });
      }
		}
	}
</script>

<style scoped>
	.el-card {
		margin: 10px 0;
	}
	.el-pagination {
		margin-top: 10px;
	}
</style>