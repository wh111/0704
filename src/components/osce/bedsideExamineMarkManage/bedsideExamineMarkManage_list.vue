<!----------------------------------
****--@name     床边考核成绩管理（床边考核的历史考核记录）
****--@role     ${*}
****--@date     2018/4/16
****--@author   gx
----------------------------------->
<template>
  <div>
    <markManage fromWhere="bedsideExamineMarkManage" :url="api"></markManage>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import markManage from '../bedsideExamine/user/user_list.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        api
      };
    },
    methods: {
      //初始化请求列表数据
      init () {

      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      markManage
    }
  };
</script>
