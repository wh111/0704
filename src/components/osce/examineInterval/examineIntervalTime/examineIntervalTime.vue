<template>
  <!-- 时间表 -->
  <div class="examineIntervalTime">
    <div class="exITHeader">
      <div class="showTime">
        <p>考核时间</p>
        <p>{{ startTime }}</p>
      </div>
      <div class="showTime" v-if="status !== 'NOARRANGED'">
        <p>生成时间</p>
        <p>{{ setupTime }}</p>
      </div>
      <div class="publishButton">
        <!-- 如果 未生成轮转表 则显示生成时间表按钮 -->
        <template v-if="status === 'NOARRANGED'">
          <el-button type="info" @click="createTime">生成时间表</el-button>
          <!--<el-button type="success">套用模版</el-button>-->
        </template>
        <!-- 如果 未发布 则显示发布按钮 -->
        <el-button type="success" v-if="status === 'UNPUBLISH'" @click="doPublish('PUBLISH','发布')">发布</el-button>
        <!-- 如果 已发布 则显示撤销发布按钮 -->
        <el-button type="danger" v-if="status === 'PUBLISH'" @click="doPublish('UNPUBLISH','撤销发布')">取消发布</el-button>
      </div>
    </div>
    <div class="exContent">
      <div class="exLeftMenu">
        <!-- 只有在 规范化考核 的时候才显示 考生时间表和SP时间表，自由考核时只显示 监考老师时间表 -->
        <!--<p :class="{'active':active === 'student'}" @click="show('student')" v-if="viewType === 'STANDARD'">考生时间表</p>-->
        <p :class="{'active':active === 'student'}" @click="show('student')">考生时间表</p>
        <p :class="{'active':active === 'teacher'}" @click="show('teacher')">监考老师时间表</p>
        <!--<p :class="{'active':active === 'sp'}" @click="show('sp')" v-if="viewType === 'STANDARD'">SP时间表</p>-->
        <p :class="{'active':active === 'sp'}" @click="show('sp')">SP时间表</p>
      </div>
      <div class="exRightBody">
        <!-- 如果 未生成轮转表 则提示生成考核安排，否则直接显示时间表 -->
        <p class="nodataTips" v-if="status === 'NOARRANGED'">没有考核安排，请先进行考核安排</p>
        <template v-else>
          <p align="right" style="margin:10px 0;">
            <el-button v-if="status !== 'NOARRANGED'" size="small" type="info" @click="viewTableTimeOpen">全屏预览</el-button>
            <el-button size="small" @click="getExcel(false)">导出Excel</el-button>
            <el-button size="small" @click="getExcel('wait')">导出学生候考Excel</el-button>
          </p>
          <div id="content" ref="content" style="position: absolute;left: 10px;right: 0;top: 45px;bottom: 10px;">
            <student-time v-if="headerList[0]" :height="dynamicHt" :sceneType="sceneType" v-show="active === 'student'" :headerList="headerList"
                          :tableList="tableList"></student-time>
            <teacher-time v-if="active === 'teacher'" :height="dynamicHt" :tableList="teacherTableList"></teacher-time>
            <student-time v-if="spHeaderList[0]" :height="dynamicHt" v-show="active === 'sp'" :headerList="spHeaderList"
                          :tableList="spTableList"></student-time>
            <p v-if="!spHeaderList[0] && active === 'sp'" style="text-align:center;position:absolute;top:50%;left:0%;width:100%;">暂无时间表</p>
          </div>
        </template>

      </div>
      <!--导出弹窗-->
      <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题" class-name="vertical-center-modal"
             :width="500">
        <modal-header slot="header" :content="button[exportType]"></modal-header>
        <derive v-if="deriveModal" :type="exportType" :url="deriveData.url" @cancel="deriveModal = false"></derive>
        <div slot="footer"></div>
      </Modal>
      <!--全屏弹窗-->
      <el-dialog :title="button.viewTableTime.title" size="full" :modal="false" :visible.sync="viewTableTimeModal" :before-close="closeViewTable">
        <template>
          <student-time v-if="active === 'student' && viewTableTimeModal" :height="dialogContHt" :sceneType="sceneType" :headerList="headerList"
                        :tableList="tableList"></student-time>
          <student-time v-if="active === 'sp' && viewTableTimeModal" :height="dialogContHt" :headerList="spHeaderList" :tableList="spTableList"></student-time>
          <teacher-time v-if="active === 'teacher' && viewTableTimeModal" :height="dialogContHt" :tableList="teacherTableList"></teacher-time>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  let Util = null;
  import api from './api';

  import studentTime from '../examineIntervalTimeTable/examineIntervalTimeTable_student'; // 学生时间表
  import teacherTime from '../examineIntervalTimeTable/examineIntervalTimeTable_teacher'; // 学生时间表

  export default {
    props: {
      // viewType: {
      //   type: String,
      //   required: true
      // },
      id: {
        type: Number,
        required: true
      },
      sceneType: { //考核类型
        type: String,
        default: ''
      }
    },
    data () {
      return {
        status: 'NOARRANGED', // this.$store.state.examineInterval.station.info.status,
        active: 'student',
        viewType: '', //当前考站类型
        startTime: '-',
        setupTime: '-',
        exportType: 'student',
        config: {},
        //时间表动态啊高度
        dynamicHt: 0,
        dialogContHt: 0,
        headerList: [],
        tableList: [],
        spHeaderList: [],
        spTableList: [],
        teacherTableList: {},
        deriveModal: false,
        viewTableTimeModal: false,

        //导出
        deriveData: {
          url: '',
          type: ''
        },
        button: {
          student: {
            id: 'studentId',
            title: '导出考生时间表'
          },
          teacher: {
            id: 'teacherId',
            title: '导出监考老师时间表'
          },
          sp: {
            id: 'spId',
            title: '导出sp时间表'
          },
          wait: {
            id: 'waitId',
            title: '导出学生候考时间表'
          },
          viewTableTime: {
            id: 'viewTableTimeId',
            title: '全屏查看时间表'
          }
        }
      }
    },
    methods: {
      // 视图切换
      show (view) {
        this.active = view;
        this.loadTimeData(view);
      },
      // 生成时间表
      createTime () {
        let opt = {
          successTitle: '生成成功',
          errorTitle: '生成失败',
          ajaxSuccess: res => {
            this.status = 'UNPUBLISH'; // 生成时间表之后为 未发布
            this.loadTimeData(this.active);
            this.updateStatus();
          },
          ajaxParams: {
            url: api.arrangementAdd.path,
            method: api.arrangementAdd.method,
            data: {
              id: this.id
            }
          }
        };
        this.ajax(opt);
      },
      // 发布操作
      // 1 PUBLISH 已发布
      // 2 UNPUBLISH 未发布
      // 3 ONGOING 考核中
      // 4 FINISH 已结束
      doPublish (status, str) {
        let opt = {
          successTitle: str + '成功',
          errorTitle: str + '失败',
          ajaxSuccess: status === 'PUBLISH' ? 'publishSuccess' : 'unPublishSuccess',
          ajaxParams: {
            url: api.modifyStatus.path + this.id,
            method: api.modifyStatus.method,
            data: {
              id: this.id,
              status: status
            }
          }
        };
        this.ajax(opt);
        // 对接后删除
        // if (status === 'PUBLISH') {
        //   this.publishSuccess()
        // } else {
        //   this.unPublishSuccess()
        // }
      },
      // 发布成功
      publishSuccess (res) {
        this.status = 'PUBLISH';
        this.updateStatus()
      },
      // 撤销发布
      unPublishSuccess (res) {
        this.status = 'UNPUBLISH';
        this.updateStatus()
      },
      // 查看对应角色的时间表
      loadTimeData (view) {
        if (this.status === 'NOARRANGED') {
          return;
        }
        let opt = {
          successTitle: '获取时间表成功',
          errorTitle: '获取时间表失败',
          ajaxSuccess: 'setTimeData',
          ajaxParams: {
            url: api[view + 'List'].path,
            method: api[view + 'List'].method,
            params: {
              id: this.id
            }
          }
        };
        this.ajax(opt);
      },
      // 设置时间表的数据
      setTimeData (res) {
        if (this.active === 'teacher') {
          this.setTeacherTimeData(res)
        } else if (this.active === 'student') {
          this.setStudentTimeData(res)
        } else {
          this.setSpTimeData(res)
        }
        this.setTableDynHeight(); // 首次生成时间表则计算时间表的高度
      },
      // 设置老师时间表数据
      setTeacherTimeData (res) {
        this.teacherTableList = res.data
      },
      // 设置学生时间表数据
      setStudentTimeData (res) {
        this.headerList = res.data.stationRoomList;
        this.tableList = res.data.timeList;
      },

      //设置sp时间表数据
      setSpTimeData (res) {
        this.spHeaderList = res.data.stationRoomList;
        this.spTableList = res.data.timeList;
      },
      // 导出Excel
      getExcel (type) {
        let viewApiKeys = {
          'student': 'examUserExcelExport',
          'teacher': 'teacherExcelExport',
          'wait': 'examWaitingExcelExport',
          'sp': 'spExcelExport'
        };
        if (type) {
          this.exportType = type
        } else {
          if (this.active == 'sp' && !(this.spHeaderList.length && this.spTableList.length)) {
            this.errorMess('该表没有数据可导出')
            return
          }
          this.exportType = this.active
        }
        this.deriveData = {
          url: '/api/' + api[viewApiKeys[this.exportType]].path + '?id=' + this.id,
          type: this.exportType
        };
        this.deriveModal = true;
        /*// 当前考站已经生成时间表
        if (this.status !== 'NOARRANGED') {
          let opt = {
            ajaxParams: {
              url: api[viewApiKeys[this.active]].path,
              method: api[viewApiKeys[this.active]].method,
              params: {
                id: this.id,
              }
            }
          };
          this.ajax(opt);
        }*/
      },
      // 更新本地状态
      updateStatus () {
        this.$store.commit('examineInterval/station/setInfo', {
          status: this.status
        })
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.offsetHeight;
        this.dynamicHt = parHt;
        let windowHeight = document.all ? document.getElementsByTagName('html')[0].offsetHeight : window.innerHeight;
        let bdHt = Math.max(windowHeight, document.getElementsByTagName('body')[0].scrollHeight);
        this.dialogContHt = bdHt - 100;
      },
      // 全屏查看时间表
      viewTableTimeOpen () {
        this.viewTableTimeModal = true
      },
      closeViewTable (done) {
        this.viewTableTimeModal = false
      }
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        if (this.status != 'NOARRANGED') {
          //初始表格高度及分页位置
          this.setTableDynHeight();
          //为窗体绑定改变大小事件
          let Event = Util.events;
          Event.addHandler(window, 'resize', this.setTableDynHeight);
        }
      })
    },
    created () {
      Util = this.$util;
      let info = this.$store.state.examineInterval.station.info;
      // this.active = (info.sceneType === 'STANDARD') ? 'student' : 'teacher';
      this.viewType = info.sceneType;
      this.status = info.status;
      this.startTime = info.startTime;
      this.setupTime = info.setupTime;
      if (this.status != 'NOARRANGED') {
        this.loadTimeData(this.active);
      }
    },
    components: {
      studentTime,
      teacherTime
    }
  }

</script>

<style lang="scss">
  @import '~@/assets/ambuf/css/examineInterval_v1.0/timeTable';

</style>
