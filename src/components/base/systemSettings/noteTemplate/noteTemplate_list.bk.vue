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
        <h3>住院医短信接口参数配置</h3>
        <el-form :inline="true" :model="zyy_bd_start_time" :rules="noteTemplate_time" ref="zyy_bd_start_time">
          <el-form-item label="开始时间：" prop="configValue">
            <el-date-picker v-model="zyy_bd_start_time.configValue" :editable="false" type="date"
                            placeholder="选择日期"></el-date-picker>
            <span>（住院医录取后报到开始时间）</span>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="zyy_bd_end_time" :rules="noteTemplate_time" ref="zyy_bd_end_time">
          <el-form-item label="结束时间：" prop="configValue">
            <el-date-picker v-model="zyy_bd_end_time.configValue" :editable="false" type="date"
                            placeholder="选择日期"></el-date-picker>
            <span>（住院医录取后报到结束时间）</span>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="zyy_bd_address" :rules="noteTemplate_str" ref="zyy_bd_address">
          <el-form-item label="报到地址：" prop="configValue">
            <el-input v-model="zyy_bd_address.configValue" placeholder="例：A教学楼111室"></el-input>
            <span>（住院医录取后报到地址）</span>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="zyy_kh_year_mouth_day" :rules="noteTemplate_time" ref="zyy_kh_year_mouth_day">
          <el-form-item label="考核日期：" prop="configValue">
            <el-date-picker v-model="zyy_kh_year_mouth_day.configValue" format="yyyy年MM月dd日" :editable="false"
                            type="date" placeholder="选择日期"></el-date-picker>
            <span>（住院医报名招录考核日期）</span>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="zyy_kh_detail_time" :rules="noteTemplate_str" ref="zyy_kh_detail_time">
          <el-form-item label="考核时间：" prop="configValue">
            <el-input v-model="zyy_kh_detail_time.configValue" placeholder="例：上午9点"></el-input>
            <span>（住院医报名招录考核通知考核时间）</span>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="zyy_kh_detail_address" :rules="noteTemplate_str" ref="zyy_kh_detail_address">
          <el-form-item label="考核地址：" prop="configValue">
            <el-input v-model="zyy_kh_detail_address.configValue" placeholder="例：B教学楼222室"></el-input>
            <span>（住院医报名招录考核通知考核考试地址）</span>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="zyy_kh_weather_2B_Pencil" :rules="noteTemplate_str"
                 ref="zyy_kh_weather_2B_Pencil">
          <el-form-item label="2B铅笔：" prop="configValue">
            <el-input v-model="zyy_kh_weather_2B_Pencil.configValue" placeholder="例：无需2B铅笔"></el-input>
            <span>（住院医报名招录考核通知考核是否需要带2B铅笔）</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {noteTemplate_time, noteTemplate_str} from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        noteTemplate_time, noteTemplate_str,
        configKey: {
          zyy_bd_start_time: "zyy_bd_start_time-ZYY",
          zyy_bd_end_time: "zyy_bd_end_time-ZYY",
          zyy_bd_address: "zyy_bd_address-ZYY",
          zyy_kh_year_mouth_day: "zyy_kh_year_mouth_day-ZYY",
          zyy_kh_detail_time: "zyy_kh_detail_time-ZYY",
          zyy_kh_detail_address: "zyy_kh_detail_address-ZYY",
          zyy_kh_weather_2B_Pencil: "zyy_kh_weather_2B_Pencil-ZYY",
        },
        //保存按钮基本信息
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},

        zyy_bd_start_time: {configId: "", configValue: "", remark: "",},
        zyy_bd_end_time: {configId: "", configValue: "", remark: "",},
        zyy_bd_address: {configId: "", configValue: "", remark: "",},
        zyy_kh_year_mouth_day: {configId: "", configValue: "", remark: "",},
        zyy_kh_detail_time: {configId: "", configValue: "", remark: "",},
        zyy_kh_detail_address: {configId: "", configValue: "", remark: "",},
        zyy_kh_weather_2B_Pencil: {configId: "", configValue: "", remark: "",},
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
              if (objName === 'zyy_kh_year_mouth_day' && key === 'configValue') {
                this[objName][key] = res.data[key].replace(/(\d{4}).*(\d{2}).*(\d{2}).*/, '$1-$2-$3')
              } else {
                this[objName][key] = res.data[key];
              }
            }
          },
          ajaxError: () => this.errorMess('获取配置数据失败，请重试！'),
          ajaxParams: {
            url: api.rotarySigndepTime.path + str,
            method: api.rotarySigndepTime.method,
          }
        }
        this.ajax(opt)
      },
      /*
      * 点击提交按钮 监听是否提交数据
      * @param isLoadingFun boolean  form表单验证是否通过
      * */
      listenSubEvent(isLoadingFun) {
        let formArr = [];
        for (let key in this.configKey) {
          formArr.push(key)
        }
        let isSubmit = this.submitForm(formArr);
        let saveSuccess = [];
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);

          for (let key in this.configKey) {
            ((key) => {
              let data = this.$util._.defaultsDeep({}, this[key]);
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
                  url: api.modifyConfigId.path + data.configId,
                  method: api.modifyConfigId.method,
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
