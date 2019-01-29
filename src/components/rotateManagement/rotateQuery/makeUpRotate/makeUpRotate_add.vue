<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <look :operaility-data="operailityData" :userType="operailityData.podClass" :viewByPodId="true"></look>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form  :model="formValidate" ref="formValidate" :rules="rules" labelWidth="136px">
          <el-form-item label="设置补轮转时长：" prop="ts">
            <el-input v-model="formValidate.ts" style="width: 200px;"></el-input>
            {{ operailityData.podClass == 'SXS' ? '周' : '月' }}
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="4" class="btnBox">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="4" class="btnBox" :offset="2">
        <el-button @click="cancelAdd">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  import api from './api';
  import {makeUpRotate as rules} from '../../rules';
  import look from '../../rotateRecordWrite/givenTheApplication/givenTheApplication_look.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        formValidate: {
          ts: ''
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '设置成功!',
          errorTitle: '设置失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path + this.operailityData.id,
            method: api.add.method
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
      },
      /*
   * 点击提交按钮 监听是否提交数据
   * @param isLoadingFun boolean  form表单验证是否通过
   * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
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
      submitForm(formName) {
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
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },

      cancelAdd(){
        this.$emit('cancel','add')
      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {look}
  }

</script>
