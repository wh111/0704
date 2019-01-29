<template>
  <!-- 时间表 - 整体安排 -->
  <time-table :headerList="headerList" :tableList="tableList"></time-table>
</template>

<script>
  import timeTable from '../../examineInterval/examineIntervalTimeTable/examineIntervalTimeTable_student';
  export default {
    props: ['id', 'api'],
    data() {
      return {
        headerList: [],
        tableList: [],
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
        this.headerList = res.data.stationRoomList;
        this.tableList = res.data.timeList;
      }
    },
    created() {
      this.getTimeData()
    },
    watch: {
      id(val) {
        this.getTimeData();
        // console.log(val)
      }
    },
    components: {
      timeTable
    }
  }

</script>

<style>


</style>
