<!--
****--@file     stageExam_list
****--@date     2018/5/3 17:04
****--@author   YC
****--@describe 一阶段考核设置
-->
<template>
  <div class="stageExam">
    <div class="stageExamBox">
      <el-row>
        <el-col>
          <el-form :model="formValidate" :rules="rules" ref="formValidate" :inline="true">
            <el-form-item label="考试时长：" prop="timeLong" label-width="100px" style="margin-bottom: 0;">
              <el-input v-model="formValidate.timeLong" placeholder="请输入考试时长" :disabled="setStatus || !!formValidate.examStatus">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
            <el-form-item label="轮内站数：" prop="index">
              <el-input v-model="formValidate.index" placeholder="请输入轮内站数" :disabled="setStatus || !!formValidate.examStatus"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col class="stageExamBtnBox">
          <el-button @click="changeStatus('READY')" :disabled="setStatus || !!formValidate.examStatus">考试准备</el-button>
          <el-button @click="changeStatus('START')" type="success"
                     :disabled="setStatus || !formValidate.examStatus || !['READY'].includes(formValidate.examStatus)">考试开始
          </el-button>
          <el-button @click="changeStatus('SUSPEND')" type="warning"
                     :disabled="setStatus || !formValidate.examStatus || !['START','ONGOING'].includes(formValidate.examStatus)">考试暂停
          </el-button>
          <el-button @click="changeStatus('ONGOING')" type="info"
                     :disabled="setStatus || !formValidate.examStatus || !['SUSPEND'].includes(formValidate.examStatus)">考试恢复
          </el-button>
          <el-button @click="changeStatus('FINISH')" type="info"
                     :disabled="setStatus || !formValidate.examStatus || !['ONGOING','SUSPEND'].includes(formValidate.examStatus)">考试结束
          </el-button>
          <el-button @click="changeStatus('EMPTY')" type="danger"
                     :disabled="setStatus || !formValidate.examStatus || !['ONGOING','SUSPEND'].includes(formValidate.examStatus)">清空
          </el-button>
        </el-col>
      </el-row>
      <hr>
      <br>
      <h3>倒计时链接</h3>
      <div class="stageExamStationBox">
        <a class="el-button" v-for="index in 6" :key="index"
           :href="'/static/page/stageExamCountDown.html?index='+index" target="_blank">
          第{{ (index-1) | num2Str }}考站</a>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .stageExamBtnBox {
    .el-button {
      margin-right: 7px;
      margin-bottom: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }

  .stageExamStationBox {
    margin-top: 20px;
    .el-button {
      margin-right: 5px;
      margin-bottom: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import { stageExam as rules } from '../rules'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'stageExamList',
    data () {
      return {
        rules,
        time: 0,
        resetStatus: false,
        setStatus: true, // 是否在设置状态
        formValidate: {
          examStatus: '', // 考核状态 (READY|考核准备、ONGOING|考核中、SUSPEND|考核暂停、FINISH|结束考核)
          timeLong: '10', // 考核时长（以秒为单位）
          index: '6' // 轮次
        },
        infoInterval: null,
        resetStatusInt: null
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.getInfo();
        this.loadInfo();
      },
      // 设置状态时是否允许编辑
      setStatusCall (b = false) {
        if (this.setStatus != b) {
          this.setStatus = b;
        }
      },
      // 切换状态
      changeStatus (s) {
        if (!this.submitForm('formValidate')) {
          this.errorMess('请输入考试时长')
          return
        }
        let opt = {
          ajaxSuccess: res => {
            this.setStatusCall();
            console.log(s)
            this.formValidate.examStatus = (['EMPTY', 'FINISH'].includes(s) ? '' : s);
            this.resetStatusInt = setTimeout(() => {
              this.resetStatus = false
            }, 2000)
          },
          ajaxParams: {
            url: 'stage/exam',
            method: 'put',
            data: {
              examStatus: s,
              timeLong: this.formValidate.timeLong * 60,
              index: this.formValidate.index
            }
          }
        }
        this.resetStatus = true
        this.setStatusCall(true)
        clearTimeout(this.resetStatusInt)
        this.ajax(opt)
      },
      // 获取配置信息
      getInfo () {
        let opt = {
          ajaxLoading: false,
          ajaxSuccess: res => {
            if (!this.resetStatus && res.data instanceof Object) {
              this.formValidate.timeLong = (res.data.timeLong && res.data.timeLong / 60) || this.formValidate.timeLong
              this.formValidate.examStatus = ((res.data.examStatus === null || ['EMPTY', 'FINISH'].includes(res.data.examStatus)) ? '' : (res.data.examStatus || this.formValidate.examStatus)).toString()
              this.formValidate.index = (res.data.index || this.formValidate.index).toString()
              this.setStatusCall()
            }
          },
          ajaxParams: {
            url: 'stage/info'
          }
        }
        this.ajax(opt)
      },
      // 定时同步配置
      loadInfo () {
        this.infoInterval = setInterval(() => this.getInfo(), 5 * 1000)
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
    destroyed () {
      clearInterval(this.infoInterval)
      clearTimeout(this.resetStatusInt)
    },
    components: {}
  }

</script>
