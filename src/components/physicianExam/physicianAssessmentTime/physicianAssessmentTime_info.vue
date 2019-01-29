<!--
****--@file     physicianAssessmentTime_info
****--@date     2018/5/24 14:29
****--@author   YC
****--@describe 倒计时
-->
<template>
  <el-row class="physicianAssessmentTimeView" :style="{height: height+'px'}">
    <el-col :span="8">
      <h2>{{ nowTime | formatDate('yyyy年MM月dd日') }}</h2>
    </el-col>
    <el-col :span="8" align="center"><h2>{{ nowTime ? '星期' + week[new Date(nowTime).getDay()] : '-' }}</h2></el-col>
    <el-col :span="8" align="right">
      <h2>{{ nowTime && ((new Date(nowTime).toLocaleString()).split(' '))[1] || '-' }}</h2>
    </el-col>
    <div class="timeInfo">
      <h3>考试剩余时间</h3>
      <h3>{{ (hasTime || '') | second2Format }}</h3>
    </div>
    <div align="right" class="todoBtns" v-if="type != 'fullView' && ['5','6'].includes((showData.examOrder || '').toString())">
      <el-button type="info" @click="finish" :disabled="!hasTime || hasTime < 1 || showData.examStaus === 'SUSPEND'">结束考试</el-button>
    </div>
  </el-row>
</template>
<style lang="scss">
  .physicianAssessmentTimeView {
    position: relative;
    .timeInfo {
      width: 100%;
      text-align: center;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      animation: all 2s ease-in;
      h3 {
        font-size: 6vw;
        line-height: 8vw;
      }
    }
    .todoBtns {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianAssessmentTimeInfo',
    props: ['roomNum', 'viewHeight', 'clearInt', 'type'],
    data () {
      return {
        nowTime: '',
        hasTime: '',
        week: ['日', '一', '二', '三', '四', '五', '六'],
        height: this.viewHeight || 0,
        showData: {
          examDate: '',
          examOrder: '',
          examId: '',
          startTime: ''
        },
        loadDataInt: null,
        nowTimeInt: null
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        if (this.roomNum) {
          this.getNowTime()
          this.loadData()
        }
      },
      finish () {
        let opt = {
          ajaxSuccess: res => {
            this.getShowData()
          },
          ajaxParams: {
            url: api.finish.path,
            method: api.finish.method,
            data: {
              roomNum: this.roomNum,
              examId: this.showData.examId,
              startTime: this.showData.startTime
            }
          }
        }
        this.ajax(opt)
      },
      loadData () {
        this.getShowData()
        clearInterval(this.loadDataInt)
        if (this.clearInt) {
          return
        }
        this.loadDataInt = setInterval(() => this.getShowData(), 1000)
      },
      getNowTime () {
        clearInterval(this.nowTimeInt)
        this.getNowTimeCall()
      },
      getNowTimeCall () {
        let opt = {
          ajaxLoading: false,
          ajaxSuccess: res => {
            let _this = this
            this.nowTime = parseInt(res.data)
            this.nowTimeInt = setInterval(() => {
              _this.nowTime += 1000
            }, 1000)
          },
          ajaxParams: {
            url: '/nowTime'
          }
        }
        this.ajax(opt)
      },
      // 获取查看数据
      getShowData () {
        let opt = {
          ajaxLoading: false,
          ajaxSuccess: res => {
            this.showData = res.data
            this.hasTime = res.data.time || 0
          },
          ajaxParams: {
            url: api.get.path,
            method: api.get.method,
            params: {
              roomNum: this.roomNum
            }
          }
        }
        this.ajax(opt)
      },
      clearIntCall () {
        clearInterval(this.nowTimeInt)
        clearInterval(this.loadDataInt)
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    beforeDestroy () {
      this.clearIntCall()
    },
    watch: {
      roomNum () {
        this.loadData()
      },
      viewHeight (val) {
        this.height = val
      },
      clearInt (val) {
        if (val) {
          this.clearIntCall()
          console.log('清除')
        } else {
          this.init()
          console.log('启动')
        }
      }
    },
    components: {}
  }

</script>
