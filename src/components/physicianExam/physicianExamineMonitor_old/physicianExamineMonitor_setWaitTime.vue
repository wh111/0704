<!--
****--@file     physicianExamineMonitor_setWaitTime
****--@date     2018/5/23 17:38
****--@author   YC
****--@describe 设置等待时间
-->
<template>
  <el-row>
    <el-form ref="formValidate" :model="formValidate" :inline="true" :rules="rules" label-width="100px">
      <el-form-item label="开始时间：" prop="startTime">
        <el-time-picker :editable="false" v-model="formValidate.startTime" :picker-options="pickerOptions" placeholder="请选择时间">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="延长时长：" prop="timeLong" style="margin-right: 0;">
        <el-input v-model="formValidate.timeLong">
          <template slot="append">min</template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-col align="right">
      <el-button type="danger" @click="cancel">取消</el-button>
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
    </el-col>
  </el-row>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  import { physicianExamineMonitorWaitTime as rules } from '../rules'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianExamineMonitorSetWaitTime',
    props: ['id', 'time'],
    data () {
      return {
        rules,
        pickerOptions: {
          selectableRange: '00:00:00 - 23:30:00'
        },
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        formValidate: {
          startTime: '',
          timeLong: ''
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.formValidate.startTime = new Date('2018-01-01 ' + (this.time || '00:00:00'))
        console.log(this.id, this.time)
      },
      /***************************************** 提交处理 **********************************************************************/
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let data = Util._.defaultsDeep({}, this.formValidate)
          data.timeLong = data.timeLong * 60
          data.startTime = this.conductDate(data.startTime, 'yyyy-MM-dd HH:mm:ss').split(' ')[1]
          let opt = {
            ajaxSuccess: () => {
              this.successMess('保存成功！')
              this.$emit('set')
            },
            ajaxParams: {
              url: api.settingTime.path + this.id,
              method: api.settingTime.method,
              data
            }
          }
          this.ajax(opt, isLoadingFun)
        }
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
      cancel () {
        this.$emit('cancel')
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  }

</script>
