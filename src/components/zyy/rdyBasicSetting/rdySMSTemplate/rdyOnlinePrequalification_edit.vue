<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-form ref="formValidate" :model="formValidate" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="模板名称：" prop="name">
            <el-input v-model="formValidate.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="字典码：" prop="code">
            <el-input v-model="formValidate.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="内容：" prop="value">
            <el-input type="textarea" v-model="formValidate.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="saveBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import {rdySMSTemplate as rules} from '../rules'
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'url'],
    data() {
      return {
        rules,
        formValidate: {
          name: '',
          code: '',
          value: '',
        },
        //保存按钮基本信息
        saveBtn: {title: '提交', callParEvent: 'listenSubEvent'}, //保存
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getViewData()
      },

      getViewData() {
        let opt = {
          ajaxSuccess: "getViewDataSuccess",
          ajaxParams: {
            url: this.url.smsTemplateGet.path + this.operailityData.id,
            method: this.url.smsTemplateGet.method,
          }
        };
        this.ajax(opt)
      },
      getViewDataSuccess(res) {
        let data = res.data;
        this.formValidate = data;
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
            successTitle: '修改成功!',
            errorTitle: '修改失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: this.url.smsTemplateModify.path + this.operailityData.id,
              method: this.url.smsTemplateModify.method,
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
    components: {}
  }

</script>
