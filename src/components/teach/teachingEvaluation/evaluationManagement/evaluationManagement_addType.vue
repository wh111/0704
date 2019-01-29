<template>

  <div>


    <el-form ref="formValidate" :model="formValidate"  :rules="evaluationManagementType" class="demo-form-inline" label-width="90px">
      <el-row>
        <el-col :span="11" :offset="6">
          <el-form-item  prop="name" label="类型名称">
            <el-input   v-model="formValidate.name" placeholder="请输入名称">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row >
      <el-col :span="24" style="text-align: center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="saveBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  import {evaluationManagementType} from '../../rules'
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],
    data (){
      return{
        evaluationManagementType,
        //保存按钮基本信息
        saveBtn:{title:'保存',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          name:"",   //类型名称
        },
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'addType',
          successTitle:'保存成功',
          errorTitle:'保存失败',

          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            url:this.url.templateTypeAdd,
            method:'post',
          }
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化

//        this.init();
    },
    methods:{
      /*  确定
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
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


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        this.formValidate =  this.getFormValidate(this.formValidate,responseData.data);

      },







      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','addType');
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

      //上传附件
      addFileEvent(ids){
        this.formValidate.fileIds = ids;
      },



    }
  }
</script>
