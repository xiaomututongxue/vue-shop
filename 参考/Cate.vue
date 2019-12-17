<template>
	<div id="cate">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品分类列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片区域-->
		<el-card>
		<!--添加分类按钮-->
		<el-row>
			<el-col :span='5'>
				<el-button type='success'>添加分类</el-button>
			</el-col>
		</el-row>
		<!--展示分类-->
			<tree :data='cateList' :columns="columns" index-text="#" show-index :show-row-hover="false">
				<!--是否有效-->
				<template slot="isOk" scope="scope">
					<!--<pre>
						
						{{scope.row.cat_deleted}}
					</pre>-->
					<i class="el-icon-error" style="color: orange;font-size: 20px;" v-if='scope.row.cat_deleted === false'></i>
        	<i class="el-icon-success" style="color: green;font-size: 20px;" v-else></i>
      	</template>
      	<!--排序-->
      	<template slot='level' scope="scope">
      		<el-tag type='warning' v-if="scope.row.cat_level===0">一级</el-tag>
      		<el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
      		<el-tag type="primary" v-else>三级</el-tag>
      	</template>
      	<!--操作-->
      	<template slot="setting" scope="scope">
      		<el-button type="warning" size="mini" class="el-icon-edit">编辑</el-button>
      		<el-button type="success" size="mini" class="el-icon-delete">删除</el-button>
      	</template>
			</tree>
		<!--分页展示-->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="cateInfo.pagenum"
      :page-sizes="[1, 2, 3, 5]"
      :page-size="cateInfo.pagesize"
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
				cateInfo:{
					type:3,
					pagenum:1,
					pagesize:5
				},
				//分类列表数据存储
				cateList:[],
				//保存总的数据条数
				total:0,
				//每一列展示的数据
				columns:[
					{
						label: '分类名称',
						prop: 'cat_name',
					},
					{
						label: '是否有效',
						prop: 'cat_deleted',
						type: 'template',
            template: 'isOk',
					},
					{
						label: '排序',
						prop: 'cat_level',
						type: 'template',
            template: 'level',
					},
					{
						label:'操作',
						type: 'template',
            template: 'setting',
					}
				],
			}
		},
		methods:{
			//每页展示数据条数的改变
			handleSizeChange(val){
				//console.log(val)
				this.cateInfo.pagesize = val;
				this.getCateList();
			},
			//当前显示第几页
			handleCurrentChange(val){
				//console.log(val)
				this.cateInfo.pagenum = val;
				this.getCateList();
			},
			//获取商品分类
			async getCateList(){
				const {data:res} = await this.$http.get('categories',{
					params:this.cateInfo
				})
				if(res.meta.status !== 200 ){
					return this.$message.error('获取失败')
				}
				this.cateList = res.data.result;
				this.total = res.data.total;
				console.log( this.cateList )
			}
		},
		created(){
			this.getCateList()
		},
	}
</script>

<style scoped>
	.color {
		color:orange
	}
</style>