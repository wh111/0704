<template>
  <!-- 查看时间表 -->
  <div>
    <el-row style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #dfe6ec;">
      <el-col :span="22" align="center">
        <h2 style="line-height:30px;">{{ stitle }}</h2>
      </el-col>
      <el-col :span="2" align="right">
        <el-button type="info" size="small" @click="backList">返回列表</el-button>
      </el-col>
    </el-row>
    <div style="overflow:hidden;margin-bottom:10px;">
      <div style="float:left;">
        <el-button type="success" size="small" @click="show('student')">整体安排</el-button>
        <el-button type="info" size="small" @click="show('sp')">SP安排</el-button>
        <el-button type="warning" size="small" @click="show('teacher')">监考老师安排</el-button>
      </div>
      <div style="float:right;">
        <el-button type="info" size="small" @click="viewTableTimeOpen">全屏预览</el-button>
        <el-button type="success" size="small" @click="excelExport">导出Excel</el-button>
      </div>
    </div>
    <!-- 时间表 -->
    <div id="content" ref="content" style="position:absolute;top:100px;buttom:0;left:12px;right:12px;bottom:12px;">
      <!--<keep-alive>-->
      <student-time v-if="headerList[0]" :height="dynamicHt" :sceneType="sceneType" v-show="timeActive === 'student'" :headerList="headerList"
        :tableList="tableList"></student-time>
      <sp-time v-if="timeActive === 'sp'" :height="dynamicHt" :headerList="spHeaderList" :tableList="spTableList"></sp-time>
      <teacher-time v-if="timeActive === 'teacher'" :height="dynamicHt" :tableList="teacherTableList"></teacher-time>
      <!--</keep-alive>-->
    </div>
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题" class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="button[timeActive]"></modal-header>
      <derive v-if="deriveModal" :type="timeActive" :url="deriveData.url" @cancel="deriveModal = false"></derive>
      <div slot="footer"></div>
    </Modal>

    <!--全屏弹窗-->
    <el-dialog :title="button.viewTableTime.title" size="full" :modal="false" :visible.sync="viewTableTimeModal" :before-close="closeViewTable">
      <template>
        <student-time v-if="timeActive === 'student' && viewTableTimeModal" :height="dialogContHt" :sceneType="sceneType" :headerList="headerList"
          :tableList="tableList"></student-time>
        <student-time v-if="timeActive === 'sp' && viewTableTimeModal" :height="dialogContHt" :headerList="spHeaderList" :tableList="spTableList"></student-time>
        <teacher-time v-if="timeActive === 'teacher' && viewTableTimeModal" :height="dialogContHt" :tableList="teacherTableList"></teacher-time>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  let Util = null;
  import timeApi from '../api'; // 时间表api
  import studentTime from '../../examineInterval/examineIntervalTimeTable/examineIntervalTimeTable_student';
  import spTime from '../../examineInterval/examineIntervalTimeTable/examineIntervalTimeTable_student';
  import teacherTime from '../../examineInterval/examineIntervalTimeTable/examineIntervalTimeTable_teacher';
  export default {
    props: ['id', 'stitle', 'sceneType'],
    data() {
      return {
        timeActive: 'student',
        headerList: [],
        tableList: [],
        spHeaderList: [],
        spTableList: [],
        teacherTableList: {},
        dynamicHt: 0,
        //导出
        deriveData: {
          url: '',
          type: ''
        },
        dialogContHt: 0,
        deriveModal: false,
        viewTableTimeModal: false,
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
          viewTableTime: {
            id: 'viewTableTimeId',
            title: '全屏查看时间表'
          }
        }
      }
    },
    methods: {
      show(view) {
        this.timeActive = view;
        this.loadTimeData();
      },
      backList() {
        this.$emit('show', {
          view: 'index'
        })
      },
      excelExport() {
        let viewApiKeys = {
          'student': 'examUserExcelExport',
          'teacher': 'teacherExcelExport',
          'sp': 'spExcelExport',
        };
        if (this.timeActive == 'sp' && !(this.spHeaderList.length && this.spTableList.length)) {
          this.errorMess('该表没有数据可导出')
          return
        }
        this.deriveData = {
          url: '/api/' + timeApi[viewApiKeys[this.timeActive]].path + '?id=' + this.id,
          type: this.timeActive
        };
        this.deriveModal = true;
        //        let viewApiKeys = {
        //          'student': 'examUserExcelExport',
        //          'teacher': 'teacherExcelExport',
        //          'sp': 'spExcelExport',
        //        };
        //        this.ajax({
        //          successTitle: '导出成功!',
        //          errorTitle: '导出失败!',
        //          ajaxError: 'ajaxError',
        //          ajaxSuccess: 'ajaxError',
        //          ajaxParams: {
        //            url: timeApi[viewApiKeys[this.timeActive]].path,
        //            method: timeApi[viewApiKeys[this.timeActive]].method,
        //            params: {
        //              id: this.id
        //            }
        //          }
        //        })
      },
      // 查看对应角色的时间表
      loadTimeData(view) {
        let viewApiKeys = {
          'student': 'userList',
          'teacher': 'teacherList',
          'sp': 'spList',
        };
        let opt = {
          successTitle: '获取时间表成功',
          errorTitle: '获取时间表失败',
          ajaxSuccess: 'setTimeData',
          ajaxParams: {
            url: timeApi[viewApiKeys[this.timeActive]].path,
            method: timeApi[viewApiKeys[this.timeActive]].method,
            params: {
              id: this.id
            }
          }
        };
        this.ajax(opt);
      },
      // 设置时间表的数据
      setTimeData(res) {
        if (this.timeActive === 'teacher') {
          this.setTeacherTimeData(res)
        } else if (this.timeActive === 'student') {
          this.setStudentTimeData(res)
        } else {
          this.setSpTimeData(res)
        }
      },
      // 设置老师时间表数据
      setTeacherTimeData(res) {
        this.teacherTableList = res.data
      },
      // 设置学生时间表数据
      setStudentTimeData(res) {
        this.headerList = res.data.stationRoomList;
        this.tableList = res.data.timeList;
      },
      // 设置学生时间表数据
      setSpTimeData(res) {
        this.spHeaderList = res.data.stationRoomList;
        this.spTableList = res.data.timeList;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.offsetHeight;
        this.dynamicHt = parHt;
        let windowHeight = document.all ? document.getElementsByTagName("html")[0].offsetHeight : window.innerHeight;
        let bdHt = Math.max(windowHeight, document.getElementsByTagName("body")[0].scrollHeight);
        this.dialogContHt = bdHt - 100;
      },
      // 全屏查看时间表
      viewTableTimeOpen() {
        this.viewTableTimeModal = true
      },
      closeViewTable(done) {
        this.viewTableTimeModal = false
      }
    },
    components: {
      studentTime,
      teacherTime,
      spTime
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    created() {
      Util = this.$util;
      this.sceneName = this.stitle;
      this.loadTimeData();
    },
  }

</script>

<style>


</style>
