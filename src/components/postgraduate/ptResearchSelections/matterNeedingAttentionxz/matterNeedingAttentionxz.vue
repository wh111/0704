<!--
****--@file     matterNeedingAttentionxz
****--@date     2018/8/1 15:15
****--@author   YC
****--@describe 研导双选-报到须知
-->
<template>
  <mna code="BDXZ"></mna>
</template>
<script>
  /*当前组件必要引入*/
  import mna from '../matterNeedingAttentionSX/matterNeedingAttentionSX'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'matterNeedingAttentionxz',
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
    components: {mna}
  };

</script>
