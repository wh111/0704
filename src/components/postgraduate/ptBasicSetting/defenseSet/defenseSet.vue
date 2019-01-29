<!--
****--@file     defenseSet
****--@date     2018/8/4 11:14
****--@author   YC
****--@describe 答辩设置
-->
<template>
  <div>
    <!--<el-row>-->
    <!--<el-form v-for="(item,index) in configVal" :key="index" :model="item" ref="clothesPriceData" :rules="configkey[item.configKey].rules" labelWidth="130px" :inline="true">-->
    <!--<el-col>-->
    <!--<el-form-item prop="configValue" :label="item.remark">-->
    <!--<el-input style="width: 95%" v-model.trim="item.configValue"-->
    <!--placeholder="必填项"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item v-if="configkey[item.configKey].info">{{ configkey[item.configKey].info }}</el-form-item>-->
    <!--</el-col>-->
    <!--</el-form>-->
    <!--</el-row>-->
    <el-row>
      <el-form :model="demandQuantityData" ref="demandQuantityData" :rules="rules" labelWidth="150px" :inline="true">
        <el-col>
          <el-form-item prop="configValue" label="科研日志达标条件：">
            <el-input style="width: 95%" v-model.trim="demandQuantityData.configValue" placeholder="必填项-只能填写数字"></el-input>
          </el-form-item>
          <el-form-item>%</el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-form :model="midTermExaminationData" ref="midTermExaminationData" :rules="rules" labelWidth="150px" :inline="true">
        <el-col>
          <el-form-item prop="configValue" label="中期考核合格分数：">
            <el-input style="width: 95%" v-model.trim="midTermExaminationData.configValue" placeholder="必填项-只能填写数字"></el-input>
          </el-form-item>
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
    name: 'defenseSet',
    data () {
      return {
        rules,
//        configVal: [],
//        configKey: {
//          yjs_demand_quantity: {info: '', rules: {}},
//          yjs_mid_term_examination: {info: '', rules: {}}
//        },

        //需求数量
        demandQuantityData: {
          configValue: ''
        },

        //中期考核合格分数
        midTermExaminationData: {
          configValue: ''
        },

        //需求数量
        getDemandQuantity: {
          ajaxSuccess: 'getDemandQuantityData',
          ajaxParams: {
            url: '/rotaryConfig/getByKey/yjs_demand_quantity-YJS'
          }
        },

        //中期考核合格分数
        getMidTermExamination: {
          ajaxSuccess: 'getMidTermExaminationData',
          ajaxParams: {
            url: '/rotaryConfig/getByKey/yjs_mid_term_examination-YJS'
          }
        },

        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        //修改配置
        saveData: {
          type: 'add',
          successTitle: '提交成功!',
          errorTitle: '提交失败!',
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
        this.ajax(this.getDemandQuantity);
        this.ajax(this.getMidTermExamination);
//        this.getConfigs();
      },

      // 需求数量
      getDemandQuantityData (res) {
        let data = res.data;
        this.demandQuantityData = data;
      },

      //中期考核合格分数
      getMidTermExaminationData (res) {
        let data = res.data;
        this.midTermExaminationData = data;
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let a = this.submitForm('midTermExaminationData');
        let b = this.submitForm('demandQuantityData');
        if (a && b) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let saveData1 = Util._.defaultsDeep({}, this.saveData);
          saveData1.ajaxParams.url += this.midTermExaminationData.configId;
          saveData1.ajaxParams.data = this.getFormData(this.midTermExaminationData);
          this.ajax(saveData1, isLoadingFun);

          let saveData2 = Util._.defaultsDeep({}, this.saveData);
          saveData2.ajaxParams.url += this.demandQuantityData.configId;
          saveData2.ajaxParams.data = this.getFormData(this.demandQuantityData);
          this.ajax(saveData2, isLoadingFun);
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

//
//      getConfigs () {
//        Object.keys(this.configKey).map(key => this.getConfigForServer(key));
//      },
//      getConfigForServer (key) {
//        let opt = {
//          ajaxSuccess: res => {
//            let data = res.data;
//            if (data instanceof Object) {
//              this.configVal.push(data)
//            }
//          },
//          ajaxParams: {
//            url: '/rotaryConfig/getByKey/' + key + '-YJS'
//          }
//        };
//        this.ajax(opt);
//      },
//      /*
//       * 点击提交按钮 监听是否提交数据
//       * @param isLoadingFun boolean  form表单验证是否通过
//       * */
//      listenSubEvent (isLoadingFun) {
//        let d = this.submitForm('depositData');
//        if (d && c) {
//          if (!isLoadingFun) isLoadingFun = function () {
//          };
//          isLoadingFun(true);
//
//          let saveHotelExpense = Util._.defaultsDeep({}, this.saveData);
//          saveHotelExpense.ajaxParams.url += this.hotelExpenseData.configId;
//          saveHotelExpense.ajaxParams.data = this.getFormData(this.hotelExpenseData);
//          this.ajax(saveHotelExpense, isLoadingFun);
//        }
//      },
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
