<!--
****--@file     basicManagement_list
****--@date     2018/7/5 14:01
****--@author   YC
****--@describe 基础管理
-->
<template>
  <div class="ddBasicManagement">
    <h2>参评条件</h2>
    <br>
    <el-form ref="formValidate" :model="formValidate" :rules="rules">
      <el-form-item>
        <el-checkbox v-model="formValidate.condition" :true-label="1" :false-label="0">是否挂接机构化参评条件</el-checkbox>
      </el-form-item>
      <div class="ddbmInfo" v-if="formValidate.condition">
        <h3>参评条件明细</h3>
        <el-form-item prop="conditionDetail">
          <el-checkbox-group v-model="formValidate.conditionDetail">
            <el-checkbox label="PASS">出科成绩必须都合格</el-checkbox>
            <el-checkbox label="NO_ABSENTEEISM">考勤中无旷工</el-checkbox>
            <el-checkbox label="NO_PUNISHMENT">奖惩中无惩罚记录</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
    </el-form>
    <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn" class="ddbmBtn"></load-btn>
  </div>
</template>
<style lang="scss">
  .ddBasicManagement {
    .ddbmInfo {
      padding: 20px;
      padding-bottom: 0;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .ddbmBtn {
      margin-top: 20px
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import { basicManagement as rules } from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'basicManagementList',
    data () {
      return {
        rules,
        formValidate: {
          condition: 0, // 1 | 0
          conditionDetail: [] //  "PASS","NO_ABSENTEEISM","NO_PUNISHMENT"
        },
        //保存按钮基本信息
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.getEditData();
      },
      // 获取编辑数据
      getEditData () {
        let opt = {
          ajaxSuccess: res => this.formValidate = res.data,
          ajaxParams: {
            url: api.get.path,
            method: api.get.method
          }
        };
        this.ajax(opt);
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          let data = this.getFormData(this.formValidate);
          !data.condition && (data.conditionDetail.length = 0);
          let opt = {
            ajaxSuccess: () => {
              this.successMess('保存成功！');
              !data.condition && (this.formValidate.conditionDetail.length = 0);
            },
            ajaxParams: {
              jsonString: true,
              url: api.edit.path,
              method: api.edit.method,
              data
            }
          };
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.ajax(opt, isLoadingFun);
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        return Util._.defaultsDeep({}, data);
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
