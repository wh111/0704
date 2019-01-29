<template>
  <!-- 门禁 -->
  <div ref="accessControl" class="accessControl">
    <el-tabs v-model="accessControlActive">
      <el-tab-pane label="门禁卡管理" name="manage">
        <manage v-if="accessControlActive === 'manage'" @show="show"></manage>
      </el-tab-pane>
      <el-tab-pane label="刷卡记录" name="record">
        <record v-if="accessControlActive === 'record'" @show="show"></record>
      </el-tab-pane>
      <el-tab-pane label="权限管理" name="jurisdiction">
        <jurisdiction v-if="accessControlActive === 'jurisdiction'" @show="show"></jurisdiction>
      </el-tab-pane>
      <el-tab-pane label="门禁设备管理" name="device">
        <device v-if="accessControlActive === 'device'" @show="show"></device>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import manage from './manage/manage_list'; // 门禁卡管理
  import record from './record/record_list'; // 刷卡记录
  import jurisdiction from './jurisdiction/jurisdiction_list'; // 权限管理
  import device from './device/device_list'; // 设备管理
  export default {
    data() {
      return {
        accessControlActive: 'manage', // 视图 门禁管理
      }
    },
    components: {
      manage,
      record,
      jurisdiction,
      device
    },
    methods: {
      // 视图切换
      show(view) {
        this.accessControlActive = view
      },
    },
  }

</script>

<style lang="scss">
  $padding: 12px;
  .accessControl {
    position: absolute;
    top: $padding;
    left: $padding;
    right: $padding;
    bottom: $padding;
    .el-tabs__content {
      position: absolute;
      top: 52px;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

</style>
