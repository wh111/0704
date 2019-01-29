<template>
  <!-- 考站详情 -->
  <div>
    <!-- 操作按钮 -->
    <el-row>
      <el-col :span="8">
        <el-button size="small" type="info" @click="show">返回列表</el-button>
      </el-col>
      <el-col :span="16" align="right">
        <el-form :inline="true">
          <el-form-item>
            <el-input size="small" v-model="userName" placeholder="输入学生姓名进行筛选"></el-input>
          </el-form-item>
          <el-form-item style="margin-right: 0;">
            <el-button size="small" type="info" @click="getStudentListByUserName">筛选</el-button>
            <el-button size="small" type="success" @click="changeInfoView">切换视图</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 视频及数据列表 -->
    <div class="monitoStationInfoMain">
      <div class="monitoStationInfoVideo">
        <div class="videBox" id="videoBox">
          <!-- 视频区域 -->
          <exa-video :roomId="roomId"></exa-video>
        </div>
        <p class="videoBtn">
          <el-button>语言广播</el-button>
        </p>
      </div>
      <div class="monitoStationInfoList">
        <keep-alive>
          <room-tab v-if="EMR_tab" :list="stationStudentList" @lookStudent="lookStudent"></room-tab>
          <room-list v-if="!EMR_tab" :list="stationStudentList" @lookStudent="lookStudent"></room-list>
        </keep-alive>
      </div>
    </div>
    <!-- 考生信息 -->
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="studentInfoModal" height="200" title="对话框标题"
           class-name="vertical-center-modal" :loading="true"
           :width="1200" @on-cancel="cancel">
      <modal-header slot="header" :parent="self" :content="contentHeader.studentInfoId"></modal-header>
      <student-info v-if="studentInfoModal" @cancel="cancel" :nowIndex="nowIndex" :stationId="stationId"
                    :roomId="roomId" :sceneId="sceneId"
                    :index="index" :userSum="userSum"></student-info>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style lang="scss">
  .monitoStationInfoList {
    .error {
      color: red;
    }
    .notexamError {
      border-color: red;
    }
  }
</style>
<script>
  import api from '../api'; // api
  import roomList from './examineMonitorRoom_list'; // 列表
  import roomTab from './examineMonitorRoom_tab'; // 表格
  import studentInfo from '../examineMonitorStudent/examineMonitorStudent'; // 考生信息
  import exaVideo from './examineMonitorRoom_video'; // 监控摄像头
  export default {
    props: ['sceneId', 'stationId', 'roomId', 'index'],
    data () {
      return {
        EMR_tab: true,
        userSum: 0, // 考生总人数
        nowIndex: 0, // 考生当前索引
        userName: '', // 学生姓名
        allStationStudentList: [], // 考生
        stationStudentList: [], // 考生
        self: this,
        studentInfoModal: false,
        contentHeader: {
          studentInfoId: {
            id: 'studentInfoId',
            title: '查看考生信息'
          }
        },
        infoTime: null
      };
    },
    methods: {
      // 切换视图
      changeInfoView () {
        this.EMR_tab = !this.EMR_tab;
      },
      // 返回列表
      show () {
        this.$emit('show', {
          view: 'list'
        });
      },
      // 查看考生的考试详情
      lookStudent (index) {
        this.nowIndex = index;
        // console.log(index);
        this.openModel('studentInfo');
      },
      // 获取考生列表
      getStudentList () {
        let {
          roomId,
          sceneId,
          stationId
        } = this;
        clearTimeout(this.infoTime);
        this.ajax({
          ajaxLoading: false,
          ajaxSuccess: 'updateStudentListData',
          ajaxParams: {
            url: api.examUserList.path,
            method: api.examUserList.method,
            params: {
              roomId,
              sceneId,
              stationId
            }
          }
        });
      },
      // 更新考生列表
      updateStudentListData (res) {
        if (!res.data) return;
        this.allStationStudentList = res.data;
        this.userSum = res.data.length;
        this.getStudentListByUserName();
        // 间隔连接 30s
        this.infoTime = setTimeout(() => this.getStudentList(), 1000 * 2);
      },
      // 通过学生姓名过滤学生
      getStudentListByUserName () {
        let res = this.$util._.defaultsDeep([], this.allStationStudentList);
        let temp = null;
        if (this.userName !== '') {
          temp = [];
          res.map(item => !!~item.userName.indexOf(this.userName) && temp.push(item));
        }
        this.stationStudentList = temp || res;
      },
      /******************** 模态框 *******************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
        this.getStudentList();
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        clearTimeout(this.infoTime);
        this[options + 'Modal'] = true;
      }
    },
    created () {
      this.getStudentList();
      // 场次id，考站id，房间id，监控数据中的考站列表索引
      // console.log(this.sceneId, this.stationId, this.roomId, this.index);
    },
    beforeDestroy () {
      clearTimeout(this.infoTime);
    },
    components: {
      roomList,
      roomTab,
      studentInfo,
      exaVideo
    }
  };

</script>

<style>


</style>
