<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row>
      <el-col>
        <h3>进修生规培报名起止时间：</h3>
        <date-group :dateGroup="{text:'',startDate:rst.configValue,endDate:ret.configValue}">
          <el-form name="start" :inline="true" ref="rst" :model="rst" :rules="rdyEnrollSet_rst">
            <el-form-item label="进修生规培报名开始时间" prop="configValue">
              <el-date-picker v-model="rst.configValue" type="date" :editable="false"
                              placeholder="选择日期" :picker-options="pickerOptions0"
                              @change="handleStartTime"></el-date-picker>
            </el-form-item>
          </el-form>
          <el-form name="end" :inline="true" ref="ret" :model="ret" :rules="rdyEnrollSet_ret">
            <el-form-item label="进修生规培报名结束时间" prop="configValue">
              <el-date-picker v-model="ret.configValue" type="date" :editable="false"
                              placeholder="选择日期" :picker-options="pickerOptions1"
                              @change="handleEndTime"></el-date-picker>
            </el-form-item>
          </el-form>
        </date-group>
      </el-col>
    </el-row>
    <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {rdyEnrollSet_rst, rdyEnrollSet_ret} from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        rdyEnrollSet_rst, rdyEnrollSet_ret,
        configKey: {
          rst: 'zyy_registration_start_time-JXS',
          ret: 'zyy_registration_end_time-JXS',
        },
        //保存按钮基本信息
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        // 住院医规培报名开始时间
        rst: {
          configId: "",
          configValue: "",  //时长
          remark: "",
        },
        // 住院医规培报名结束时间
        ret: {
          configId: "",
          configValue: "",
          remark: "",
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        for (let key in this.configKey) {
          this.getConfigData(key, this.configKey[key])
        }
      },
      // 获取轮转时长
      getConfigData(objName, str) {
        let opt = {
          ajaxSuccess: res => {
            for (let key in res.data) {
              this[objName][key] = res.data[key];
            }
          },
          ajaxError: () => this.errorMess('获取配置数据失败，请重试！'),
          ajaxParams: {
            url: api.get.path + str,
            method: api.get.method,
          }
        }
        this.ajax(opt)
      },
      /*
      * 点击提交按钮 监听是否提交数据
      * @param isLoadingFun boolean  form表单验证是否通过
      * */
      listenSubEvent(isLoadingFun) {
        let formArr = ["rst", 'ret'];
        let isSubmit = this.submitForm(formArr);
        let saveSuccess = [];
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);

          for (let key in this.configKey) {
            ((key) => {
              let data = this.$util._.defaultsDeep({}, this[key]);
              data = this.formDate(data,['configValue'],'yyyy-MM-dd');
              let opt = {
                ajaxSuccess: res => {
                  saveSuccess.push(key);
                  if (saveSuccess.length == formArr.length) {
                    this.successMess('保存成功！');
                    isLoadingFun(false);
                  }
                },
                ajaxError: () => this.errorMess('保存失败，请重试！'),
                ajaxParams: {
                  url: api.modify.path + data.configId,
                  method: api.modify.method,
                  data
                }
              };
              this.ajax(opt);
            })(key);
          }
        }
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formNameArr = []) {
        let flagArr = [];
        formNameArr.map(formName => {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              flagArr.push(true);
            }
          });
        })
        return flagArr.length == formNameArr.length;
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
