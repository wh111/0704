<template>
  <!-- 时间表 - sp安排 -->
  <sp-time-table :headerList="headerList" :tableList="tableList"></sp-time-table>
</template>

<script>
  import spTimeTable from '../../examineInterval/examineIntervalTimeTable/examineIntervalTimeTable_student';
  export default {
    props: ['id', 'api'],
    data() {
      return {
        headerList: [ //
          {
            "stationName": "考站名称1",
            "roomNum": "101",
            "teacherNames": "张三,李四1"
          }
        ],
        tableList: [ //
          // {
          //   "time": "08:00-08:05",
          //   "arrangementList": [{
          //       "userName": "张三",
          //       "roomNum": "101",
          //       "timeCount": "1"
          //     },
          //     {
          //       "userName": "张三",
          //       "roomNum": "102",
          //       "timeCount": "3"
          //     },
          //     {
          //       "userName": "休息",
          //       "roomNum": "103",
          //       "timeCount": "1"
          //     }
          //   ]
          // }
        ],
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
        this.headerList = res.data.headerList;
        this.tableList = res.data.timeList;
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
      spTimeTable
    }
  }

</script>

<style>


</style>
