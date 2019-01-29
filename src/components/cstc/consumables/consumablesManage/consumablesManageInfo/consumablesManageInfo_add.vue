<template>
  <div>
    <el-row class="editForm">
      <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="124px">
        <el-col :span="9" :offset="2">
          <el-form-item label="购买时间：" prop="buyDate" required>
            <el-date-picker v-model="formValidate.buyDate" :editable="false" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="购买数量：" prop="buyNum" required>
            <el-input v-model="formValidate.buyNum" placeholder="请输入购买数量"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="单价：" prop="price" required>
            <el-input v-model="formValidate.price" placeholder="请输入单价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="厂商电话：" prop="manufacturerPhone">
            <el-input v-model="formValidate.manufacturerPhone" placeholder="请输入厂商电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="购买地址：" prop="buyAdderss">
            <el-input v-model="formValidate.buyAdderss" placeholder="请输入购买地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="存放地点：" prop="storageLocation">
            <el-input v-model="formValidate.storageLocation" placeholder="请输入存放地点"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 按钮 -->
    <el-row type="flex" class="row-bg" justify="center" solt="footer">
      <el-col :span="4" class="btnBox" align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="4" class="btnBox" :offset="2" align="center">
        <el-button @click="resetForm('formValidate')">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from './api';
  import {
    consumablesManageInfo as rules
  } from '../../../rules'; // 表单验证规则
  let Util = null;

  export default {
    props: {
      id: { // 耗材id
        type: [Number, String],
        required: true
      }
    },
    data() {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {
          loading: false,
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        // 表单数据
        formValidate: {
          consumablesId: '', // 耗材id
          buyDate: '', // 购买日期
          buyNum: '', // 购买数量
          price: '', // 价格
          manufacturerPhone: '', // 厂商电话
          buyAdderss: '', // 购买地址
          storageLocation: '' // 存放地址
        },
        //当前组件提交数据时,ajax处理的 基础信息设置
        storageMessTitle: {
          type: 'storage',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method
          }
        },
      }
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
          this.storageMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          Object.assign(this.storageMessTitle.ajaxParams.data, {
            consumablesId: this.id
          });
          let data = this.storageMessTitle.ajaxParams.data;
          data.buyDate = this.conductDate(data.buyDate, 'yyyy-MM-dd') || '';
          this.ajax(this.storageMessTitle, isLoadingFun)
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
       * 重置当前表单
       * */
      resetForm(formName) {
        // this.$emit('cancel', this.addMessTitle.type);
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
      /*
       * 组件初始化入口
       * */
      init() {
        //this.ajax(this.listMessTitle)
      },
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      this.init();
    }
  }

</script>

<style lang="scss">
  .editForm {
    .el-date-editor.el-input {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
  }

</style>
