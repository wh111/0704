<!--
****--@file     graduateApplyWriting_tips
****--@date     2018/3/12 18:23
****--@author   YC
****--@describe 事项提示
-->
<template>
  <el-row>
    <el-col v-for="(item,index) in msgs" :key="index">{{ index+1 }}、{{ item }}</el-col>
  </el-row>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['msgs'],
    data() {
      return {}
    },
    methods: {
      //初始化请求列表数据
      init() {

      }

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }

</script>
