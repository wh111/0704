<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <el-row>
    <el-form label-width="100px" :model="formValidate" ref="formValidate" :rules="rules">
      <el-col :span="11" :offset="1">
        <el-form-item label="项目名称：" prop="trainingName">
          <el-input v-model="formValidate.trainingName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="11" :offset="1">
        <el-form-item label="负责人：" prop="user">
          <el-input v-model="formValidate.user"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="11" :offset="1">
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="formValidate.phone"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-col align="center" style="margin-top:20px;">
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      <el-button @click="cancel">取消</el-button>
    </el-col>
  </el-row>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import { skillTrain as rules } from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        rules,
        formValidate: {
          trainingName: '',
          user: '',
          phone: ''
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        editType: 'add'
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        let msg = {
          add: '添加',
          edit: '修改'
        };
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let opt = {
            type: this.editType,
            successTitle: msg[this.editType] + '成功!',
            errorTitle: msg[this.editType] + '失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api[this.editType].path,
              method: api[this.editType].method,
              data: this.getFormData(this.formValidate)
            }
          };
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', this.editType);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
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
