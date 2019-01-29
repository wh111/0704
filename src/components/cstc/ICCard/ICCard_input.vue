<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row>
      <el-col :span="6" :offset="1" style="height: 118px">
        <user-avatar :src="getUserPhotoUrl(operailityData.photo)" tipText="还未上传头像"></user-avatar>
      </el-col>
      <el-col :span="15" :offset="1">
        <el-form label-width="68px" :model="formValidate" ref="formValidate" :rules="rules" onsubmit="return false">
          <el-form-item label="姓名：">{{ formValidate.userName }}</el-form-item>
          <el-form-item label="卡号：" prop="cardNum">
            <el-input v-model="formValidate.cardNum"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancelEdit">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import userAvatar from '../../common/userAvatar.vue';

  import {ICCard as rules} from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
        formValidate: {
          id: "",
          userId: this.operailityData.userId,
          userName: this.operailityData.userName,
          cardNum: '',
        },
        editType: 'add',
        http: '',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.http = this.$store.state.envPath.http;
        if (this.operailityData && this.operailityData.id) {
          this.editType = 'edit';
          this.getEditData()
        }
      },
      getEditData() {
        let opt = {
          ajaxSuccess: res => {
            for (let key in this.formValidate) {
              this.formValidate[key] = res.data[key]
            }
          },
          ajaxError: () => this.errorMess('获取数据失败'),
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
      /*
       * 点击保存按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        let msg = {add: '添加', edit: '修改'};
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          let opt = {
            type: this.editType,
            successTitle: msg[this.editType] + '成功!',
            errorTitle: msg[this.editType] + '失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api[this.editType].path + (this.editType === 'add' ? '' : this.formValidate.id),
              method: api[this.editType].method,
              data: this.getFormData(this.formValidate)
            }
          };
          isLoadingFun(true);
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
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },
      getUserPhotoUrl(url) {
        return url ? this.http + url : ''
      },
      cancelEdit() {
        this.$emit('cancel', this.editType)
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {userAvatar}
  }

</script>
