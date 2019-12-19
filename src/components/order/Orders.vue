<template>
	<div id="orders">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
		  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片-->
		<el-card>
			<el-input
			  placeholder="请输入内容"
			  v-model="input"
			  clearable>
			</el-input>
			<el-button type="primary" icon="el-icon-search">搜索</el-button>
			
			<el-table :data="tableData" border style="width: 100%">
			    <el-table-column type='index' label="#"></el-table-column>
			   
			    <el-table-column prop="order_number" label="订单编号" ></el-table-column>
			      
			    <el-table-column prop="order_price" label="订单价格"></el-table-column>
			    
			    <el-table-column prop="order_pay" label="是否付款">
			    	<template slot-scope='scope'>
			    		<el-tag v-if='scope.row.order_pay == 1'>已付款</el-tag>
			    		<el-tag v-else type="danger">未付款</el-tag>
			    	</template>
			    </el-table-column>
			    
			    <el-table-column prop="is_send" label="是否发货"></el-table-column>
			  
			    <el-table-column prop="update_time" label="下单时间">
			    	<template slot-scope='scope'>
			    		{{scope.row.update_time | dateFilter}}
			    	</template>
			    </el-table-column>
			     
			    <el-table-column label="操作">
			      	<el-button type="primary" size='mini'>
			      		<i class="el-icon-edit"></i>
			      	</el-button>
  					<el-button type="success" size='mini'>
  						<i class='el-icon-location'></i>
  					</el-button>
			    </el-table-column>
			</el-table>
			<!--分页功能-->
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="queryInfo.pagenum"
		      :page-sizes="[1, 2, 3, 4, 5,]"
		      :page-size="queryInfo.pagesize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total">
		    </el-pagination>
		</el-card>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				input:'',
				tableData:[],
				queryInfo:{
					//查询参数
					query:'',
					//当前页码
					pagenum:1,
					//每页显示的条数
					pagesize:5
				},
				total:0
			}
		},
		methods:{
			async getData(){
				const {data:res} = await this.$http.get('orders',{
					params:this.queryInfo
				})
				console.log(res.data)
				if (res.meta.status !=200 ) {
					return this.$message.error('获取失败')
				}
				//this.total = res.data.total
				this.tableData = res.data.goods
				this.total = res.data.total
				console.log(this.tableData)
			},
			//每页展示条数的改变
			handleSizeChange(val){
				console.log(val)
				this.queryInfo.pagesize = val
				this.getData()
			},
			//当前显示的是第几页
			handleCurrentChange(val){
				console.log(val)
				this.queryInfo.pagenum = val
				this.getData()
			}
		},
		created(){
			this.getData()
		}
	}
</script>

<style scoped="scoped">
	.el-input {
		width: 50%;
		padding-right: 15px;
	}
	.el-table {
		margin-top: 15px;
	}
</style>