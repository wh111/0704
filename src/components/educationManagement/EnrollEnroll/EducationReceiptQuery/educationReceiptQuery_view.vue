<!----------------------------------
****--查看进修回执详情(EducationReceiptQuery_view)
****--@date     2017/9/14
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <receipt-write :isShow="true" :userId="operailityData.userId"></receipt-write>
</template>
<script>
  /*当前组件必要引入*/
  import receiptWrite from "../EducationReceiptWrite/EducationReceiptWrite_view.vue";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData"],
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
      receiptWrite
    }
  }
</script>
