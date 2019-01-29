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
        <el-button type="success" size="small" @click="show('me')">我的考核安排</el-button>
        <el-button type="info" size="small" @click="show('sp')">SP安排</el-button>
        <el-button type="warning" size="small" @click="show('teacher')">监考老师安排</el-button>
      </div>
      <div style="float:right;">
        <el-button type="success" size="small" @click="excelExport" v-if="timeActive!=='me'">导出Excel</el-button>
      </div>
    </div>
    <!-- 时间表 -->
    <div style="position:absolute;top:100px;buttom:0;left:12px;right:12px;bottom:12px;">
      <!--<keep-alive>-->
      <student-time v-if="headerList[0]" v-show="timeActive === 'me'" :headerList="headerList" :tableList="tableList"></student-time>
      <sp-time v-if="timeActive === 'sp'" :headerList="spHeaderList" :tableList="spTableList"></sp-time>
      <teacher-time v-if="timeActive === 'teacher'" :tableList="teacherTableList"></teacher-time>
      <!--</keep-alive>-->
    </div>
  </div>
</template>

<script>
  import timeApi from '../api'; // 时间表api
  import studentTime from '../../examineInterval/examineIntervalTimeTable/examineIntervalTimeTable_student';
  import spTime from '../../examineInterval/examineIntervalTimeTable/examineIntervalTimeTable_student';
  import teacherTime from '../../examineInterval/examineIntervalTimeTable/examineIntervalTimeTable_teacher';
  export default {
    props: ['id', 'stitle'],
    data() {
      return {
        timeActive: 'me',
        headerList: [],
        tableList: [],
        spHeaderList: [],
        spTableList: [],
        teacherTableList: {},
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
          'teacher': 'teacherExcelExport',
          'sp': 'spExcelExport',
        };
        this.ajax({
          successTitle: '导出成功!',
          errorTitle: '导出失败!',
          ajaxError: 'ajaxError',
          ajaxSuccess: 'ajaxError',
          ajaxParams: {
            url: timeApi[viewApiKeys[this.timeActive]].path,
            method: timeApi[viewApiKeys[this.timeActive]].method,
            params: {
              id: this.id
            }
          }
        })
      },
      // 查看对应角色的时间表
      loadTimeData(view) {
        let viewApiKeys = {
          'me': 'teacherGet',
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
        if (this.timeActive === 'me') {
          opt.ajaxParams.url = opt.ajaxParams.url + this.id;
          opt.ajaxParams.data = opt.ajaxParams.params;
        }
        this.ajax(opt);
      },
      // 设置时间表的数据
      setTimeData(res) {
        if (this.timeActive === 'me') {
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
    },
    components: {
      studentTime,
      teacherTime,
      spTime
    },
    created() {
      this.sceneName = this.stitle;
      this.loadTimeData();
    },
  }

</script>

<style>


</style>
