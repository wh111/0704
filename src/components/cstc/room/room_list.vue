<template>
  <div ref="content">
    <!-- 导航菜单 -->
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="房间管理" name="roomManage">
        <keep-alive>
          <room-manage v-if="activeName == 'roomManage'" :contenHeight="contenHeight" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="房间使用情况" name="roomUsage">
        <keep-alive>
          <room-usage v-if="activeName == 'roomUsage'" :contenHeight="contenHeight" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import roomManage from './roomManage/roomManage_list'; // 房间管理
  import roomUsage from './roomUsage/roomUsage_list'; // 房间使用情况

  export default {
    data() {
      return {
        activeName: 'roomManage', // 房间管理默认视图-->roomManage
        contenHeight: 100,
      }
    },
    methods: {
      // 获取内容部分高度
      getContentHeight() {
        this.contenHeight = this.$refs.content.parentNode.parentNode.offsetHeight;
      }
    },
    components: {
      roomManage,
      roomUsage
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContentHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, "resize", this.getContentHeight);
      })
    }
  }

</script>
