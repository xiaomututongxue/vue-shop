<template>
	<div id="add">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片区域-->
		<el-card>
			<!--消失提示-->
			 <el-alert title="添加商品信息" type="info" center show-icon :closable='false'></el-alert>
			 <!--步骤条
			 	active控制当前进度项,从下标0开始
			 	align-center居中显示
			 	activeName需要是一个数值类型
			 	'0'- 0 = 0
			 -->
			 <el-steps :space="200" :active="activeName -0 " finish-status="success" align-center>
				  <el-step title="基本信息"></el-step>
				  <el-step title="商品参数"></el-step>
				  <el-step title="商品属性"></el-step>
				  <el-step title="商品图片"></el-step>
				  <el-step title="商品内容"></el-step>
				  <el-step title="完成"></el-step>
				</el-steps>
				<!--标签页
					activeName:字符串类型
				-->
				<el-form label-position='top' :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
					<el-tabs @tab-click='tabClick' :before-leave='beforLeave' :tab-position="'left'" v-model="activeName">
				    <el-tab-pane label="基本信息" name='0'>
				  			 <el-form-item label="商品名称" prop="goods_name">
								    <el-input v-model="addForm.goods_name"></el-input>
								 </el-form-item>
								 <el-form-item label="商品价格" prop="goods_price">
								    <el-input v-model="addForm.goods_price" type='number'></el-input>
								 </el-form-item>
								 <el-form-item label="商品重量" prop="goods_weight">
								    <el-input v-model="addForm.goods_weight" type='number'></el-input>
								 </el-form-item><el-form-item label="商品数量" prop="goods_number">
								    <el-input v-model="addForm.goods_number" type='number'></el-input>
								 </el-form-item>
								 <!--级联选择器-->
								 <el-form-item label="选择分类">
									 <el-cascader
									    v-model="addForm.goods_cat"
									    :options="cateList"
									    :props="cascaderProp"
									    @change="handleChange">
								   </el-cascader>
								 </el-form-item>
								 
				    </el-tab-pane>
				    <el-tab-pane label="商品参数" name='1'>
				    	<el-form-item :label="item.attr_name" v-for='item in manyCateList' :key='item.attr_id'>
									<el-checkbox-group v-model="item.attr_vals">
									    <el-checkbox border :label="list" v-for='(list,i) in item.attr_vals' :key='i'></el-checkbox>
									</el-checkbox-group>
							</el-form-item>
				    </el-tab-pane>
				    <el-tab-pane label="商品属性" name='2'>
				    	<el-form-item :label='item.attr_name' v-for='item in onlyCateList' :key='item.attr_i'>
				    		<el-input v-model='item.attr_vals'></el-input>
				    	</el-form-item>
				    </el-tab-pane>
				    <el-tab-pane label="商品图片" name='3'>商品图片</el-tab-pane>
				    <el-tab-pane label="商品内容" name='4'>商品内容</el-tab-pane>
				  </el-tabs>
				</el-form>
		</el-card>
	</div>
	
</template>

<script>
	
	export default {
		data(){
			return {
				//步骤条当前进度
				activeName:'0',
				//添加商品对象
				addForm:{
					goods_name:'',//商品名称
					goods_price:0,//商品价格
					goods_weight:0,//商品重量
					goods_number:0,//商品数量
					//分类列表
					goods_cat:[],
				},
				//检验规则
				addFormRules:{
					goods_name:[ { required: true, message: '请输入商品名称', trigger: 'blur' }],
					goods_price:[ { required: true, message: '请输入商品价格', trigger: 'blur' }],
					goods_weight:[ { required: true, message: '请输入商品重量', trigger: 'blur' }],
					goods_number:[ { required: true, message: '请输入商品数量', trigger: 'blur' }],
					
				},
				//级联选择器的配置
				cascaderProp:{
					expandTrigger:'hover',
					label:'cat_name',
					value:'cat_id',
					children:'children'
				},
				//所有商品分类
				cateList:[],
				//参数数据
				manyCateList:[],
				//属性数据
				onlyCateList:[]
			}
		},
		methods:{
			//级联选择器发生改变的事件
			handleChange(){
				console.log(1)
				console.log(this.addForm.goods_cat)
				//只允许用户选择三级分类
				if(this.addForm.goods_cat.length !== 3){
					this.addForm.goods_cat = []
					return
				}
			},
			//获取商品的所有分类数据
			async getCateList(){
				const {data:res} = await this.$http.get('categories')
				if(res.meta.status !== 200){
					return this.$message.error('或是失败')
				}
				this.cateList = res.data;
				console.log(this.cateList)
			},
			//监听标签页发生切换
			beforLeave(activeName,oldActiveName){
				//console.log(activeName + '-----') //1 ,进入的标签页
				//console.log(oldActiveName + '+++++') //0 ,离开的标签页
				//return false;
				//判断用户是否选择了三级分类
				if(oldActiveName === '0' && this.addForm.goods_cat.length === 0){
					this.$message.info('请选择三级分类')
					return false;
				}
			},
			async tabClick(){
				//console.log('ok')
				console.log(this.activeName)
				if(this.activeName === '1'){//商品参数标签页
					const {data:res} = await this.$http.get(`categories/${this.getCateId}/attributes`,{
						params:{sel:'many'}
					})
					if(res.meta.status !== 200){
						return this.$message.error('获取失败')
					}
					//把字符串转成数组
					res.data.forEach( item=>{
						item.attr_vals = item.attr_vals.split(' ')
					})
					console.log(res.data)
					this.manyCateList = res.data
				}else if(this.activeName === '2'){//商品属性标签页
					//console.log('okk')
					const {data:res} = await this.$http.get(`categories/${this.getCateId}/attributes`,{
						params:{sel:'only'}
					})
					if(res.meta.status !== 200){
						return this.$message.error('获取失败')
					}
					console.log(res.data)
					this.onlyCateList = res.data;
				}
			}
		},
		created(){
			this.getCateList()
		},
		computed:{
			getCateId(){
				if(this.addForm.goods_cat.length === 3){
					return this.addForm.goods_cat[2]
				}
			}
		}
	}
</script>

<style scoped>
	.el-steps {
		margin: 15px 0;
	}
	.el-checkbox {
		margin: 0 5px 0 0 !important;
	}
</style>