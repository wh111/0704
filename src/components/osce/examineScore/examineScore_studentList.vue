<template>
  <!-- 考站详情 -->
  <div style="height:100%;">
    <!-- 操作按钮 -->
    <p>
      <el-button size="small" type="success" @click="changeInfoView" style="float:right;">切换视图</el-button>
      <el-button size="small" v-if="stationTeacher.isSign === 'YES'" type="info" @click="openInfo" style="float:right;margin-right:20px;">进入考核现场</el-button>
    </p>
    <!-- 视频及数据列表 -->
    <div class="examineScoreInfoMain">
      <div class="examineScoreInfoVideo">
        <div class="teacherInfo">
          <p class="title">老师信息</p>
          <div class="teacherInfoBox">
            <p class="teacherInfoText">考站名称：{{ stationTeacher.stationName || '-' }}</p>
            <p class="teacherInfoText">分站时间：{{ stationTeacher.timeLength || '0'}}分钟</p>
            <p class="teacherInfoText">房间号：{{ stationTeacher.roomNum || '-'}}</p>
            <p class="teacherInfoText">教官：{{ stationTeacher.userName || '-'}}</p>
          </div>
          <div class="teacherInfoPic">
            <img :src="getPhotoPath(stationTeacher.userPhotoPath)" @error="'/static/image/defAvatar.png'">
          </div>
        </div>
        <div class="videBox" id="videoBox">
          <!-- 视频区域 -->
          <exa-video :roomId="roomId"></exa-video>
        </div>
        <div class="loginBtn">
          <el-button type="success" v-if="stationTeacher.isSign === 'NO'" @click="loginStation">签到</el-button>
        </div>
        <div class="nowTime">
          <p>当前时间</p>
          <p>{{ nowTime }}</p>
        </div>
      </div>
      <div class="examineScoreInfoList">
        <keep-alive>
          <room-tab v-if="EMR_tab" :list="stationStudentList"></room-tab>
          <room-list v-if="!EMR_tab" :list="stationStudentList"></room-list>
        </keep-alive>
      </div>
    </div>
    <!-- 考生信息 -->
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="studentInfoModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true"
      :width="1200" @on-cancel="cancel">
      <modal-header slot="header" :parent="self" :content="contentHeader.studentInfoId"></modal-header>
      <!--<student-info v-if="studentInfoModal" @cancel="cancel" :nowIndex="nowIndex" :stationId="stationId" :roomId="roomId" :sceneId="sceneId"
        :index="index" :userSum="userSum"></student-info>-->
      <student-info v-if="studentInfoModal" @cancel="cancel" :stationId="stationId" :roomId="roomId" :sceneId="sceneId" :userSum="userSum"
        :teacherId="teacherId"></student-info>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api'; // api
  import roomList from './room/room_list'; // 列表
  import roomTab from './room/room_tab'; // 表格
  import studentInfo from './examineScore_studentInfo'; // 考生信息
  import exaVideo from '../examineMonitor/examineMonitorRoom/examineMonitorRoom_video'; // 监控摄像头

  export default {
    // props: ['sceneId', 'stationId', 'roomId', 'index'],
    props: ['sceneId'],
    data() {
      return {
        teacherId: 0, // 老师主键id
        teacherUserId: 0, // 老师人员id
        EMR_tab: true,
        nowTime: '-', // 当前时间
        userSum: 0, // 考生总人数
        stationId: 0,
        roomId: 0,
        stationTeacher: {
          // "sceneId": "1",
          // "stationId": "1",
          // "stationName": "儿科考站",
          // "roomId": "1",
          // "roomNum": "101",
          // "timeLength": "15",
          // "teacherId": "1",
          // "userId": "1",
          // "userName": "张三",
          // "userPhotoPath": "/*.png",
          // "isSign": "NO"
        }, // 监考老师信息
        stationStudentList: [ //
          // {
          //   "arrangementId": "1",
          //   "userId": "1",
          //   "userName": "李四",
          //   "userNum": "2017012012",
          //   "userPhotoPath": "/.png",
          //   "examStatus": "NOTEXAM",
          //   "scheduleId": "1",
          //   "mark": "80"
          // }
        ], // 考生
        self: this,
        studentInfoModal: false,
        contentHeader: {
          studentInfoId: {
            id: 'studentInfoId',
            title: '查看考生信息'
          }
        }
      }
    },
    methods: {
      // 切换视图
      changeInfoView() {
        this.EMR_tab = !this.EMR_tab
      },
      // 返回列表
      show() {
        this.$emit('show', {
          view: 'list'
        })
      },
      // 监考老师签到
      loginStation() {
        this.ajax({
          errorTitle: '签到失败',
          ajaxError: 'ajaxError',
          ajaxSuccess: () => {
            this.stationTeacher.isSign = 'YES';
            this.successMess('签到成功，可以进入考核现场')
          },
          ajaxParams: {
            url: api.sign.path + this.teacherId,
            method: api.sign.method,
            params: {
              id: this.teacherId
            }
          }
        });
      },
      // 获取考生列表
      getStudentList() {
        let {
          roomId,
          sceneId,
          stationId,
          id
        } = this.stationTeacher;
        this.ajax({
          ajaxSuccess: 'updateStudentListData',
          ajaxParams: {
            url: api.examUserList.path,
            method: api.examUserList.method,
            params: {
              roomId,
              sceneId,
              stationId,
              teacherId: id
            }
          }
        });
      },
      // 获取监考老师信息
      getTeacherInfo() {
        this.ajax({
          ajaxSuccess: 'updateTeacherData',
          ajaxParams: {
            url: api.station.path,
            method: api.station.method,
            params: {
              sceneId: this.sceneId,
              teacherId: this.teacherUserId
            }
          }
        });
      },
      // 获取当前时间
      getNowTime() {
        let _this = this;
        setInterval(() => {
          _this.nowTime = ((new Date().toLocaleString()).split(' '))[1];
        }, 1000);
      },
      // 更新教师信息
      updateTeacherData(res) {
        if (!res.data) return;
        this.teacherId = res.data.id;
        this.stationTeacher = res.data;
        this.stationId = res.data.stationId;
        this.roomId = res.data.roomId;
        this.getStudentList();
      },
      // 更新考生列表
      updateStudentListData(res) {
        if (!res.data) return;
        this.stationStudentList = res.data;
        this.userSum = res.data.length;
      },
      /******************** 模态框 *******************/
      openInfo() {
        this.openModel('studentInfo')
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
        this.getStudentList();
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      // 获取头像地址
      getPhotoPath(path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png'
      },
    },
    created() {
      this.teacherUserId = this.$store.getters.getUserInfo.id;
      this.getTeacherInfo();
      this.getNowTime();
    },
    components: {
      roomList,
      roomTab,
      studentInfo,
      exaVideo
    },
    watch: {
      sceneId(val) {
        this.getTeacherInfo()
      }
    }
  }

</script>

<style lang="scss">
  $boderColor:#dfe6ec; // 边框颜色
  .examineScoreInfoMain {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;
    .debugVideoBox-right .el-col-10 {
      width: 94%;
      margin-left: 6%;
    }
  }

  .examineScoreInfoVideo {
    width: 320px; // padding: 10px;
    height: 100%;
    overflow: auto;
    position: relative;
    border: 1px solid $boderColor;
    .title {
      // margin: -10px;
      line-height: 32px;
      padding-left: 10px;
      color: #333;
      background-color: #eaedf1;
    }
    .teacherInfoBox {
      // width: 178px;
    }
    /*.videBox {*/
    /*margin: 10px;*/
    /*}*/
    .teacherInfoText {
      line-height: 46px;
      padding-left: 10px;
      border-bottom: 1px solid $boderColor;
    }
    .teacherInfoPic {
      position: absolute;
      top: 30px;
      right: 0;
      width: 120px;
      height: 120px;
      img {
        width: 100%;
        height: 100%;
        padding: 10px;
        background-color: #fff;
      }
    }
    .loginBtn {
      text-align: center;
      padding-top: 20px;
    }
    .nowTime {
      text-align: center;
      padding: 20px;
    }
  }

  .examineScoreInfoList {
    position: absolute;
    left: 330px;
    top: 0;
    right: 0;
    bottom: 0;
  }

</style>
