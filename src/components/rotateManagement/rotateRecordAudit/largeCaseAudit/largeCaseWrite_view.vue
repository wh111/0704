<template>

  <div class="showWrapper">
    <large-case @cancel="cancel" :url="url" :operailityData="operailityData" v-if="showWhat=='largeCase'"></large-case>
    <electrocardiogramTemplate @cancel="cancel"  :operailityData="operailityData"  :url="url" v-else-if="showWhat=='electrocardiogramTemplate'"></electrocardiogramTemplate>
    <imageTemplate @cancel="cancel" :url="url"   :operailityData="operailityData"  v-else-if="showWhat=='imageTemplate'"></imageTemplate>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  import url from '../api';
  /*引入--大病历模板*/
  import largeCase from './largeCaseWrite_view/view_largeCaseTemplate.vue';
  /*引入--心电图模板*/
  import electrocardiogramTemplate from './largeCaseWrite_view/view_electrocardiogramTemplate.vue';
  /*引入--影像模板*/
  import imageTemplate from './largeCaseWrite_view/view_imageTemplate.vue';
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        url,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        "data":{
        },
        formValidate:{},
        showWhat:'',
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      if(this.operailityData.ctype=="YXZL"){
        this.showWhat= 'imageTemplate';
      }else if(this.operailityData.ctype=="MJJL"){
        this.showWhat= 'electrocardiogramTemplate';
      }else {
        this.showWhat= 'largeCase';
      }
    },
    mounted(){
      //初始化
    },
    methods:{
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.data = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
      },
      /*
       * 组件初始化入口
       * */

    },
    components:{
      //当前组件引入的子组件
      largeCase,electrocardiogramTemplate,imageTemplate
    },
  }
</script>
<style>
  .showWrapper{
    height: 100%;
    padding: 20px;
    border: 1px solid #eee;
  }
  .feildFontweight{
    font-weight: bold;
  }
</style>
