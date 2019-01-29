<!----------------------------------
****--@name     收费参数设置
****--@role     ${*}
****--@date     2017/12/21
****--@author   gx
----------------------------------->
<template>
  <div>
      <el-form :model="configData" ref="configData" :rules="rules">
    <el-row :gutter="10">
      <el-col style="width:120px;" :offset="1">
        <div class="cal-schoolTit" style="text-align: right;">银行账户设置:</div>
      </el-col>
      <el-col :span="4">
        <el-form-item  prop="configValue">
          <el-input style="width: 300px" v-model="configData.configValue">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    </el-form>

    <div style="margin-top: 20px;">
      <el-row :gutter="10">
        <el-col :span="3" :offset="4">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import {chargeParameterSet as rules} from '../../rules'
  import api from './api'
  let Util = null;
  export default{
    data() {
      return {
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //修改获取收费参数设置
        saveCharging:{
          ajaxSuccess:'saveSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.modifyConfigId.path,
            method: api.modifyConfigId.method,
          },
        },

        configData:{
          configValue:'',
        },


        //获取收费参数设置
        getByKey:{
          ajaxSuccess:'getByKeyData',
          ajaxParams:{
            url: api.getByKey.path,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.getByKey);
      },


      //通过get请求列表数据
      getByKeyData(responseData){
        let data = responseData.data;
          this.configData = data || {configValue: '',};
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
          let isSubmit = this.submitForm("configData");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.saveCharging.ajaxParams.url =api.modifyConfigId.path+ this.configData.configId;
          this.saveCharging.ajaxParams.data = this.getFormData(this.configData);
          this.ajax(this.saveCharging,isLoadingFun);
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


      //保存成功
      saveSuccess(){
        this.successMess("保存成功!");
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){},


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
