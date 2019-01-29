<!----------------------------------
****--出科设置(givenSet_list)
****--@date     2017/9/2
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <given-set :userType="'SXS'"></given-set>
</template>
<script>
  /*当前组件必要引入*/
  import givenSet from "../../../zyy/rdyBasicSetting/rdyGivenSet/rdyGivenSet_list.vue";
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
      givenSet
    }
  }
</script>
