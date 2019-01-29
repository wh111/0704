<template>
  <!-- 新增广播任务 -->
  <div class="editForm audioDebugTask">
    <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="100px">
      <el-row>

        <el-col :span="8" :offset="2">
          <el-form-item label="任务名称：" prop="name">
            <el-input v-model="formValidate.name"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="发送模式：">
            <el-select v-model="formValidate.sendMode" placeholder="请选择">
              <el-option v-for="item in sendMode" v-if="item.value !== ''" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="播放模式：">
            <el-radio-group v-model="formValidate.playMode">
              <div class="adtProjectBox">
                <div class="thProjectItem">
                  <el-radio label="WHENLONG">
                    <span>播放时长：</span>
                    <el-select :disabled="formValidate.playMode!='WHENLONG'" v-model="formValidate.hour" style="width:60px;">
                      <el-option :key="0" :label="0" :value="0"></el-option>
                      <el-option v-for="item in 12" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <span class="adtTimeText">小时</span>
                    <el-select :disabled="formValidate.playMode!='WHENLONG'" v-model="formValidate.minute" style="width:65px;">
                      <el-option :key="0" :label="0" :value="0"></el-option>
                      <el-option v-for="item in 60" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <span class="adtTimeText">分钟</span>
                    <el-select :disabled="formValidate.playMode!='WHENLONG'" v-model="formValidate.second" style="width:65px;">
                      <el-option v-for="item in 60" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                    <span class="adtTimeText">秒</span>
                  </el-radio>
                </div>
                <div class="thProjectItem">
                  <el-radio label="FREQUENCY">
                    <span>播放次数：</span>
                    <el-input :disabled="formValidate.playMode!='FREQUENCY'" v-model="formValidate.frequency" placeholder="0为循环播放" :maxLength="4" style="width:158px;"></el-input>
                    <span>（0为循环播放）</span>
                  </el-radio>
                </div>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="定时执行：">
            <el-checkbox v-model="formValidate.isTiming" trueLabel="YES" falseLabel="NO"></el-checkbox>
          </el-form-item>
        </el-col>

        <template v-if="formValidate.isTiming === 'YES'">
          <el-col :span="8" :offset="2">
            <el-form-item label="开始时间：">
              <el-time-picker v-model="formValidate.startTime" :editable="false" placeholder="选择时间"></el-time-picker>
            </el-form-item>
          </el-col>

          <date-group :dateGroup="{text:'',startDate:formValidate.startDate,endDate:formValidate.endDate}">

            <el-col :span="8" :offset="2">
              <el-form-item label="开始日期：">
                <el-date-picker v-model="formValidate.startDate" type="date" placeholder="选择日期" :picker-options="pickerOptions0" @change="handleStartTime">
                </el-date-picker>
              </el-form-item>
            </el-col>

          </date-group>

          <el-col :span="8" :offset="2">
            <el-form-item label="循环周期：">
              <el-checkbox v-model="cycleEveryDay" label="每天" trueLabel="1" falseLabel="0" @change="changeCycle(true)"></el-checkbox>
              <el-checkbox-group v-model="cycle" class="audioDebugCheckBox" @change="changeCycle(false)">
                <el-checkbox value="" label="1">周一</el-checkbox>
                <el-checkbox value="" label="2">周二</el-checkbox>
                <el-checkbox value="" label="3">周三</el-checkbox>
                <el-checkbox value="" label="4">周四</el-checkbox>
                <el-checkbox value="" label="5">周五</el-checkbox>
                <el-checkbox value="" label="6">周六</el-checkbox>
                <el-checkbox value="" label="7">周日</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2">
            <el-form-item label="结束日期：">
              <el-date-picker v-model="formValidate.endDate" type="date" placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </template>


        <el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="播放音频：" prop="path">
              <!-- <el-input v-model="formValidate.path"></el-input> -->
              <el-select v-model="formValidate.path" placeholder="请选择文件">
                <el-option v-for="(item,index) in filePath" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>

      </el-row>
    </el-form>
    <el-row>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  let Util = null;
  import {
    audioTask as rules
  } from '../../../rules';
  import api from '../api';
  import sendMode from './sendMode'; // 播放模式
  export default {
    data() {
      return {
        sendMode,
        rules,
        cycleEveryDay: '1', // 周期
        cycle: [],
        filePath: [],
        formValidate: {
          name: '', // 任务名称
          playMode: 'WHENLONG', // 播放模式 WHENLONG按时长|FREQUENCY按次数
          hour: '0', // 时
          minute: '0', // 分
          second: '1', // 秒
          frequency: '', // 次数
          sendMode: 'UNICAST', // 发送模式 UNICAST单播|MULTICAST组播
          isTiming: 'NO', // 是否定时 YES是|NO否
          startTime: '', // 开始时间 hh:mm:ss
          startDate: '', // 开始日期 YYYY-MM-DD
          endDate: '', // 结束日期 YYYY-MM-DD
          cycle: '', // 周期
          path: '', // 要播放文件地址
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        // 增加
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.taskAdd.path,
            method: api.taskAdd.method
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
        let isSubmit = this.submitForm("formValidate") && this.checkData();
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.formValidate.cycle = this.cycle.join(',');
          let data = this.getFormData(this.formValidate);
          data.startTime = this.conductDate(data.startTime, 'HH:mm:ss');
          data.startDate = this.conductDate(data.startDate, 'yyyy-MM-dd');
          data.endDate = this.conductDate(data.endDate, 'yyyy-MM-dd');
          this.addMessTitle.ajaxParams.data = data;
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
        return flag;
      },
      // 检测数据
      checkData() {
        let data = this.formValidate;
        if (data.playMode === 'FREQUENCY') {
          if (!(!isNaN(data.frequency) && data.frequency > -1 && data.frequency < 10000)) {
            this.errorMess('播放次数0-10000之间！');
            return false
          } else if (data.frequency < 0 || data.frequency > 10000) {
            data.frequency = '0';
          }
        }
        if (data.isTiming === 'YES') {
          if (!data.startTime) {
            this.errorMess('请设置开始时间');
            return false
          }
          if (!data.startDate) {
            this.errorMess('请设置开始日期');
            return false
          }
          if (!data.endDate) {
            this.errorMess('请设置结束日期');
            return false
          }
        }
        return true
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /**
       * 周期为每天
       **/
      changeCycle(type) {
        if (type) { // 每天
          if (this.cycleEveryDay > 0) {
            this.cycle = []
          }
        } else { // 指定周期
          this.cycleEveryDay = '0'
        }
      },
      // 获取文件
      getFilePath() {
        let opt = {
          ajaxSuccess: res => this.filePath = res.data,
          ajaxError: () => this.errorMess('获取播放文件列表失败，请重试！'),
          ajaxParams: {
            url: api.getFilePath.path
          }
        };
        this.ajax(opt)
      },
    },
    created() {
      Util = this.$util;
      this.getFilePath()
    }
  }

</script>

<style lang="scss">
  @import'../../../../../assets/ambuf/css/manage_v1.0/editForm';
  .audioDebugCheckBox {
    .el-checkbox:nth-child(3n+1) {
      margin-left: 0;
    }
  }

  .el-time-panel {
    .el-time-spinner__list::after,
    .el-time-spinner__list::before {
      height: 72px;
    }
  }

  .adtProjectBox {
    width: 100%;
    display: inline-block;
    .thProjectItem {
      line-height: 36px;
    }
    .thUserItem {
      margin-left: 6px;
      margin-top: -9px;
    }
    .el-select {
      .el-input {
        width: 60px;
        min-width: auto;
      }
    }
    .adtTimeText {
      margin: 0 4px;
    }
  }

</style>
