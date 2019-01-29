<template>
  <!-- 考生状态 -->
  <div>
    <el-table align="center" :height="400" :context="self" :data="viewData.arrangementList" tooltip-effect="dark" class="tableShowMoreInfo"
      style="width: 100%;">
      <el-table-column label="时间" prop="startTime" show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.startTime.substring(11,16) + ' - ' + scope.row.endTime.substring(11,16) }}
        </template>
      </el-table-column>
      <el-table-column label="考生" prop="userName" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="examStatus" show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.examStatus | typeText }}
        </template>
      </el-table-column>
    </el-table>
    <p style="margin-top:20px;text-align:center;">
      <el-button type="success" @click="fix">安排到该考站</el-button>
    </p>
  </div>
</template>

<script>
  // api http://218.241.184.2:9014/#!/project/api/detail?projectID=15&apiID=540
  import api from './api';
  export default {
    props: ['userId', 'roomId', 'sceneId', 'stationId'],
    data() {
      return {
        self: this,
        viewData: {},
      }
    },
    methods: {
      // 安排
      fix() {
        let opt = {
          successTitle: '安排成功!',
          errorTitle: '安排失败!',
          ajaxError: 'ajaxError',
          ajaxSuccess: res => this.$emit('fix'),
          ajaxParams: {
            url: api.manual.path + '/' + this.roomId,
            method: api.manual.method,
            data: {
              userId: this.userId,
              roomId: this.roomId,
              sceneId: this.sceneId,
              stationId: this.stationId
            }
          }
        };
        this.ajax(opt)
      },
      // 获取该房间的考生信息
      getStudentDataByRoom() {
        let opt = {
          successTitle: '查询成功!',
          errorTitle: '查询失败!',
          ajaxError: 'ajaxError',
          ajaxSuccess: res => this.viewData = res.data,
          ajaxParams: {
            url: api.manualGet.path + '/' + this.roomId,
            method: api.manualGet.method,
            params: {
              id: this.roomId,
              sceneId: this.sceneId,
              stationId: this.stationId
            }
          }
        };
        this.ajax(opt)
      },
    },
    created() {
      this.getStudentDataByRoom();
    }
  }

</script>

<style>


</style>
