<!--
****--@file     postgraduateChargingStandard_list
****--@date     2017/12/15 17:49
****--@author   YC
****--@describe 收费标准
-->
<template>
  <div>
    <el-row>
      <el-form :model="clothesPriceData" ref="clothesPriceData" :rules="rules" labelWidth="130px" :inline="true">
        <el-col>
          <el-form-item prop="configValue" label="研究生工服费：">
            <el-input style="width: 95%" v-model.trim="clothesPriceData.configValue"
                      placeholder="必填项-只能填写数字"></el-input>
          </el-form-item>
          <el-form-item>元/天</el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-form :model="hotelExpenseData" ref="hotelExpenseData" :rules="rules" labelWidth="130px" :inline="true">
        <el-col>
          <el-form-item prop="configValue" label="住宿费：">
            <el-input style="width: 95%" v-model.trim="hotelExpenseData.configValue" placeholder="必填项-只能填写数字"></el-input>
          </el-form-item>
          <el-form-item>元/年</el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-form :model="depositData" ref="depositData" :rules="rules" labelWidth="130px" :inline="true">
        <el-col>
          <el-form-item prop="configValue" label="押金：">
            <el-input style="width: 95%" v-model.trim="depositData.configValue" placeholder="必填项-只能填写数字"></el-input>
          </el-form-item>
          <el-form-item>元</el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-col style="width:130px;">
        <div class="cal-schoolTit" style="text-align: right;">&nbsp;</div>
      </el-col>
      <el-col :span="4">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import { postgraduateChargingStandard as rules } from '../rules'; // 表单验证
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        //bind表单数据
        rules,

        //工作服费用
        clothesPriceData: {
          configValue: ''
        },

        //押金数据存储
        depositData: {
          configValue: ''
        },

        // 住宿费
        hotelExpenseData: {
          configValue: ''
        },

        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},

        //工作服费用
        clothesPrice: {
          ajaxSuccess: 'getClothesPrice',
          ajaxParams: {
            url: '/rotaryConfig/getByKey/yjs_clothes_price-YJS'
          }
        },

        //获取住宿押金
        getDeposit: {
          ajaxSuccess: 'getDepositData',
          ajaxParams: {
            url: '/rotaryConfig/getByKey/yjs_clothes_deposit-YJS'
          }
        },

        //获取住宿押金
        getHotelExpense: {
          ajaxSuccess: 'getHotelExpenseData',
          ajaxParams: {
            url: '/rotaryConfig/getByKey/yjs_hotel_expense-YJS'
          }
        },

        //修改配置
        saveData: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'saveSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: '/rotaryConfig/modify/',
            method: 'put'
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.ajax(this.clothesPrice);
        this.ajax(this.getDeposit);
        this.ajax(this.getHotelExpense);
      },

      // 工作服
      getClothesPrice (res) {
        let data = res.data;
        this.clothesPriceData = data;
      },

      //获取住宿押金
      getDepositData (res) {
        let data = res.data;
        this.depositData = data;
      },

      //获取住宿费
      getHotelExpenseData (res) {
        let data = res.data;
        this.hotelExpenseData = data;
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let a = this.submitForm('depositData');
        let b = this.submitForm('hotelExpenseData');
        let c = this.submitForm('clothesPriceData');
        if (a && b & c) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let saveData = Util._.defaultsDeep({}, this.saveData);
          saveData.ajaxParams.url += this.clothesPriceData.configId;
          saveData.ajaxParams.data = this.getFormData(this.clothesPriceData);
          this.ajax(saveData, isLoadingFun);

          let saveDeposit = Util._.defaultsDeep({}, this.saveData);
          saveDeposit.ajaxParams.url += this.depositData.configId;
          saveDeposit.ajaxParams.data = this.getFormData(this.depositData);
          this.ajax(saveDeposit, isLoadingFun);

          let saveHotelExpense = Util._.defaultsDeep({}, this.saveData);
          saveHotelExpense.ajaxParams.url += this.hotelExpenseData.configId;
          saveHotelExpense.ajaxParams.data = this.getFormData(this.hotelExpenseData);
          this.ajax(saveHotelExpense, isLoadingFun);
        }
      },

      //保存成功
      saveSuccess () {
        this.successMess('保存成功!');
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
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      }
    },
    created () {
      Util = this.$util;
      this.init();
    },
    mounted () {
    },
    components: {}
  };
</script>
