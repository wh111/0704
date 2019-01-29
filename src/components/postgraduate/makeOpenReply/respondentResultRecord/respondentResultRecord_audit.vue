<!----------------------------------
****--审核(respondentSumAudit_audit)
****--@date     2017/9/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-form ref="formValidate" :model="formValidate" :rules="rules"  class="demo-form-inline" label-width="100px">
      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="答辩时间:">
            {{formValidate.defenseTime}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label=" 答辩地点:">
            {{formValidate.defensePlace}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="答辩人员:">
            <div class="itemLayout" style="width: 100%">
              <fieldset>
                <legend style="font-size:16px"> 人员信息 </legend>
                <el-tag v-for="(item,index) in formValidate.summaryUserList" :key="index" type="success">{{item.userName}}</el-tag>
              </fieldset>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="审核结果:" prop="status">
            <el-radio-group v-model="formValidate.status">
              <el-radio label="TG">通过</el-radio>
              <el-radio label="BH">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24">
        <div style="text-align: center;">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import {respondentAudit as rules} from "../rules.js";
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData"],
    data() {
      return {
        rules,
        formValidate:{
          id:this.operailityData.id,
          status:"TG",
          auditOpinion:""
        },

        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:api.defenseSummaryGet.path+this.operailityData.id,
            params:{}
          }
        },

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        auditMessTitle:{
          type:'audit',
          successTitle:'审核成功!',
          errorTitle:'审核失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:api.defenseSummaryAudit.path+this.operailityData.id,
            method:api.defenseSummaryAudit.method,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.listMessTitle)
      },


      //通过get请求列表数据
      updateListData(responseData){
        if(!responseData.data)return;
        this.formValidate = responseData.data;
      },


      /*
       * 保存或上报按钮会调用这个公共函数
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          this.auditMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.auditMessTitle,isLoadingFun);
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
        this.$emit('cancel',this.auditMessTitle.type);
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },
    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
