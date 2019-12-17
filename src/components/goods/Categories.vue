<template>
	<div id="categories">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品分类列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片-->
		<el-card >
			<!--添加分类按钮-->
		  <el-row>
		  	<el-col :span='5'>
		  		<el-button @click='addClassify' type="primary">添加分类</el-button>
		  	</el-col>
		  </el-row>
		  <!--展示分类-->
		  <tree :data="dataList" :columns="columns" index-text="#" show-index :show-row-hover="false" :expand-type="false" :selection-type="false">
		  	<!--是否有效-->
		  	<template slot='isOk' slot-scope="scope">
		  		<!--{{scope.row.cat_deleted}}-->
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
		      :current-page="catInfo.pagenum"
		      :page-sizes="[1, 2, 3, 4, 5]"
		      :page-size="catInfo.pagesize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total">
		   </el-pagination>
		   
		</el-card>
		<!--点击添加分类按钮弹出来的对话框-->
		<el-dialog @close="addDialog" title="添加分类" :visible.sync="addClassifyDialogVisible" width="50%">
		  
		  <el-form :model="addruleForm" :rules="rulesFrom" ref="ruleFormRef" label-width="100px" >
			  
			  
			  <el-form-item label="等级分类">
			    <el-cascader clearable v-model="cascaderValue" :options="cascaderOptions" :props='cascaderProps'
				change-on-select @change="cascaderChenge"></el-cascader>
			  </el-form-item>
			  <el-form-item label="分类名称" prop="cat_name">
			    <el-input v-model="addruleForm.cat_name"></el-input>
			  </el-form-item>
		 </el-form>
		 
		 
		  
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addClassifyDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="confirm">确 定</el-button>
		  </span>
		</el-dialog>
		
	</div>
</template>

<script>
	export default {
		data(){
			return {
				catInfo:{
					type:3,
					pagenum:1,
					pagesize:5
				},
				//分页列表数据存储
				dataList:[],
				//保存总的数据条数
				total:0,
				//每一页展示的数据
				 columns: [
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
			    //点击控制按钮让对话框隐藏和显示
			    addClassifyDialogVisible:false,
			    //
			    addruleForm:{
			    	//分类名称
			    	cat_name:'',
			    	//父级id
			    	cat_pid:0,
			    	//分类层级
			    	cat_level:0
			    },
			    //校验规则
			    rulesFrom:{
			    	cat_name: [
			            { required: true, message: '请输入分类名称', trigger: 'blur' }
			        ]
			    },
			    //父级分类
			    cascaderOptions:[],
			   //级联选择框配置
			    cascaderProps:{
			    	checkStrictly:"true",
			    	expandTrigger:"hover",
			    	value:"cat_id",
					label:"cat_name",
					children:"children"
			    },
			    cascaderValue:[]
			}
		},
		methods:{
			//每页展示数据条数改变
			handleSizeChange(val){
				console.log(val)
				this.catInfo.pagesize = val;
				this.getCateList();
			},
			//当前显示第几页
			handleCurrentChange(val){
				//console.log(val)
				this.catInfo.pagenum = val;
				this.getCateList();
			},
			//获取商品分类
			async getCateList(){
				const {data:res} = await this.$http.get('categories',{
					params:this.catInfo
				})
				if(res.meta.status != 200){
					return this.$message.error('获取失败')
				}
				this.dataList = res.data.result;
				this.total = res.data.total;
				//console.log( this.dataList )
			},
			//点击添加分类按钮
			async addClassify(){
				const {data:res} = await this.$http.get('categories',{params:{type:2}})
				if(res.meta.status != 200){
					return this.$message.error('获取失败')
				} 
				this.cascaderOptions = res.data
				//console.log(res.data)
				this.addClassifyDialogVisible = true
			},
			//级联选择器内容改变触发的事件
			cascaderChenge(){
				
				console.log(this.cascaderValue)
				//选择了父级分类
				if (this.cascaderValue.length > 0) {
					//证明有
					this.addruleForm.cat_pid = this.cascaderValue[this.cascaderValue.length-1]
					this.addruleForm.cat_level = this.cascaderValue.length 
				} else{
					//没有选择父级分类
					this.addruleForm.cat_pid = 0
					this.addruleForm.cat_level = 0
				}
				this.cascaderValue.length > 0
			},
			//监听添加分类对话框关闭事件
			addDialog(){
				//重置表单
				this.$refs.ruleFormRef.resetFields()
				this.cascaderValue = []
			},
			//点击确定按钮实现添加分类
			confirm(){
				//alert(123)
				console.log(this.addruleForm)
				//预校验
				this.$refs.ruleFormRef.validate( async val =>{
					if (!val) return
					const {data:res} = await this.$http.post('categories',this.addruleForm)
					if(res.meta.status != 201){
						return this.$message.error('创建失败')
					}
					//成功
					this.$message.success('创建成功')
					this.getCateList()
					this.addClassifyDialogVisible = false
				})
			}
		},
		created(){
			this.getCateList()
		}
	}
</script>

<style scoped="scoped">
	.color {
		color:orange
	}
	.el-cascader {
		width: 100%;
	}
	.tree {
		margin: 10px 0;
	}
</style>