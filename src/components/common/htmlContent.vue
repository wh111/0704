<!--
****--@file     htmlContent
****--@date     2018/8/1 15:29
****--@author   YC
****--@describe html内容
-->
<template>
  <div class="htmlContent" v-html="html"></div>
</template>
<style lang="scss">
  .htmlContent {
    height: 100%;
    overflow: auto;
    font-size: 14px;
    img {
      max-width: 100%;
    }
    p {
      padding: 5px 0;
      line-height: initial;
      font-size: initial;
    }
    span {
      font-size: initial;
    }
    td, th {
      padding: 5px 10px;
      border: 1px solid #DDD;
    }
  }
</style>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'htmlContent',
    props: ['html'],
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
