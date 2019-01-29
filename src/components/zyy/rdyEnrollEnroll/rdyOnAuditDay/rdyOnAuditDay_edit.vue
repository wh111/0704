<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <show :operailityData="operailityData"></show>
    <el-row style="margin-top: 20px">
      <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="90px">
        <fieldset>
          <legend style="font-size:16px">&nbsp;&nbsp;审核结果&nbsp;&nbsp;</legend>
          <el-col>
            <el-form-item label="审核结果：">
              <el-radio-group v-model="formValidate.type">
                <el-radio class="radio" label="Y">通过</el-radio>
                <el-radio class="radio" label="N">未通过</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="审核意见：" prop="mess">
              <el-input type="textarea" v-model="formValidate.mess"></el-input>
            </el-form-item>
          </el-col>
        </fieldset>
      </el-form>
      <el-col align="center" style="margin-top: 20px">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="saveBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import show from '../rdyOnlinePrequalification/rdyOnlinePrequalification_view.vue';
  import {rdyOnlinePrequalification as rules} from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        formValidate: {
          type: "Y", // 是否通过
          mess: "", // 审核意见
        },
        //保存按钮基本信息
        saveBtn: {title: '提交', callParEvent: 'listenSubEvent'}, //保存
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

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
          let opt = {
            type: 'edit',
            successTitle: '审核成功!',
            errorTitle: '审核失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api.preTrialModifyXCState.path + this.operailityData.id,
              method: api.preTrialModifyXCState.method,
              data: this.getFormData(this.formValidate),
            }
          };
          this.ajax(opt, isLoadingFun)
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'edit');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      show
    }
  }

</script>
