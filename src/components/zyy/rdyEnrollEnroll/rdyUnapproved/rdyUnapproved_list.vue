<!----------------------------------
****--@name     补调剂
****--@role     ${*}
****--@date     2018/7/30
****--@author   gx
----------------------------------->
<template>
  <list whereFrom="rdyUnapproved"></list>
</template>
<script>
  /*当前组件必要引入*/
  import list from '../rdyOnAuditDay/rdyOnAuditDay_list.vue'
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
      list
    }
  }
</script>
