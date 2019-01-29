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
        <h3>二维码时效设置</h3>
        <el-form :inline="true" :model="qr" :rules="rotaryBasisSet_qr" ref="qr">
          <el-form-item label="科室报到扫描二维码时效设置：" prop="configValue">
            <el-input placeholder="请输入时长" v-model="qr.configValue">
              <template slot="append">秒</template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col>
        <h3>补轮转缺勤比例设置</h3>
        <el-form :inline="true" :model="sxs" :rules="rotaryBasisSet_blz" ref="sxs">
          <el-form-item label="实习生补轮转缺勤比例：" prop="configValue">
            <el-input placeholder="请输入数字" v-model="sxs.configValue">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="zyy" :rules="rotaryBasisSet_blz" ref="zyy">
          <el-form-item label="住院医补轮转缺勤比例：" prop="configValue">
            <el-input placeholder="请输入数字" v-model="zyy.configValue">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="yjs" :rules="rotaryBasisSet_blz" ref="yjs">
          <el-form-item label="研究生补轮转缺勤比例：" prop="configValue">
            <el-input placeholder="请输入数字" v-model="yjs.configValue">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="jxs" :rules="rotaryBasisSet_blz" ref="jxs">
          <el-form-item label="进修生补轮转缺勤比例：" prop="configValue">
            <el-input placeholder="请输入数字" v-model="jxs.configValue">
              <template slot="append">%</template>
            </el-input>
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
  import {rotaryBasisSet_qr, rotaryBasisSet_blz} from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        rotaryBasisSet_qr, rotaryBasisSet_blz,
        configKey: {
          qr: 'rotary_signdep_time_mes-ZYY',
          sxs: 'rotary_stu_absenteeism_rate-SXS',
          zyy: 'rotary_stu_absenteeism_rate-ZYY',
          yjs: 'rotary_stu_absenteeism_rate-YJS',
          jxs: 'rotary_stu_absenteeism_rate-JXS',
        },
        //保存按钮基本信息
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        //二维码时长设置
        qr: {
          configId: "",
          configValue: "",  //时长
          remark: "",
        },
        // 实习生
        sxs: {
          configId: "",
          configValue: "",
          remark: "",
        },
        // 住院医
        zyy: {
          configId: "",
          configValue: "",
          remark: "",
        },
        // 研究生
        yjs: {
          configId: "",
          configValue: "",
          remark: "",
        },
        // 进修生
        jxs: {
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
        let formArr = ["qr", 'sxs', 'zyy', 'yjs', 'jxs'];
        let isSubmit = this.submitForm(formArr);
        let saveSuccess = [];
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);

          for (let key in this.configKey) {
            ((key)=>{
              let data = this.$util._.defaultsDeep({}, this[key]);
              let opt = {
                ajaxSuccess: res => {
                  saveSuccess.push(key);
                  if(saveSuccess.length == formArr.length){
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
