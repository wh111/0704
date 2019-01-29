<!----------------------------------
****--@name    遴选进修生查询
****--@role     ${*}
****--@date     2018/5/29
****--@author   gx
----------------------------------->
<template>
      <selectionEducation where="selectionEducationSeach"></selectionEducation>
</template>
<script>
	/*当前组件必要引入*/
  import selectionEducation from '../selectionEducation/selectionEducation_list.vue';//遴选进修生
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
      selectionEducation
    }
	}
</script>
