<!--
****--@file     index
****--@date     2018/6/22 9:15
****--@author   YC
****--@describe 文件系统布局文件
-->
<template>
  <el-row class="fileSysLayout">
    <el-col class="fslTop"></el-col>
    <el-col v-if="hasPlay" :span="20"></el-col>
    <el-col :span="hasPlay?4:24"></el-col>
  </el-row>
</template>
<style lang="scss">
  .fileSysLayout {
    height: 500px;
  }
</style>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'fileSystemLayout',
    props: ['hasPlay'],
    data () {
      return {};
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
