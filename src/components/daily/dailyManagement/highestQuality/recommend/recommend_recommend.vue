<template>

  <div>

    <el-row class="lose-margin2" >
      <el-col :span="11" :offset="10">
        评优自荐
      </el-col >
    </el-row >
    <el-form ref="formValidate"  class="demo-form-inline" label-width="90px">

    <el-row   class="lose-margin2">
      <el-col :span="20" :offset="2">
       {{formValidate.reason}}
      </el-col >
    </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="相关证明材料:" prop="name" class="feildFontweight">
            <p> <a href="">上传附件</a></p>
          </el-form-item >
        </el-col >
      </el-row >
    </el-form>
    <el-row >
      <el-col :span="10" :offset="2">
        <div style="margin-top: 20px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="saveBtn"></load-btn>
          <load-btn @listenSubEvent="listenSubEvent" :btnData="reportedBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        options: [{
          value: '选项1',
          label: '所有人'
        }, {
          value: '选项2',
          label: '本科教育'
        }, {
          value: '选项3',
          label: '实习生'
        }, {
          value: '选项4',
          label: '研究生'
        }, {
          value: '选项5',
          label: '住院医师'
        }, {
          value: '选项5',
          label: '进修生'
        }],
        //保存按钮基本信息
        saveBtn:{title:'保存',callParEvent:'listenSubEvent'},
        reportedBtn:{title:'上报',callParEvent:'listenSubEvent'},
        countDate:0,
        //form表单bind数据
        formValidate: {
          appraisingId:'', //评优项目id
          userId:'',       //自荐人id
          reason:'',       //自荐理由
          fileIds:'',       //附件id字符串
          examineStatus:'',  //审核状态
        },
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        reportedMessTitle:{
          type:'recommend',
          successTitle:'上报成功',
          errorTitle:'上报失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            url:'/role/modify/1',
            method:'put',
          }
        },
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        saveMessTitle:{
          type:'recommend',
          successTitle:'保存成功',
          errorTitle:'保存失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            url:'appraising/sellOneself/get/',
            method:'put',
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/role/get/1',
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
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
          this.saveMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.saveMessTitle, isLoadingFun)
        }
      },

      reportedBtn(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.reportedMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.reportedMessTitle, isLoadingFun)
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
        myData.type = data.type.join(",");
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
    }
  }
</script>
