<!----------------------------------
****--@name     我的进修通知
****--@role     ${*}
****--@date     2018/8/23
****--@author   gx
----------------------------------->
<template>
  <div style="text-align: center">
  <div style="min-width: 600px;text-align: left">
       <show-em type="show"></show-em>
  </div>
  </div>
</template>
<script>
  import showEm from '../sendEmNoticeJXS/showEmNoticeJXS.vue'
  /*当前组件必要引入*/

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
      showEm
    }
  }
</script>
