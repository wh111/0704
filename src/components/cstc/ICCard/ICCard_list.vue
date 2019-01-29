<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div class="ICCard">
    <el-tabs v-model="active">
      <el-tab-pane label="IC卡管理" name="manage">
        <manage v-if="active === 'manage'" @show="show"></manage>
      </el-tab-pane>
      <el-tab-pane label="刷卡记录" name="record">
        <record v-if="active === 'record'" @show="show"></record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss">
  $padding: 12px;
  .ICCard {
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
<script>
  /*当前组件必要引入*/
  import manage from './ICCard_manage.vue'; // IC卡管理
  import record from './ICCard_record.vue'; // 刷卡记录
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        active: 'manage', // 视图 门禁管理
      }
    },
    components: {
      manage,
      record,
    },
    methods: {
      // 视图切换
      show(view) {
        this.active = view
      },
    },
  }

</script>
