<template>
	<div id="params">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>分类参数</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片-->
		<el-card class="box-card">
			<!--提示文字-->
		  <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
		  <!--选择商品分类的级联选择器-->
		  <el-row>
		  	<el-col>
		  		<span>选择商品分类</span>
		  		<el-cascader v-model="cascaderValue" :options="cascaderOptions" :props="cascaderProps" @change="cascaderChange">
				</el-cascader>
		  	</el-col>
		  </el-row>
		  <!--选择Tabs标签页-->
		  <el-tabs v-model="tabsActiveName" @tab-click="tabsHandleClick">
		  	<!--动态参数-->
		    <el-tab-pane label="动态参数" name="many">
		    	<el-button type="primary"  :disabled="forbiddenButton" @click="adddialogVisible=true">添加参数</el-button>
		    	<el-table :data="dynamicTableData" style="width: 100%">
		    		<!--展开行-->
				    <el-table-column type="expand">
				    	<template slot-scope='scope'>
				    		<el-tag :key="i" v-for="(item,i) in scope.row.attr_vals" closable  @close="handleClose(i,scope.row)">
							  {{item}}
							</el-tag>
							<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue"
							  ref="saveTagInput"
							  size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
							  @blur="handleInputConfirm(scope.row)"
							>
							</el-input>
							<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

				    	</template>
				    </el-table-column>
				    <el-table-column type="index" label="#"></el-table-column>
				    <el-table-column prop="attr_name" label="参数名称"></el-table-column>
				    <el-table-column label="操作">
				    	<template slot-scope='scope'>
					    	<el-button type="primary" round>编辑</el-button>
					    	<el-button type="danger" round>删除</el-button>
				    	</template>
				    </el-table-column>
			    </el-table>
		    </el-tab-pane>
		    <el-tab-pane label="静态属性" name="only">
		    	<el-button type="primary"  :disabled="forbiddenButton" @click="adddialogVisible=true">添加属性</el-button>
		    	<el-table :data="onlydynamicTableData" style="width: 100%">
				    <el-table-column type="expand">
				    	<template slot-scope='scope'>
				    		<el-tag :key="i" v-for="(item,i) in scope.row.attr_vals" closable  @close="handleClose(i,scope.row)">
							  {{item}}
							</el-tag>
							<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue"
							  ref="saveTagInput"
							  size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
							  @blur="handleInputConfirm(scope.row)"
							>
							</el-input>
							<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

				    	</template>
				    </el-table-column>
				    <el-table-column type="index" label="#"></el-table-column>
				    <el-table-column prop="attr_name" label="参数名称"></el-table-column>
				    <el-table-column label="操作">
				    	<template slot-scope='scope'>
					    	<el-button type="primary" round>编辑</el-button>
					    	<el-button type="danger" round>删除</el-button>
				    	</template>
				    </el-table-column>
			    </el-table>
		    </el-tab-pane>
		  </el-tabs>
		</el-card>
		<!--添加参数对话框-->
		<el-dialog :title="'添加'+addParameter" :visible.sync="adddialogVisible" width="30%">
		  
		  <!--form表单-->
		  <el-form :model="addruleForm" :rules="addruleFormrules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
			  <el-form-item :label="'添加'+addParameter" prop="attr_name">
			    <el-input v-model="addruleForm.attr_name"></el-input>
			  </el-form-item>
		  </el-form>
		  
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="adddialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="adddialogVisible = false">确 定</el-button>
		  </span>
		</el-dialog> 	
		
	</div>
</template>

<script>
	export default {
		data(){
			return {
				//存放级联选择框中分类的id分类;
				cascaderValue:[],
				//存放分类数据
				cascaderOptions:[],
				//级联选择框的配置
				cascaderProps:{
					expandTrigger:'hover',
					checkStrictly:'true',
					value:'cat_id',
					label:'cat_name',
					children:'children'
				},
				tabsActiveName:'many',
				//动态数据
				dynamicTableData:[],
				//静态属性
				onlydynamicTableData:[],
				//控制添加参数的弹话框的显示与隐藏
				adddialogVisible:false,
				//添加参数
				addruleForm:{
					attr_name:''
				},
				//校验规则
				addruleFormrules:{
					attr_name:[
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				inputVisible:false,
				inputValue:''
				
			}
		},
		methods:{
			//获取分类数据
			async acquireClassifyData(){
				const {data:res} = await this.$http.get('categories');
				if(res.meta.status != 200){
					return this.$message.error('获取失败')
				}
				this.cascaderOptions = res.data;
				//console.log(this.cascaderOptions)
			},
			//标签页tabs发生改变时的方法
			tabsHandleClick(){
				//console.log(this.cascaderValue)
				//根据数组的长度确定是否是3级分类
				this.getParameters()
			},
			//级联选择框发生改变触发的事件
			cascaderChange(){
				this.getParameters()
			},
			//获取参数的方法
			async getParameters(){
				//console.log(this.cascaderValue)
				//根据数组的长度确定是否是3级分类
				if(this.cascaderValue.length !== 3){
					this.cascaderValue = []
					return;
				}
				//console.log(getCateId)
				//console.log(this.tabsActiveName)
				//获取参数
				const {data:res} = await this.$http.get(`categories/${this.getCateId}/attributes`,{
					params:{sel:this.tabsActiveName}
				})
				if(res.meta.status != 200){
					return this.$message.error('获取失败')
				}
				//console.log(res.data)
				//把字符串转成以空格隔开的数组
				res.data.forEach(item=>{
					item.attr_vals = item.attr_vals.split(' ')
				})
				console.log(res.data)
				
				if(this.tabsActiveName == 'many'){
					this.dynamicTableData = res.data
				}else{
					this.onlydynamicTableData = res.data
				}
				
			},
			//删除展开行的参数
			async handleClose(i,row){
				//alert(123)
				row.attr_vals.splice(i,1)
				this.updatalest(row)
			},
			//
			async handleInputConfirm(row){
				//console.log(123)
				
				if(this.inputValue.trim().length == 0){
					this.inputVisible = false
					this.inputValue = ''
					return;
				}
				row.attr_vals.push(this.inputValue.trim())
				
				this.inputVisible = false
				this.inputValue = ''
				//添加成功
				this.updatalest(row)
			},
			showInput(){
				//console.log(789)
				this.inputVisible = true
				 this.$nextTick(_ => {
			          this.$refs.saveTagInput.$refs.input.focus();
			     })
			},
			async updatalest(row){
				const {data:res} = await this.$http.put(`categories/${this.getCateId}/attributes/${row.attr_id}`,{
					attr_name:row.attr_name,
					attr_sel:row.attr_sel,
					attr_vals:row.attr_vals.join(' ')
				})
				console.log(res.data);
				if(res.meta.status != 200){
					return this.$message.error('更新失败')
				}
				this.$message.success('更新成功')
			}
		},
		//生命周期钩子函数
		created(){
			this.acquireClassifyData()
		},
		//计算属性
		computed:{
			getCateId(){
				if (this.cascaderValue.length == 3) {
					return this.cascaderValue[2]
				}
			},
			//添加参数按钮是否禁用
			 forbiddenButton(){
			 	if (this.cascaderValue.length == 3) {
					return false
				}
			 	return true
			 },
			 addParameter(){
			 	if(this.tabsActiveName == 'many'){
			 		return '参数'
			 	}
			 	return '属性'
			 }
		}
	}
</script>

<style scoped="scoped">
	.el-col {
		margin: 12px 0;
	}
</style>