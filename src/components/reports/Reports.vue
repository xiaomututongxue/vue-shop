<template>
	<div id="reports">
		<!--面包屑导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>数据统计</el-breadcrumb-item>
		  <el-breadcrumb-item>数据列表</el-breadcrumb-item>
		</el-breadcrumb>
		<div id="main" style="width: 1000px;height:600px;"></div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import _ from 'lodash'
	export default {
		data(){
			return {
				
			}
		},
		methods:{},
		created(){
			
		},
		async mounted(){
			var myChart = echarts.init(document.getElementById('main'));
			var options = {
				title: {
		            text: '用户来源'
		          },
		          tooltip: {
		            trigger: 'axis',
		            axisPointer: {
		              type: 'cross',
		              label: {
		                backgroundColor: '#E9EEF3'
		              }
		            }
		          },
		          grid: {
		            left: '3%',
		            right: '4%',
		            bottom: '3%',
		            containLabel: true
		          },
		          xAxis: [
		            {
		              boundaryGap: false
		            }
		          ],
		          yAxis: [
		            {
		              type: 'value'
		            }
		          ]
		        }
				//合并的数据
				const {data:res} = await this.$http.get('reports/type/1')
				console.log(res.data)
				var option = res.data
				option = _.merge(options,option)
				myChart.setOption(option)
			}
		}
	
</script>

<style scoped>
	#main {
		margin: 20px 0;
	}
</style>