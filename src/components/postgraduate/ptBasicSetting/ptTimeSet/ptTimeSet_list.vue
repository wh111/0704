<!----------------------------------
****--@name     时间设置
****--@role     ${*}
****--@date     2017/10/19
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-form ref="noticeOfNotice" :model="noticeOfNoticeData" :rules="rules" inline label-width="110px"
             class="demo-ruleForm">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="24">
          <el-form-item label="报到须知显示:" prop="configValue">
            <el-input style="width:300px;" v-model="noticeOfNoticeData.configValue">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form ref="trainingPlanTime" :model="trainingPlanTimeData" :rules="rules" inline label-width="110px"
             class="demo-ruleForm">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="24">
          <el-form-item label="培养计划周期:" prop="configValue">
            <el-input style="width:300px;" v-model="trainingPlanTimeData.configValue">
              <template slot="append">月</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form ref="defenceTime" :model="defenceTimeData" :rules="rules" inline label-width="110px" class="demo-ruleForm">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="24">
          <el-form-item label="答辩周期:" prop="configValue">
            <el-input style="width:300px;" v-model="defenceTimeData.configValue">
              <template slot="append">月</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!--列表操作按钮-->
      <div style="padding-left: 110px;">
        <el-button type="primary" @click="confirm">提交</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api                        from '../api';
  import { ptTimeSetList as rules } from '../rules.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        rules,
        //答辩周期
        defenceTimeData: {
          configValue: '',
          configId: '',
          remark: ''
        },
        //培养计划周期
        trainingPlanTimeData: {
          configId: '',
          configValue: '',
          remark: ''
        },
        // 研究生报到须知显示时长
        noticeOfNoticeData: {
          configId: '',
          configValue: '',
          remark: ''
        },
        //获取答辩周期
        getDefenceTimeTitle: {
          ajaxSuccess: 'getDefenceTimeData',
          ajaxParams: {
            url: api.getByKey.path + 'defence_time-YJS'
          }
        },
        //获取培养计划周期
        getTrainingPlanTimeTitle: {
          ajaxSuccess: 'getTrainingPlanTimeData',
          ajaxParams: {
            url: api.getByKey.path + 'training_plan_time-YJS'
          }
        },
        //获取研究生报到须知显示时长
        getNoticeOfNotice: {
          ajaxSuccess: 'getNoticeOfNoticeData',
          ajaxParams: {
            url: api.getByKey.path + 'notice_of_notice-YJS'
          }
        },
        //设置培养计划周期
        setTrainingPlanTimeTitle: {
          ajaxSuccess: 'setSuccess',
          ajaxParams: {
            url: api.modifyConfig.path,
            method: api.modifyConfig.method,
            data: {}
          }
        },
        //设置答辩周期
        setDefenceTimeTitle: {
          ajaxSuccess: 'setSuccess',
          ajaxParams: {
            url: api.modifyConfig.path,
            method: api.modifyConfig.method,
            data: {}
          }
        },
        //设置研究生报到须知显示时长
        setNoticeOfNotice: {
          ajaxSuccess: 'setSuccess',
          ajaxParams: {
            url: api.modifyConfig.path,
            method: api.modifyConfig.method,
            data: {}
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.ajax(this.getDefenceTimeTitle);
        this.ajax(this.getTrainingPlanTimeTitle);
        this.ajax(this.getNoticeOfNotice);
      },

      //获取答辩周期
      getDefenceTimeData (res) {
        let data = res.data;
        this.defenceTimeData = data;
        this.setDefenceTimeTitle.ajaxParams.url += data.configId;
      },

      //获取培养计划周期
      getTrainingPlanTimeData (res) {
        let data = res.data;
        this.trainingPlanTimeData = data;
        this.setTrainingPlanTimeTitle.ajaxParams.url += data.configId;
      },

      //获取培养计划周期
      getNoticeOfNoticeData (res) {
        let data = res.data;
        this.noticeOfNoticeData = data;
        this.setNoticeOfNotice.ajaxParams.url += data.configId;
      },

      //提交
      confirm () {
        let isSubmitPlanTime = this.submitForm('trainingPlanTime');
        let isSubmitDefenceTime = this.submitForm('defenceTime');
        let isSubmitNoticeOfNotice = this.submitForm('noticeOfNotice');
        if (!isSubmitPlanTime || !isSubmitDefenceTime || !isSubmitNoticeOfNotice) {
          this.errorMess('填写有误，请修改');
          return;
        }

        //培养计划周期
        this.setTrainingPlanTimeTitle.ajaxParams.data = this.trainingPlanTimeData;
        this.ajax(this.setTrainingPlanTimeTitle);
        //答辩周期
        this.setDefenceTimeTitle.ajaxParams.data = this.defenceTimeData;
        this.ajax(this.setDefenceTimeTitle);
        //研究生报到须知显示时长
        this.setNoticeOfNotice.ajaxParams.data = this.noticeOfNoticeData;
        this.ajax(this.setNoticeOfNotice);
      },

      setSuccess () {
        this.successMess('设置成功');
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
      }

    },
    created () {
      this.init();
    },
    mounted () {

    },
    components: {}
  };
</script>
