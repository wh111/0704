<!----------------------------------
****--@name     科内教学
****--@role     ${*}
****--@date     2018/3/7
****--@author   gx
----------------------------------->
<template>
      <teaching-activities-set fromWhere="conezTeaching" :hashRepeal="true"></teaching-activities-set>
</template>
<script>
	/*当前组件必要引入*/
  import teachingActivitiesSet  from '../teachingActivitiesSet/teachingActivitiesSet_list.vue'
	//当前组件引入全局的util
	let Util = null;
	export default {
		data() {
			return {}
		},
		methods: {
			//初始化请求列表数据
			init() {

			},

		},
		created() {
			this.init();
		},
		mounted() {
		},
		components: {
      teachingActivitiesSet
    }
	}
</script>
