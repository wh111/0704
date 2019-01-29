<!----------------------------------
****--查看-病历库(resCaseLibrary_add)
****--@date     2017/8/4
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>

  <pdf v-if="formValidate.pdf!=''" :pdfSrc="formValidate.pdf">
    <h2 slot="header" style="text-align: center;padding: 10px 0;">{{formValidate.title}}</h2>
  </pdf>
  <p v-else>正在加载……</p>
</template>
<script>
  /*当前组件必要引入*/
  import pdf from "../../../study/common/view_pdf.vue";
  import api from "./api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData"],
    data() {
      return {
        formValidate:{
          pdf:"",
        },
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url: api.detail.path+this.operailityData.id,
          }
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        //初始化
        this.ajax(this.listMessTitle);
      },
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.formValidate=data;
        this.formValidate.pdf = this.$store.state.envPath.http+data["pdf"];
      },
      cancel(){
        this.$emit('cancel','show');
      }
    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {
      pdf
    }
  }
</script>
