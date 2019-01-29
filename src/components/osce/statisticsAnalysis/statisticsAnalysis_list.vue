<!--统计分析-->
<template>
  <div class="saAnalModel" style="height:100%">
    <el-tabs v-model="saActiveName">
      <el-tab-pane label="场次统计" name="nosocomial">
        <session v-if="saActiveName === 'nosocomial'" :isInit="currentTabIdx" style="height: 100%;"></session>
      </el-tab-pane>
      <el-tab-pane label="多场次统计" name="standard">
        <more-session v-if="saActiveName === 'standard'" style="height: 100%;"></more-session>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>
  .saAnalModel .el-tabs {
    position: relative;
    height: 100%;
  }

  .saAnalModel .el-tabs__content {
    position: absolute;
    left: 0;
    right: 0;
    top: 65px;
    bottom: 0;
  }

  .saAnalModel .el-tab-pane {
    height: 100%;
  }

</style>
<script>
  import session from './sessionStatistics/sessionStatistics_list.vue'
  import moreSession from './moreSessionStatistics/moreSessionStatistics_list.vue'
  export default {

    data() {
      return {
        saActiveName: 'nosocomial',
        currentTabIdx: "0",
      }
    },
    components: {
      moreSession,
      session
    }


  }

</script>
