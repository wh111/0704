<!--
****--@file     index
****--@date     2018/6/22 9:16
****--@author   YC
****--@describe 文件系统
-->
<template>
  <file-sys-layout>

  </file-sys-layout>
</template>
<script>
  /*当前组件必要引入*/
  import fileSysLayout from './layout/index'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'fileSystem',
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
    components: {
      fileSysLayout
    }
  };

</script>
