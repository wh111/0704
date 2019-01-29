<!--
****--房间使用情况统计(uploadPhotoWall)
-->
<template>
  <div ref="roomUse" style="height: 100%;">
    <el-tabs v-model="activeName">
      <el-tab-pane label="房间使用情况统计" name="useInfo"></el-tab-pane>
      <el-tab-pane label="房间预约情况统计" name="reserveInfo"></el-tab-pane>
      <el-tab-pane label="房间统计信息" name="roomInfo"></el-tab-pane>
    </el-tabs>
    <use-info v-if="activeName==='useInfo'"></use-info>
    <reserve-info v-if="activeName==='reserveInfo'"></reserve-info>
    <room-info v-if="activeName==='roomInfo'"></room-info>
  </div>
</template>

<script>
  let Util = null;
  import useInfo from './RoomUsageStatistics_useInfo';
  import reserveInfo from './RoomUsageStatistics_reserveInfo';
  import roomInfo from './RoomUsageStatistics_roomInfo';

  export default {
    name: 'room-usage-statistics_list',
    data () {
      return {
        activeName: 'useInfo'
      };
    },
    methods: {
      init: function () {
        Util = this.$util;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
      }
    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    components: {
      useInfo, reserveInfo, roomInfo
    }
  };
</script>

<style>
</style>
