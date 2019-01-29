<template>
  <!-- 时间表 - 监考老师安排 -->
  <teacher-time-table :tableList="timeData"></teacher-time-table>
</template>

<script>
  import teacherTimeTable from '../../examineInterval/examineIntervalTimeTable/examineIntervalTimeTable_teacher';
  export default {
    props: ['id', 'api'],
    data() {
      return {
        timeData: {
          statrTime: "",
          endTime: "",
          stationRoomList: [ //
            // {
            //   "stationName": "考站名称",
            //   "roomNum": "101",
            //   "teacherNames": "张三"
            // }
          ]
        }
      }
    },
    methods: {
      // 获取时间表数据
      getTimeData() {
        this.ajax({
          ajaxSuccess: 'updateTimeData',
          ajaxParams: {
            url: this.api.path,
            method: this.api.method,
            params: {
              id: this.id
            }
          }
        })
      },
      // 更新时间表数据
      updateTimeData(res) {
        this.timeData = res.data
      }
    },
    created() {
      this.getTimeData()
    },
    watch: {
      id(val) {
        this.getTimeData();
      }
    },
    components: {
      teacherTimeTable
    }
  }

</script>

<style>


</style>
