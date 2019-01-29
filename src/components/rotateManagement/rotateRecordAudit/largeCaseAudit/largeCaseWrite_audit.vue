<template>

  <div>
    <large-case @cancel="cancel" :url="url" @audit="addSuccess" :operailityData="operailityData" v-if="showWhat=='largeCase'"></large-case>
    <electrocardiogramTemplate @cancel="cancel"  @audit="addSuccess"  :operailityData="operailityData"  :url="url" v-else-if="showWhat=='electrocardiogramTemplate'"></electrocardiogramTemplate>
    <imageTemplate @cancel="cancel" :url="url"   @audit="addSuccess"  :operailityData="operailityData"  v-else-if="showWhat=='imageTemplate'"></imageTemplate>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  import url from '../api';
  /*引入--大病历模板*/
  import largeCase from './largeCaseWrite_audit/audit_largeCaseTemplate.vue';
  /*引入--心电图模板*/
  import electrocardiogramTemplate from './largeCaseWrite_audit/audit_electrocardiogramTemplate.vue';
  /*引入--影像模板*/
  import imageTemplate from './largeCaseWrite_audit/audit_imageTemplate.vue';
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        url,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        showWhat:'',
        //form表单bind数据
        formValidate: {
          name:'',        //楼名
          address:'',     //地址
          phone:'',       //电话
          remark:'',      //备注
        },

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置

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

      addSuccess(target,title){
        this.$emit('audit',target,title)
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','audit');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
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
  .date{
    line-height: 25px;
  }
  .date .countDate{
    display: inline-block;
    width:70px;
    text-align: center;
    border-bottom: 1px solid;
  }
</style>
