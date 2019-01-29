<!--
****--@file     physicianExamineMonitor_list
****--@date     2018/5/21 11:44
****--@author   YC
****--@describe 国家医师考核-考核监控
-->
<template>
  <div ref="content" style="height: 100%;">
    <div class="physicianExamineMonitor">
      <template v-if="tabHeader">
        <div class="em_tabHeader" style="position:relative;">
          <div style="padding-right:140px;">
            <el-tabs v-model="tabHeader" @tab-click="selectExam">
              <template v-for="item in tabList">
                <el-tab-pane :label="item.examName" :name="(item.examId).toString()" :key="item.examId"></el-tab-pane>
              </template>
            </el-tabs>
          </div>
          <div style="width:140px;height:42px;border-bottom:1px solid #d1dbe5;position:absolute;right:0;top:0;text-align:right;">
            <el-button type="info" @click="setDefault">设置为默认考场</el-button>
          </div>
        </div>
        <div ref="table">
          <ab-table-gk :tableData="tableData" :tableHeight="tableHeight"></ab-table-gk>
        </div>
        <br>
        <hr>
        <br>
        <div class="control">
          <h2>考核控制</h2>
          <el-row>
            <el-col :span="6">
              <!-- 非发布状态都不能操作 -->
              <el-button type="success" :disabled="!examStatus || !['PUBLISH'].includes(examStatus)" @click="start">开始考试</el-button>
            </el-col>
            <el-col :span="6">
              <!-- 暂停和结束都不能操作 -->
              <el-button type="warning" :disabled="!examStatus || showDataInfo.physicianexamSuspendStatus || !['ONGOING'].includes(examStatus)"
                         @click="modifySuspend(2,'SUSPEND')">暂停考试-3层
              </el-button>
            </el-col>
            <el-col :span="6">
              <!-- 暂停才能操作 -->
              <el-button type="info" :disabled="!examStatus || !showDataInfo.physicianexamSuspendStatus" @click="modifySuspend(2,'ONGOING')">恢复考试-3层</el-button>
            </el-col>
            <el-col :span="6">
              <!-- 考核中才能操作 -->
              <el-button type="danger" :disabled="!examStatus || !['ONGOING'].includes(examStatus)" @click="finish">结束考试</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="danger" @click="reStartAudio">重启广播</el-button>
            </el-col>
            <el-col :span="6">
              <!-- 暂停和结束都不能操作 -->
              <el-button type="warning" :disabled="!examStatus || showDataInfo.physicianexamSuspendThirdStatus || !['ONGOING'].includes(examStatus)"
                         @click="modifySuspend(3,'SUSPEND')">暂停考试-5层
              </el-button>
            </el-col>
            <el-col :span="6">
              <!-- 暂停才能操作 -->
              <el-button type="info" :disabled="!examStatus || !showDataInfo.physicianexamSuspendThirdStatus" @click="modifySuspend(3,'ONGOING')">恢复考试-5层
              </el-button>
            </el-col>
            <el-col :span="6">
              <!-- 考核结束就不能操作 -->
              <el-button type="success" :disabled="!examStatus || ['FINISH'].includes(examStatus)" @click="openWaitTime">调整3~5层<br>换站时间</el-button>
            </el-col>
          </el-row>
        </div>
      </template>
      <p v-else style="position: absolute;top: 50%;text-align: center;width: 100%;">暂无可监控的考核场次</p>
    </div>
    <!--设置换站时间弹窗-->
    <Modal :mask-closable="false" v-model="viewModal" height="200" class-name="vertical-center-modal" :width="670">
      <modal-header slot="header" :parent="self" :content="contentHeader.viewId"></modal-header>
      <set-wait-time v-if="viewModal" :id="this.tabHeader" :time="lastWaitTime" @cancel="cancel('view')" @set="setWaitTimeDone"></set-wait-time>
      <div slot="footer"></div>
    </Modal>
    <!-- 重启广播 -->
    <Modal :mask-closable="false" width="500" v-model="showModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <el-row>
        <el-col class="monitoStationTipsStr">
          该功能是在断电后重启系统使用的，正常情况下使用将会造成未知异常！请确认是否重启广播任务？
        </el-col>
        <el-col align="right">
          <el-button @click="cancel('show')">取消</el-button>
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
      </el-row>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style lang="scss">
  .physicianExamineMonitor {
    height: 100%;
    overflow-x: auto;
    .control {
      .el-button {
        margin-top: 20px;
      }
    }
  }
  .monitoStationTipsStr {
    line-height: 24px;
    font-size: 14px;
    text-indent: 2em;
    margin-bottom: 20px;
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api'
  import abTableGk from '../components/ab_table_gk'
  import setWaitTime from './physicianExamineMonitor_setWaitTime'
  import { server2ShowData } from '../components/formatData'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianExamineMonitorList',
    data () {
      return {
        self: this,
        examStatus: '',
        tabHeader: '',
        tabList: [],
        tableData: [],
        examData: {},
        showDataInfo: {
          physicianexamSuspendStatus: false, // 3楼考核是否暂停
          physicianexamSuspendThirdStatus: false // 5楼考核是否暂停
        },
        tableHeight: 400,
        lastWaitTime: '',
        viewModal: false,
        contentHeader: {
          viewId: {id: 'viewId', title: '设置等待时间'},
          showId: {id: 'showId', title: '重启广播任务'}
        },
        loadBtn: {
          title: '确认',
          callParEvent: 'listenSubEvent',
          type: 'danger'
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.getMonitorList()
      },
      /*****************************状态控制**********************/
      reStartAudio () {
        this.openModel('show')
      },
      // 开始考试
      start () {
        this.modifyStatus('ONGOING')
      },
      // 结束考试
      finish () {
        this.modifyStatus('FINISH')
      },
      // 暂停某一阶段的状态
      modifySuspend (stageOrder, examStatus) {
        let opt = {
          ajaxSuccess: res => {
            this.examStatus = examStatus;
            this.getShowData()
          },
          ajaxParams: {
            url: api.suspend.path + this.tabHeader,
            method: api.suspend.method,
            data: {
              stageOrder,
              examStatus
            }
          }
        }
        this.ajax(opt)
      },
      // 修改考核状态
      modifyStatus (examStatus, successCall = () => {}) {
        let opt = {
          ajaxSuccess: res => {
            this.examStatus = examStatus
            this.getShowData()
            successCall(res)
          },
          ajaxParams: {
            url: api.modifyStatus.path + this.tabHeader,
            method: api.modifyStatus.method,
            data: {
              examStatus
            }
          }
        }
        this.ajax(opt)
      },
      // 打开换站时间设置
      openWaitTime () {
        this.openModel('view')
      },
      // 设置等待时间完成
      setWaitTimeDone () {
        this.getShowData()
        this.cancel('view')
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let opt = {
          ajaxSuccess: () => {
            this.successMess('重启广播任务成功！')
          },
          ajaxParams: {
            url: api.recoveryBroadcast.path + this.tabHeader,
            method: api.recoveryBroadcast.method,
            data: {}
          }
        }
        if (!isLoadingFun) isLoadingFun = function () {}
        isLoadingFun(true)
        this.cancel('show')
        this.ajax(opt, isLoadingFun)
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      },
      /*****************************基础逻辑**********************/
      // 选择考核场次
      selectExam () {
        this.examStatus = ''
        this.getShowData()
      },
      // 获取查看数据
      getShowData () {
        let opt = {
          ajaxSuccess: res => {
            let resData = server2ShowData(res.data.examArrangementList)
            let {physicianexamSuspendStatus, physicianexamSuspendThirdStatus, examStatus} = res.data
            this.showDataInfo = {physicianexamSuspendStatus, physicianexamSuspendThirdStatus}
            this.examStatus = examStatus
            this.tableData = resData.resArr
            this.lastWaitTime = resData.lastWaitTime
//            this.setExamStatus()
          },
          ajaxParams: {
            url: api.get.path + this.tabHeader,
            method: api.get.method
          }
        }
        this.ajax(opt)
      },
      // 获取监控考核场次列表
      getMonitorList () {
        this.ajax({
          ajaxSuccess: 'updateTabData',
          ajaxParams: {
            url: api.list.path,
            method: api.list.method
          }
        })
      },
      // 更新tab
      updateTabData (res) {
        let examData = {}
        if (res.data.length) {
          (res.data || []).map(item => examData[item.examId] = item)
          this.examData = examData
          this.tabList = res.data;
          this.tabHeader = (res.data[0].examId).toString();
          this.$nextTick(function () {
            this.setTableDynHeight()
          })
          this.getShowData()
        }
      },
      // 设置为默认
      setDefault () {
        this.ajax({
          ajaxSuccess: () => this.$message.success('设置成功'),
          ajaxError: () => this.$message.error('设置失败'),
          ajaxParams: {
            url: api.setDefault.path + this.tabHeader,
            method: api.setDefault.method
          }
        })
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        if (!this.tabHeader) {
          return
        }
        let content = this.$refs.content.parentNode;
        let table = this.$refs.table;
        let paginationHt = 200;
        let height = content.offsetHeight - table.offsetTop - paginationHt;
        this.tableHeight = height > 365 ? height : 365
      }
    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        this.getMonitorList()
        //初始表格高度及分页位置
//        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    components: {
      abTableGk,
      setWaitTime
    }
  }

</script>
