<template>
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" label-width="124px" :rules="rules">
      <el-row>

        <el-col :span="8" :offset="2">
          <el-form-item label="耗材名称：" prop="consumablesId" required>
            <el-select v-model="formValidate.consumablesId" filterable placeholder="请选择">
              <el-option v-for="item in deviceOptions" :key="item.id" :label="item.consumablesName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="数量：" prop="borrowerNum" required>
            <el-input v-model="formValidate.borrowerNum"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="使用人：" prop="borrower" required>
            <el-input v-model="formValidate.borrower"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="使用时间：" prop="borrowerTime" required>
            <el-date-picker v-model="formValidate.borrowerTime" :editable="false" type="datetime" placeholder="选择借用日期">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="用途：" prop="purpose" required>
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入借用的用途" v-model="formValidate.purpose"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入备注" v-model="formValidate.remark"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <el-row>
      <el-col :span="6" :offset="6" align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="6" align="center">
        <el-button @click="resetForm('formValidate')">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import selectApi from '../consumablesManage/api'; // 选择设备api
  import {
    consumablesUse as rules
  } from '../../rules'; // 表单验证规则
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      urlParams: { // api对象
        type: Object,
        required: true
      }
    },
    data() {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        countDate: 0,
        // 耗材名称
        deviceOptions: [],
        //form表单bind数据
        formValidate: {
          consumablesId: '', // 设备id
          borrowerNum: '', // 数量
          borrower: '', // 借用人
          borrowerTime: '', // 借用时间
          purpose: '', // 用途
          remark: '', // 备注
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.urlParams.path,
            method: this.urlParams.method
          }
        }
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      this.init()
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          let data = this.addMessTitle.ajaxParams.data;
          data.borrowerTime = this.conductDate(data.borrowerTime, 'yyyy-MM-dd HH:mm:ss');
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
        return flag
      },
      /*
       * 重置当前表单
       * */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      // 获取选择设备
      getSelectData() {
        let opt = {
          ajaxSuccess: 'getSelectDataSuccess',
          ajaxParams: {
            url: selectApi.noPageList.path,
            method: selectApi.noPageList.method,
          }
        };
        this.ajax(opt);
      },
      // 选择设备数据
      getSelectDataSuccess(res) {
        this.deviceOptions = res.data
      },
      /*
       * 组件初始化入口
       * */
      init() {
        this.getSelectData();
        //this.ajax(this.listMessTitle)
      }
    }
  }

</script>

<style lang="scss">
  @import '../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
