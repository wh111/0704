<template>
  <!-- 考核场次对应的考站列表 -->
  <div id="monitoStation" ref="monitoStation" class="monitoStation">
    <div class="monitoStationList">
      <template v-for="(stationItem,index) in monitorData.stationRoomList">
        <station-room :option="{hasAdd:false,hasRemove:false,type:'monitor',icon:monitorData.status}"
                      :initData="{index:stationItem.stationId,cIndex:index,name:stationItem.stationName,percentage:stationItem.nowExamUser.percentage,roomNum:stationItem.roomNum,roomType:stationItem.stationType !== 'SP'? '' : stationItem.stationType,carousel:stationItem.teacherList,carouselKey:'teacherName'}"
                      :key="stationItem.stationId" @click.native="showStationInfo(stationItem,index)"
                      style="width:80px;margin-right:30px;"></station-room>
        <!--<station-room :option="{hasAdd:false,hasRemove:false,type:'monitor'}" :initData="{index:stationItem.stationId,cIndex:index,name:stationItem.stationName,percentage:Math.round(Math.random()*100+1),roomNum:stationItem.roomNum,roomType:stationItem.stationType !== 'SP'? '' : stationItem.stationType,carousel:stationItem.teacherList,carouselKey:'teacherName'}"
          :key="stationItem.stationId" @roomClick="showStationInfo" style="width:80px;margin-right:30px;"></station-room>-->
      </template>
    </div>
    <div class="monitoStationInfo">
      <h4>开始时间：<br/>{{ monitorData.startTime | formatDate('yyyy-MM-dd HH:mm') || '-' }}</h4>
      <h4>结束时间：<br/>{{ monitorData.endTime | formatDate('yyyy-MM-dd HH:mm') || '-' }}</h4>
      <h4>当前时间：{{ nowTime }}</h4>
      <el-collapse-transition>
        <p class="noMarginBottom">
          <el-button v-show="monitorData.status === 'PUBLISH'" type="success" @click="modifyStatus('ONGOING')">开始考核</el-button>
        </p>
      </el-collapse-transition>
      <el-collapse-transition>
        <div v-show="monitorData.status === 'ONGOING' || monitorData.status === 'SUSPEND'">
          <p v-if="monitorData.status === 'ONGOING'">
            <el-button type="warning" @click="modifyStatusSS('SUSPEND')">暂停考核</el-button>
          </p>
          <p v-else>
            <el-button type="info" @click="modifyStatusSS('ONGOING')">恢复考核</el-button>
          </p>
          <p :class="{'noMarginBottom':monitorData.voiceStatus!=='FAIL'}">
            <el-button type="danger" @click="modifyStatus('FINISH')">结束考核</el-button>
          </p>
          <p class="noMarginBottom" v-if="monitorData.voiceStatus==='FAIL'">
            <el-button @click="reStartAudio">重启广播</el-button>
          </p>
        </div>
      </el-collapse-transition>
      <br>
      <hr>
      <br>
      <p class="noMarginBottom">
        <el-button type="success" @click="exportTime">导出时间表</el-button>
      </p>
      <br>
      <hr>
      <br>
      <!--<el-collapse-transition>-->
      <!--<p>-->
      <!--<el-button>语音广播</el-button>-->
      <!--</p>-->
      <!--</el-collapse-transition>-->
      <p class="serverStatus" v-if="serverStatus">服务器正常</p>
      <p class="serverStatus error" v-else>服务器异常</p>
    </div>
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

    <!--导出弹窗-->
    <Modal :mask-closable="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="contentHeader.deriveId"></modal-header>
      <div>
        <div class="remove">确定导出当前考核场次的时间表吗？</div>
        <el-row>
          <el-col align="right">
            <a :href="exportUrl">
              <el-button @click="cancel('derive')" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="cancel('derive')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style lang="scss">
  .monitoStationTipsStr {
    line-height: 24px;
    font-size: 14px;
    text-indent: 2em;
    margin-bottom: 20px;
  }
</style>
<script>
  let listTime = null;
  import api from '../api'; // api
  import stationRoom from '../../examineInterval/examineInterval_room'; // 考站
  export default {
    props: ['sceneId'],
    data () {
      return {
        nowTime: '-', // 当前时间
        examStatus: '', // 修改的考核状态
        deriveModal: false,
        serverStatus: true, // 服务器是否正常
        // 考核场次监控数据
        monitorData: {},
        contentHeader: {
          showId: {id: 'showId', title: '重启广播任务'},
          deriveId: {id: 'deriveId', title: '导出时间表'}
        },
        loadBtn: {
          title: '确认',
          callParEvent: 'listenSubEvent',
          type: 'danger'
        },
        exportUrl: ''
      };
    },
    methods: {
      reStartAudio () {
        this.openModel('show');
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let opt = {
          ajaxSuccess: res => {
            if (res.data == 'JOB_ERROR') {
              this.errorMess('JOB服务宕机，请重启JOB服务！');
            } else {
              this.successMess('重启广播任务成功！');
            }
            this.getStationData();
          },
          ajaxParams: {
            url: api.recoveryBroadcast.path + this.sceneId,
            method: api.recoveryBroadcast.method,
            data: {}
          }
        };
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        this.cancel('show');
        this.ajax(opt, isLoadingFun);
      },
      // 查看详细信息页面
      showStationInfo (res, index) {
        if (res.stationType === 'REST') {
          this.errorMess('空站不能查看详情！');
          return;
        }
        this.$store.commit('examineMonitor/index/intStationRoom', res);
        this.$emit('show', {
          view: 'info',
          room: {
            index: res.stationId,
            cIndex: index
          },
          listReq: false
        });
      },
      // 获取当前场地对应的数据
      getStationData () {
        clearTimeout(listTime);
        if (this.sceneId != 0) {
          this.ajax({
            allowError: false,
            ajaxLoading: false,
            error: 'updateStationDataError',
            ajaxSuccess: 'updateStationData',
            ajaxParams: {
              url: api.monitorGet.path + this.sceneId,
              method: api.monitorGet.method,
              params: {
                id: this.sceneId
              }
            }
          });
        }
      },
      // 更新考站的数据
      updateStationData (res) {
        this.$store.commit('examineMonitor/index/intData', res.data);
        this.monitorData = this.$store.state.examineMonitor.index.data;
        this.serverStatus = true;
        this.loadStationData();
      },
      /**
       * 更新考站数据异常
       * @param res
       */
      updateStationDataError (res) {
        this.loadStationData();
        if (this.serverStatus) {
          this.errorMess(res.status.msg);
        }
        this.serverStatus = false;
      },
      loadStationData () {
        clearTimeout(listTime);
        // 间隔连接 30s
        listTime = setTimeout(() => this.getStationData(), 1000 * 10);
      },
      // 修改此场次考核状态（暂停及恢复）
      modifyStatusSS (status) {
        let now = this.conductDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
        this.examStatus = status;
        this.ajax({
          ajaxSuccess: 'updateStatus',
          ajaxParams: {
            url: api.control.path + this.sceneId,
            method: api.control.method,
            data: {
              id: this.sceneId,
              status: status,
              time: now
            }
          }
        });
        // this.updateStatus(); // 联调后删除
      },
      // 修改此场次考核为结束状态
      modifyStatus (status) {
        this.examStatus = status;
        this.ajax({
          ajaxSuccess: 'updateStatus',
          ajaxParams: {
            url: api.modifyStatus.path + this.sceneId,
            method: api.modifyStatus.method,
            data: {
              id: this.sceneId,
              status: status
            }
          }
        });
      },
      // 更新状态
      updateStatus (res) {
//        this.getStationData()
        this.$store.commit('examineMonitor/index/updateData', {
          status: this.examStatus
        });
      },
      //小于10前面补0
      two_char (n) {
        return n >= 10 ? n : '0' + n;
      },
      // 当前时间
      getNowTime () {
        let _this = this;

        this.ajax({
          ajaxSuccess: res => {
            let date = res.data;
            if (!isNaN(date)) {
              let serverTime = new Date(date);
              let nowStamp = this.parseTimestamp(new Date());
              let dStamp = serverTime - nowStamp;
              setInterval(() => {
                let newNowStamp = this.parseTimestamp(new Date()) + dStamp;
                _this.nowTime = ((new Date(newNowStamp).toLocaleString()).split(' '))[1];
              }, 1000);
            }
          },
          ajaxParams: {
            url: api.getServerTime.path,
            method: api.getServerTime.method,
            data: {
              id: this.sceneId,
              status: status
            }
          }
        });
      },
      // 导出时间表
      exportTime () {
        this.exportUrl = '/api/scene/arrangement/examTime/excelExport?id=' + this.sceneId;
        this.openModel('derive');
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      }
    },
    components: {
      stationRoom
    },
    created () {
      this.getStationData();
      this.getNowTime();

    },
    watch: {
      sceneId (val) {
        clearTimeout(listTime);
        this.getStationData();
      }
    },
    destroyed () {
      clearTimeout(listTime);
    }
  };

</script>
