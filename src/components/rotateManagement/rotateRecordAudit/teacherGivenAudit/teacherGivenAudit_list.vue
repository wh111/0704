<!----------------------------------
****--@name     带教老师出科审核
****--@role     ${*}
****--@date     2018/9/5
****--@author   gx
----------------------------------->
<template>
  <div>
    <list></list>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import list from '../givenAudit/user_teacher/list.vue'
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
