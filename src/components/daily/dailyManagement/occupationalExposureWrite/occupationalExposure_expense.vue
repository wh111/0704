<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="90px" >
      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名" class="feildFontweight">
            {{operailityData.applicantName}}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="科室"  class="feildFontweight">
            {{operailityData.depName}}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item  label="报销金额:" prop="amountMoney" class="feildFontweight">
            <el-input  v-model="formValidate.amountMoney"> </el-input>
          </el-form-item>
        </el-col >

      </el-row >

      <el-row >
        <el-col :span="15" :offset="2">
          <el-form-item type="附件" label="报销资料:" class="feildFontweight">
            <upload-file :uploadFiles="formValidate.fileList" @setUploadFiles="expenseFileEvent"></upload-file>
          </el-form-item>
        </el-col >

      </el-row >


    </el-form>

    <el-row >
      <el-col :span="24" style="text-align: center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <load-btn @listenSubEvent="reportedEvent" :btnData="reportedBtn"></load-btn>
      </el-col>
    </el-row >
  </div>
</template>
<script>

  //当前组件引入全局的util
  import {occupationalExposure as rules} from '../rules'
  let Util=null;
  export default {
      props:['operailityData'],
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        reportedBtn:{title:'上报',callParEvent:'listenSubEvent'},
        countDate:0,
        //form表单bind数据
        "formValidate":{
          "occupationalExposureId":this.operailityData.id,
          "applicantId":this.operailityData.applicantId,   //申请人iD(当前登录人员)
          "applicantName":this.operailityData.applicantName,
          "depId":this.operailityData.depId,
          "depName":this.operailityData.depName,
          "amountMoney":"",
          "status":"REIMBURSEMENTWSB",
          "fileList":[],
          fileIds:'',
        },

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'expense',
          successTitle:'操作成功!',
          errorTitle:'操作失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'occupationalExposure/reimbursement/add',
            method:'post'
          }
        },

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'expense',
          successTitle:'操作成功!',
          errorTitle:'操作失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'occupationalExposure/reimbursement/modify/'+this.operailityData.reimbursementId,
            method:'put'
          }
        },
        isAdd:true, //是否是新建
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'occupationalExposure/reimbursement/get/'+this.operailityData.reimbursementId,
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
      if(!this.operailityData.reimbursementId)return;
      this.init();
    },
    methods:{
      //初始获取数据
      SuccessGetCurrData(res){
        if(!res.data) return;
        this.isAdd = false;
        this.formValidate = res.data;
      },

        //获取文件来拼接 文件id字符串
      expenseFileEvent(ids){
        this.formValidate.fileIds = ids;
      },



      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          let messTitle;

          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          messTitle = !!this.isAdd ?  this.addMessTitle : this.editMessTitle;
          messTitle.ajaxParams.data=this.getFormData(this.formValidate);
          messTitle.ajaxParams.data.status = 'WSB';        //重新为转台赋值，防止状态被更改
          messTitle.ajaxParams.data.occupationalExposureStatus = 'REIMBURSEMENTWSB';        //重新为转台赋值，防止状态被更改
          this.ajax(messTitle,isLoadingFun)
        }
      },


      /*//点击上报按钮 监听是否提交数据
      * @param isLoadingFun boolean  form表单验证是否通过*/
      reportedEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          let messTitle;
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          messTitle = !!this.isAdd ?  this.addMessTitle : this.editMessTitle;
          messTitle.ajaxParams.data= this.getFormData(this.formValidate);
          messTitle.ajaxParams.data.status = 'DSH';      //重新为转台赋值，防止状态被更改
          messTitle.ajaxParams.data.occupationalExposureStatus = 'REIMBURSEMENTDSH';      //重新为转台赋值，防止状态被更改
          this.ajax(messTitle,isLoadingFun)
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','expense');
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
        this.ajax(this.listMessTitle)
      },
    }
  }
</script>
