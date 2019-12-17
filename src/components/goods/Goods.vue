<template>
	<div id="goods">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片-->
		<el-card class="box-card">
			<!--添加搜索栏目-->
			<el-row :gutter="20">
				<el-col :span="10">
					<el-input v-model="input" placeholder="请输入内容">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				<el-col :span="5">
					<el-button type="primary">添加商品</el-button>
				</el-col>
			</el-row>
			<!--表格展示商品-->
			 <el-table :data="tableData" style="width: 100%" border>
		      <el-table-column label="#" type="index" width="50"></el-table-column>
		      <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
		      <el-table-column prop="goods_price" label="商品价格(元)" width="150"></el-table-column>
		      <el-table-column prop="goods_weight" label="重量(克)" width="100"></el-table-column>
		      <el-table-column prop="add_time" label="创建时间" width="150"></el-table-column>
		      <el-table-column  label="操作" width="150">
		      	 <el-button type="primary" icon="el-icon-edit" circle></el-button>
		      	 <el-button type="danger" icon="el-icon-delete" circle></el-button>
		      </el-table-column>
		      
		    </el-table>
		</el-card>
		<!--分页-->
		<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				input:'',
				tableData:[],
				queryInfo:{
					query:'',
					pagenum:1,
					pagesize:5
				},
				total:0
			}
		},
		methods:{
			//获取商品列表展示
			async getGoodsList(){
				const { data:res } = await this.$http.get('goods',{
					params:this.queryInfo
				})
				console.log(res.data)
				if(res.meta.status != 200){
					return this.$message.error('获取失败')
				}
				//this.$message.info('获取成功')
				this.total = res.data.total
				this.tableData = res.data.goods
				console.log(this.tableData)
			},
			handleSizeChange(val){
				console.log(val)
				this.queryInfo.pagesize = val
				this.getGoodsList()
			},
			handleCurrentChange(val){
				console.log(val+'a')
				this.queryInfo.pagenum = val
				this.getGoodsList()
			}
		},
		created(){
			this.getGoodsList()
		}
	}
</script>

<style scoped>
	.el-table {
		margin-top: 20px;
	}
</style>