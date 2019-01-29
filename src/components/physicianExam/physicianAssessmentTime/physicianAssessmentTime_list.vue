<!--
****--@file     physicianAssessmentTime_list
****--@date     2018/5/21 11:47
****--@author   YC
****--@describe 国家医师考核-倒计时
-->
<template>
  <el-row class="physicianExamBox physicianExamineMonitor">
    <template v-if="formValidate instanceof Object">
      <el-col class="thereFloorBox">
        <div class="thereFloor">
          <h2>多媒体考试、笔试</h2>
          <br>
          <hr>
          <br>
          <el-row>
            <el-col>
              <el-form :inline="true">
                <el-form-item>
                  <a href="/static/page/physicianExamThreeTimeInfo.html?roomNum=303" target="_blank">
                    <el-button>303</el-button>
                  </a>
                </el-form-item>
                <el-form-item>
                  <a href="/static/page/physicianExamThreeTimeInfo.html?roomNum=305" target="_blank">
                    <el-button>305</el-button>
                  </a>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <hr>
          <br>
        </div>
      </el-col>
      <el-col :span="11" class="physicianExams left">
        <h2>技能操作</h2>
        <br>
        <hr>
        <br>
        <div class="physicianExamContentBox">
          <!--<el-col :span="8" v-for="(item,index) in formValidate.one" :key="index" align="center">-->
            <el-form :inline="true">
              <el-form-item v-for="(item,index) in formValidate.one" :key="index">
                <a :href="'/static/page/physicianExamTimeInfo.html?roomNum='+item.roomNum+'&examType=one&name=' + encodeURI(item.name)" target="_blank">
                  <el-button>
                    {{ item.name }}
                  </el-button>
                </a>
              </el-form-item>
            </el-form>
          <!--</el-col>-->
        </div>
      </el-col>
      <p class="lineBox"></p>
      <el-col :span="11" class="physicianExams right">
        <h2>体格检查</h2>
        <br>
        <hr>
        <br>
        <div class="physicianExamContentBox">
          <!--<el-col :span="8" v-for="(item,index) in formValidate.two" :key="index" align="center">-->
            <el-form :inline="true">
              <el-form-item v-for="(item,index) in formValidate.two" :key="index">
                <a :href="'/static/page/physicianExamTimeInfo.html?roomNum='+item.roomNum+'&examType=two&name=' + encodeURI(item.name)" target="_blank">
                  <el-button>
                    {{ item.name }}
                  </el-button>
                </a>
              </el-form-item>
            </el-form>
          <!--</el-col>-->
        </div>
      </el-col>
    </template>
    <p v-else class="errTips">{{ msgText }}</p>
  </el-row>
</template>
<style lang="scss">
  @import "../style";
</style>
<script>
  /*当前组件必要引入*/
  import api from '../physicianExamineInterval/api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianAssessmentTimeList',
    data () {
      return {
        formValidate: null,
        msgText: '数据加载中...'
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.getInfo()
      },
      getInfo () {
        let opt = {
          ajaxLoading: false,
          ajaxSuccess: res => {
            if (res.data instanceof Object && res.data.one) {
              this.formValidate = res.data;
            } else {
              this.msgText = '暂无可监控的数据'
            }
          },
          error: res => this.msgText = res.status.msg,
          ajaxParams: {
            url: api.timeLong.path,
            method: api.timeLong.method
          }
        }
        this.ajax(opt)
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
