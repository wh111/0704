<!----------------------------------
****--@name     招生查询
****--@role     ${*}
****--@date     2018/6/20
****--@author   gx
----------------------------------->
<template>
  <confirmAdmissions fromModular="admissionsQuery"></confirmAdmissions>
</template>
<script>
  /*当前组件必要引入*/
  import confirmAdmissions from '../confirmAdmissions/confirmAdmissions_list.vue'
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
      confirmAdmissions
    }
  }
</script>
