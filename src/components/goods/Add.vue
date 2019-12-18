<template>
	<div id="add">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>添加列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片-->
		<el-card>
			<el-alert :closable="false" title="添加商品信息" type="info" center show-icon></el-alert>
			<!--步骤条-->
			<el-steps :space="200" :active="activeName -0" finish-status="success" align-center>
			  <el-step title="基本信息"></el-step>
			  <el-step title="商品参数"></el-step>
			  <el-step title="商品属性"></el-step>
			  <el-step title="商品图片"></el-step>
			  <el-step title="商品内容"></el-step>
			  <el-step title="完成"></el-step>
			</el-steps>
			<!--标签页-->
			<el-form label-position='top' :model="ruleForm" :rules="rules" ref="addRuleForm" label-width="100px" class="demo-ruleForm">
				<el-tabs @tab-click='tabClick' :before-leave='beforLeave' :tab-position="'left'" v-model="activeName">
				    <el-tab-pane label="基本信息" name='0'>
				    	<el-form-item label="商品名称" prop="goods_name">
						   <el-input v-model="ruleForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
						   <el-input v-model="ruleForm.goods_price" type='number'></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
						   <el-input v-model="ruleForm.goods_number" type='number'></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
						   <el-input v-model="ruleForm.goods_weight" type='number'></el-input>
						</el-form-item>
						<!--级联选择器-->
						<el-form-item label="选择分类">
						    <el-cascader
							    v-model="ruleForm.goods_cat"
							    :options="allOptions"
							    :props="cascaderProp"
							    @change="handleChange">
							</el-cascader>
						</el-form-item>
				    </el-tab-pane>
				    <el-tab-pane label="商品参数" name='1'>
				    	<el-form-item :label="item.attr_name" v-for='item in manyList' :key='item.attr_id'>
				    		<el-checkbox-group v-model="item.attr_vals">
								 <el-checkbox border :label="list" v-for='(list,i) in item.attr_vals' :key='i'></el-checkbox>
							</el-checkbox-group>
				    	</el-form-item>
				    </el-tab-pane>
				    <el-tab-pane label="商品属性" name='2'>
				    	<el-form-item :label="item.attr_name" v-for='item in onlyList' :key='item.attr_i'>
				    		
				    		<el-input v-model='item.attr_vals'></el-input>
				    	</el-form-item>
				    	</el-form-item>
				    </el-tab-pane>
				    <el-tab-pane label="商品图片" name='3'>
				    	<!--上传图片-->
				    	<el-upload 
				    	  :on-success='successImg'
				    	  class="upload-demo"
				    	  :action="uploadAction"
				    	  :headers='headersToken'
						  :on-preview="handlePreview"
						  :on-remove="handleRemove"
						  list-type="picture">
						  <el-button size="small" type="primary">点击上传</el-button>
						  
						</el-upload>
				    </el-tab-pane>
				    <el-tab-pane label="商品内容" name='4'>
				    	<quill-editor v-model='ruleForm.goods_introduce'></quill-editor>
				    	<el-button type="primary" @click='addCommodity'>添加商品</el-button>
				    </el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>
		<el-dialog title="预览" :visible.sync="dialogVisibles" width="50%">
		  <img :src="imgs" class="imgs"/>
		</el-dialog>

	</div>
	
</template>

<script>
	import _ from 'lodash'
	export default {
		data(){
			return {
				//步骤条当前的进度
				activeName:'0',
				ruleForm:{
					goods_name:'',//商品名称
					goods_price:0,//商品价格
					goods_weight:0,//商品重量
					goods_number:0,//商品数量
					//分类列表
					goods_cat:[],
					pics:[],
					goods_introduce:'',
					attrs:[]
				},
				//校验规则
				rules:{
					goods_name:[{ required: true, message: '请输入商品名称', trigger: 'blur' }],
					goods_price :[{ required: true, message: '请输入商品价格', trigger: 'blur' }],
					goods_number :[{ required: true, message: '请输入商品数量', trigger: 'blur' }],
					goods_weight:[{ required: true, message: '请输入商品重量', trigger: 'blur' }],
				},
				//级联选择器的配置
				cascaderProp:{
					expandTrigger:'hover',
					label:'cat_name',
					value:'cat_id',
					children:'children'
				},
				//所有商品分类
				allOptions:[],
				manyList:[],//参数数据
				onlyList:[],//属性数据
				//上传路径
				uploadAction:"http://127.0.0.1:8888/api/private/v1/upload",
				//配置token
				headersToken:{
					Authorization:window.sessionStorage.getItem('token')
				},
				//预览大图窗口开关与关闭
				dialogVisibles:false,
				//预览大图的地址
				imgs:''
			}
		},
		methods:{
			//级联选择器的事件
			handleChange(){
				console.log(123)
				console.log(this.ruleForm.goods_cat)
				//只允许选择三级
				if(this.ruleForm.goods_cat.length !== 3){
					this.ruleForm.goods_cat = []
					return
				}
			},
			//获取商品列表
			async getGoodsList(){
				const {data:res} = await this.$http.get('categories')
				if(res.meta.status != 200){
					return this.$message.error('获取失败')
				}
				this.allOptions = res.data
				console.log(this.allOptions)
			},
			//监听标签页发生的改变
			beforLeave(activeName,oldActiveName){
				//console.log(activeName)
				//判断是否选择三级分类
				//return false
				if(oldActiveName == '0' && this.ruleForm.goods_cat.length == 0){
					this.$message.info('请选择三级分类')
					//return false
				}
			},
			async tabClick(){
				//console.log(1)
				//console.log(this.activeName)
				if(this.activeName == '1'){
					const {data:res} = await this.$http.get(`categories/${this.getId}/attributes`,{
						params:{sel:'many'}
					})
					if(res.meta.status != 200){
						return this.$message.error('获取失败')
					}
					//字符串专程数组
					res.data.forEach(item=>{
						item.attr_vals = item.attr_vals.split(' ')
					})
					console.log(res.data)
					this.manyList = res.data
				}else if(this.activeName == '2'){
					const {data:res} = await this.$http.get(`categories/${this.getId}/attributes`,{
						params:{sel:'only'}
					})
					if(res.meta.status != 200){
						return this.$message.error('获取失败')
					}
					this.onlyList = res.data
				}
			},
			//点击图片上传
			handlePreview(file){
				console.log(123)
				console.log(file)
				this.dialogVisibles = true
				this.imgs = file.response.data.url
			},
			//删除图片
			handleRemove(file){
				console.log(321)
				console.log(file)
				//临时存储的路径
				const temPath = file.response.data.tmp_path
				const i = this.ruleForm.pics.findIndex(x => {
					x.pic == temPath
				})
				this.ruleForm.pics.splice(i,1)
				console.log(this.ruleForm)
			},
			//图片上传成功以后的存储路径
			successImg(response){
				console.log(response)
				const responseObj = {
					pic:response.data.tmp_path
				}
				this.ruleForm.pics.push(responseObj)
				console.log(this.ruleForm)
			},
			
			addCommodity(){
				console.log(123456789)
				//表单预校验
				this.$refs.addRuleForm.validate(async vali=>{
					if(!vali){
						return this.$message.error('请输入内容')
					}
					console.log('ojbk')
					
					const form = _.cloneDeep(this.ruleForm)
					
					form.goods_cat = form.goods_cat.join(',')
					
					this.manyList.forEach(item=>{
						const obj = {
							attr_id:item.attr_id,
							attr_value:item.attr_vals.join(' ')
						}
						this.ruleForm.attrs.push(obj)
					})
					this.onlyList.forEach(item=>{
						const obj = {
							attr_id:item.attr_id,
							attr_value:item.attr_vals
						}
						this.ruleForm.attrs.push(obj)
					})
					form.attrs = this.ruleForm.attrs
					console.log(form)
					//调用api接口
					const {data:res} = await this.$http.post('goods',form)
					if(res.meta.status !== 201){
						return this.$message.error('创建商品失败')
					}
					this.$message.success('创建成功');
					this.$router.push('/goods')

				})
			}
		},
		created(){
			this.getGoodsList()
		},
		//计算属性
		computed:{
			getId(){
				if(this.ruleForm.goods_cat.length === 3){
					return this.ruleForm.goods_cat[2]
				}
				
			}
		}
	}
</script>

<style scoped="scoped">
	.el-steps {
		margin: 15px 0;
	}
	.imgs {
		width: 100%;
	}
</style>