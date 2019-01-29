<!----------------------------------
****--@name     大病历设置
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <records-set :userType="'JXS'"></records-set>
</template>
<script>
  /*当前组件必要引入*/
  import recordsSet from "../../../zyy/rdyBasicSetting/rdyRecordsSet/rdyRecordsSet_list.vue";
  //当前组件引入全局的util
  let Util = null;
  export default{
    data() {
      return {}
    },
    methods: {
      //初始化请求列表数据
      init(){

      },

    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {
      recordsSet
    }
  }
</script>
