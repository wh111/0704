<template>

  <div>
    <large-case @cancel="cancel" :url="url" :whereFrom="whereFrom" @edit="addSuccess" :operailityData="operailityData"
                v-if="showWhat=='largeCase'"></large-case>
    <electrocardiogramTemplate @cancel="cancel"  @edit="addSuccess"  :operailityData="operailityData"  :url="url" v-else-if="showWhat=='electrocardiogramTemplate'"></electrocardiogramTemplate>
    <imageTemplate @cancel="cancel" :url="url"   @edit="addSuccess"  :operailityData="operailityData"  v-else-if="showWhat=='imageTemplate'"></imageTemplate>

  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  /*引入--大病历模板*/
  import largeCase from './largeCaseWrite_edit/edit_largeCaseTemplate.vue';
  /*引入--心电图模板*/
  import electrocardiogramTemplate from './largeCaseWrite_edit/edit_electrocardiogramTemplate.vue';
  /*引入--影像模板*/
  import imageTemplate from './largeCaseWrite_edit/edit_imageTemplate.vue';
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'url', 'whereFrom'],
    data (){
      return{
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
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功',
          errorTitle:'修改失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            url:this.url.buildModify+this.operailityData.id,
            method:'put',
            data:{}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.buildGet+this.operailityData.id,
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;

//      if(this.operailityData.ctype=="YXZL"){
//        this.showWhat= 'imageTemplate';
//      }else if(this.operailityData.ctype=="MJJL"){
//        this.showWhat= 'electrocardiogramTemplate';
//      }else {
//        this.showWhat= 'largeCase';
//      }
      this.showWhat= 'largeCase';
    },
    mounted(){
      //初始化
    },
    methods:{
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },

      addSuccess(target,title){

        this.$emit('edit',target,title)
      },
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.formValidate = this.getFormValidate(this.formValidate,data) ;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
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
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
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
