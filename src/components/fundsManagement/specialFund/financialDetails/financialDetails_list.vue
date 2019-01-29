<!----------------------------------
****--@name     经费查询
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div class="finacialDetailsModel" style="height:100%">
    <el-tabs v-model="saActiveName">
      <el-tab-pane label="总账查询" name="totalFin">
        <totalFinancial v-if="saActiveName === 'totalFin'" :isInit="currentTabIdx" style="height: 100%;"></totalFinancial>
      </el-tab-pane>
      <el-tab-pane label="分账查询" name="partFin">
        <partFinancial v-if="saActiveName === 'partFin'" style="height: 100%;"></partFinancial>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>
  .finacialDetailsModel .el-tabs {
    position: relative;
    height: 100%;
  }

  .finacialDetailsModel .el-tabs__content {
    position: absolute;
    left: 0;
    right: 0;
    top: 65px;
    bottom: 0;
  }

  .finacialDetailsModel .el-tab-pane {
    height: 100%;
  }

</style>
<script>
  import partFinancial from './partFinancialDetails_list.vue'
  import totalFinancial from './totalFinancialDetails_list.vue'
  export default {

    data() {
      return {
        saActiveName: 'totalFin',
        currentTabIdx: "0",
      }
    },
    components: {
      partFinancial,
      totalFinancial
    }


  }

</script>
