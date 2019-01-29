<template>
  <!-- 考核场次对应的考站信息视图 -->
  <div>
    <station-list v-if="EMS_active === 'list'" :sceneId="sceneId" @show="show" :listReq="listReq"></station-list>
    <room-info v-if="EMS_active === 'info'" :sceneId="sceneId" :stationId="stationId" :roomId="roomId" :index="index" @show="show"
      :infoReq="infoReq"></room-info>
  </div>
</template>

<script>
  import stationList from './examineMonitorStation_list'; // 考站列表
  import roomInfo from '../examineMonitorRoom/examineMonitorRoom_info'; // 考站信息
  export default {
    props: ['sceneId'],
    data() {
      return {
        EMS_active: 'list', // list | info
        stationId: 0, // 考站id
        roomId: 0, // 房间id
        index: 0, // 监控数据中的考站列表索引
        listReq: true, // 列表开启长连接
        infoReq: true, // 考站信息开启长连接
      }
    },
    methods: {
      // 列表与信息视图切换
      show(res) {
        if (res.room) {
          this.stationId = res.room.index;
          this.roomId = this.$store.state.examineMonitor.index.data.stationRoomList[res.room.cIndex].roomId;
          this.index = res.room.cIndex;
          if (typeof res.listReq !== 'undefined') {
            this.listReq = res.listReq
          }
          if (typeof res.infoReq !== 'undefined') {
            this.infoReq = res.infoReq
          }
        }
        this.EMS_active = res.view;
      },
    },
    components: {
      stationList,
      roomInfo
    },
    watch: {
      sceneId(val) {
        this.EMS_active = 'list'
      }
    }
  }

</script>

<style>


</style>
