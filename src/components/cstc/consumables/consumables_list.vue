<template>
  <div id="content" ref="content">
    <el-tabs v-model="activeName">
      <el-tab-pane label="易耗品管理" name="manage">
        <!--<keep-alive>-->
        <consumables-manage v-if="activeName == 'manage'" :contenHeight="contenHeight" @show="show"></consumables-manage>
        <!--</keep-alive>-->
      </el-tab-pane>
      <el-tab-pane label="使用记录" name="use">
        <!--<keep-alive>-->
        <consumables-use v-if="activeName == 'use'" :contentHeight="contenHeight"></consumables-use>
        <!--</keep-alive>-->
      </el-tab-pane>
      <el-tab-pane label="盘点记录" name="count">
        <!--<keep-alive>-->
        <consumables-count v-if="activeName == 'count'" :contentHeight="contenHeight"></consumables-count>
        <!--</keep-alive>-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import consumablesManage from './consumablesManage/consumablesManage_list'; // 易耗品管理
  import consumablesUse from './consumablesUse/consumablesUse_list'; // 使用记录
  import consumablesCount from './consumablesCount/consumablesCount_list'; // 盘点记录

  export default {
    data() {
      return {
        // 内容高度
        contenHeight: 100,
        // 默认激活视图
        activeName: 'manage',
      }
    },
    methods: {
      // 获取内容部分高度
      getContentHeight() {
        this.contenHeight = this.$refs.content.parentNode.offsetHeight;
      },
      // 视图切换
      show(view) {
        this.activeName = view
      }
    },
    components: {
      consumablesManage,
      consumablesUse,
      consumablesCount
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

<style lang="scss">
  .buttonList {
    &,
    .el-button--small {
      margin-bottom: 10px;
    }
  }

</style>
