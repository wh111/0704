<!--
****--@file     stageExam_list
****--@date     2018/5/3 17:04
****--@author   YC
****--@describe 一阶段考核设置
-->
<template>
  <div class="stageExam">
    <!--<el-col align="right">-->
      <!--<a href="/static/page/stageExamCountDown.html" target="_blank">全屏查看倒计时</a>-->
    <!--</el-col>-->
    <!--<p class="ctDown">考试剩余时间：{{ time | second2Format }}</p>-->
    <div class="stageExamBox">
      <el-row>
        <el-col :lg="4" :md="8" :sm="12" :xs="24" align="center">
          <el-form :model="formValidate" :rules="rules" ref="formValidate">
            <el-form-item label="考试时长：" prop="timeLong" label-width="100px" style="margin-bottom: 0;">
              <el-input v-model="formValidate.timeLong" placeholder="请输入考试时长" :disabled="setStatus || !!formValidate.examStatus">
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24" align="center">
          <el-button @click="changeStatus('READY')" :disabled="setStatus || !!formValidate.examStatus">考试准备</el-button>
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24" align="center">
          <el-button @click="changeStatus('START')" type="success"
                     :disabled="setStatus || !formValidate.examStatus || !['READY'].includes(formValidate.examStatus)">考试开始
          </el-button>
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24" align="center">
          <el-button @click="changeStatus('SUSPEND')" type="warning"
                     :disabled="setStatus || !formValidate.examStatus || !['ONGOING'].includes(formValidate.examStatus)">考试暂停
          </el-button>
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24" align="center">
          <el-button @click="changeStatus('ONGOING')" type="info"
                     :disabled="setStatus || !formValidate.examStatus || !['SUSPEND'].includes(formValidate.examStatus)">考试恢复
          </el-button>
        </el-col>
        <el-col :lg="4" :md="8" :sm="12" :xs="24" align="center">
          <el-button @click="changeStatus('FINISH')" type="danger"
                     :disabled="setStatus || !formValidate.examStatus || !['ONGOING'].includes(formValidate.examStatus)">考试结束
          </el-button>
        </el-col>

      </el-row>
    </div>
  </div>
</template>
<style lang="scss">
  .stageExam {
    height: 100%;
    position: relative;
    .ctDown {
      width: 100%;
      text-align: center;
      font-size: 100px;
      line-height: normal;
      position: absolute;
      left: 0;
      top: 20%;
      transform: translateY(-50%);
    }
  }

  .stageExamBox {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    .el-col {
      padding: 20px 0;
      min-height: 78px;
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
          timeLong: '' // 考核时长（以秒为单位）
        },
        infoInterval: null,
        timeInterval: null
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.getInfo();
        this.loadInfo();
//        this.loadTime()
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
            this.formValidate.examStatus = s == 'FINISH' ? '' : s;
            setTimeout(() => {
              this.resetStatus = false
            }, 2000)
          },
          ajaxParams: {
            url: 'stage/exam',
            method: 'put',
            data: {
              examStatus: s,
              timeLong: this.formValidate.timeLong * 60
            }
          }
        }
        this.resetStatus = true
        this.setStatusCall(true)
        this.ajax(opt)
      },
      // 获取配置信息
      getInfo () {
        let opt = {
          ajaxSuccess: res => {
            if (!this.resetStatus && res.data instanceof Object) {
              this.formValidate.timeLong = (res.data.timeLong && res.data.timeLong / 60) || this.formValidate.timeLong;
              this.formValidate.examStatus = (res.data.examStatus || this.formValidate.examStatus).toString()
              this.setStatusCall()
            }
          },
          ajaxParams: {
            url: 'stage/info'
          }
        }
        this.ajax(opt)
      },
      // 获取倒计时时间
      getTime () {
        let opt = {
          ajaxSuccess: res => {
            this.time = res.data || 0
          },
          ajaxParams: {
            url: 'stage/getTime'
          }
        }
        this.ajax(opt)
      },
      // 加载倒计时
      loadTime () {
        this.timeInterval = setInterval(() => this.getTime(), 1000)
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
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
    },
    created () {
      this.init();
    },
    mounted () {
    },
    destroyed () {
      clearInterval(this.timeInterval)
      clearInterval(this.infoInterval)
    },
    components: {}
  }

</script>
