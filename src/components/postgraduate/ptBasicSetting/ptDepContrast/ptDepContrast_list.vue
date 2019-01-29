<!----------------------------------
****--@name     科室对照
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <contrast :rtModelType="'YJS'"></contrast>
</template>
<script>
  /*当前组件必要引入*/
  import contrast from "../../../zyy/rdyBasicSetting/rdyDepContrast/rdyDepContrast_list.vue";
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
      contrast
    }
  }
</script>
