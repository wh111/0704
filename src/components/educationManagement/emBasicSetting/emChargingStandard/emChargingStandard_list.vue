<!----------------------------------
****--收费标准(emChargingStandard_list)
****--@date     2017/9/14
****--@author   zyc<332533011@qq.com
----------------------------------->
<!---进修生收费标准--->
<template>
  <div style="height: 100%;overflow: auto">
    <el-row>
      <el-col :span="8">
        <el-form :model="accommodationData" ref="formValidate" :rules="rules" labelWidth="150px" style="width:100%;">
          <el-form-item label="住宿费：" prop="configValue" style="display: inline-block;">
            <el-input style="display: inline-block;float:left;width: 80%;"
                      v-model.trim="accommodationData.configValue"></el-input>
            <span style="float: left">元</span>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="8">
        <el-form :model="depositData" ref="formValidate" :rules="rules" labelWidth="150px" style="width:100%;">
          <el-form-item label="住宿押金：" prop="configValue" style="display: inline-block;">
            <el-input style="display: inline-block;float:left;width: 80%;"
                      v-model.trim="depositData.configValue"></el-input>
            <span style="float: left">元</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <hr>
    <br>
    <el-row>
      <el-col :span="8" v-for="(item,index) in depReDegree" :key="index">
        <el-form :model="item" ref="formValidate" :rules="rules" labelWidth="150px" style="width:100%;">
          <el-form-item :label="item.label" prop="configValue" style="display: inline-block;">
            <el-input style="display: inline-block;float:left;width: 80%;" v-model.trim="item.configValue"></el-input>
            <span style="float: left">元</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div align="center">
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../../../intern/internBasisData/api.js';

  import { chargingStandard as rules } from '../../../intern/rules.js'; // 表单验证
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      userType: {
        type: String,
        default: 'jxs'
      }
    },
    data () {
      return {
        //bind表单数据
        rules,
        formValidate: {
          configValue: {}
        },
        depOptionData: [],
        //押金数据存储
        depositData: {
          configValue: ''
        },

        //获取实习生住宿费
        accommodationData: {
          configValue: ''
        },

        depReDegree: [],
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        //获取设置信息
        getChargingStandard: {
          ajaxSuccess: 'getChargingStandardData',
          ajaxParams: {
            url: api.chargingStandard.path + this.userType
          }
        },

        //获取住宿费
        getAccommodation: {
          ajaxSuccess: 'getAccommodationData',
          ajaxParams: {
            url: api.accommodation.path + this.userType,
          }
        },

        //获取住宿押金
        getDeposit: {
          ajaxSuccess: 'getDepositData',
          ajaxParams: {
            url: api.deposit.path + this.userType,
          }
        },

        //获取科室数据
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.getByDepth.path,
            params: {
              depth: 3
            }
          }
        },
        //修改实习费收费标准
        saveHargingStandard: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'saveSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modifyConfigId.path,
            method: api.modifyConfigId.method
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.ajax(this.listMessTitle);
//        this.ajax(this.getChargingStandard);
        this.ajax(this.getAccommodation);
        this.ajax(this.getDeposit);
      },
      /**获取科室数据*/
      updateListData (responseData) {
        this.ajax(this.getChargingStandard);//获取配置数据
        let depReDegree = [];
        let data = responseData.data;
        data.map((item) => {
          depReDegree.push({
            configValue: '',
            label: item.name,
            key: item.id
          });
        });
        this.depReDegree = this.depReDegree.concat(depReDegree);
      },
      //通过get请求列表数据 配置数据
      getChargingStandardData (responseData) {
        let depReDegree = this.depReDegree;
        let data = responseData.data;
        this.formValidate = data;
        if (!data) {
          this.errorMess('无法获取到配置信息');
          return;
        }
        let configValue = JSON.parse(data.configValue);
        if (configValue && typeof configValue == 'object') {
          depReDegree.map(item => {
            item.configValue = configValue[item.key] || '0';
          });
        }
      },

      //获取住宿费
      getAccommodationData (responseData) {
        let data = responseData.data;
        this.accommodationData = data;
      },

      //获取住宿押金
      getDepositData (responseData) {
        let data = responseData.data;
        this.depositData = data;
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let saveHargingStandard = Util._.defaultsDeep({}, this.saveHargingStandard);
          saveHargingStandard.ajaxParams.url += this.formValidate.configId;
          this.formValidate.configValue = this.getFormData(this.depReDegree);
          saveHargingStandard.ajaxParams.data = this.formValidate;
          this.ajax(saveHargingStandard, isLoadingFun);

          let saveAccommodation = Util._.defaultsDeep({}, this.saveHargingStandard)
          saveAccommodation.ajaxParams.url += this.accommodationData.configId;
          saveAccommodation.ajaxParams.data = this.accommodationData;
          this.ajax(saveAccommodation, isLoadingFun);

          let saveDeposit = Util._.defaultsDeep({}, this.saveHargingStandard)
          saveDeposit.ajaxParams.url += this.depositData.configId;
          saveDeposit.ajaxParams.data = this.depositData;
          this.ajax(saveDeposit, isLoadingFun);

        } else {
          this.errorMess('验证失败，请修改')
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
        let flag = true;
        this.$refs[formName].map(item => {
          item.validate((valid) => {
            if (!valid) {
              flag = false;
            }
          });
        })
        return flag;
      },
      mounted () {
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep([], data).reduce((obj, item) => {
          obj[item.key] = item.configValue;
          return obj;
        }, {});
        return JSON.stringify(myData);
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
