<template>
  <!-- 预约设置 -->
  <div id="bespeakSetting" ref="bespeakSetting">
    <el-tabs v-model="activeName">
      <el-tab-pane label="房间预约管理" name="room">
        <room-list v-if="activeName == 'room'" :contenHeight="contenHeight" @show="show"></room-list>
      </el-tab-pane>
      <!--<el-tab-pane label="模型预约管理" name="model">-->
        <!--<model-list v-if="activeName == 'model'" :contenHeight="contenHeight" @show="show"></model-list>-->
      <!--</el-tab-pane>-->
      <el-tab-pane label="自主训练管理" name="project">
        <project-list v-if="activeName == 'project'" :contenHeight="contenHeight" @show="show"></project-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import roomList from './room/room_list'; // 房间预约管理
//  import modelList from './model/model_list'; // 模型预约管理
  import projectList from './project/project_list'; // 自主训练管理
  export default {
    data() {
      return {
        // 内容高度
        contenHeight: 100,
        // 默认激活视图
        activeName: 'room',
      }
    },
    methods: {
      // 获取内容部分高度
      getContentHeight() {
        this.contenHeight = this.$refs.bespeakSetting.parentNode.offsetHeight - 80;
      },
      // 视图切换
      show(view) {
        this.activeName = view
      }
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
    },
    components: {
      roomList,
//      modelList,
      projectList
    }
  }

</script>

<style lang="scss">
  /* 预约设置 */

</style>
