<template>
	<div id="list">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!--卡片区域-->
		<el-card>
			<!--搜索添加栏目-->
			<el-row :gutter='20'>
				<el-col :span='8'>
					 <el-input placeholder="请输入内容">
					    <el-button slot="append" icon="el-icon-search"></el-button>
					 </el-input>
				</el-col>
				<el-col :span='5'>
					<el-button type='primary'>添加商品</el-button>
				</el-col>
			</el-row>
			<!--表格展示商品-->
			<el-table :data='goodsList'>
				index(#)
				商品分类
				商品价格(元)
				商品重量(千克)
				创建时间
				操作(编辑和删除)
			</el-table>
		</el-card>
		<!--分页-->
		
	</div>
</template>

<script>
	export default {
		data(){
			return {
				//存储商品列表数据
				goodsList:[],
				queryInfo:{
					query:'',
					pagenum:1,
					pagesize:10
				},
				//总的页数
				total:0
			}
		},
		methods:{
			//获取商品列表数据
			async getGoodsList(){
				const {data:res} = await this.$http.get('goods',{
					params:this.queryInfo
				})
				//console.log(res.data)
				//获取失败判断并提示
				//获取成功
				this.total = res.data.total;
				this.goodsList = res.data.goods
				console.log(this.goodsList)
			}
		},
		created(){
			this.getGoodsList()
		}
	}
</script>

<style>
</style>