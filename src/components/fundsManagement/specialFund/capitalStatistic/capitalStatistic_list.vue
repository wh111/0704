<!----------------------------------
****--@name     统计分析
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div class="statisticMoneyModel" style="height:100%">
    <el-tabs v-model="saActiveName">
      <!--<el-tab-pane label="经费统计" name="statistic">-->
        <!--<costStatistics v-if="saActiveName === 'statistic'" :isInit="currentTabIdx" style="height: 100%;"></costStatistics>-->
      <!--</el-tab-pane>-->
      <el-tab-pane label="资金库统计" name="statistic">
        <finacial-statistics v-if="saActiveName === 'statistic'" style="height: 100%;"></finacial-statistics>
      </el-tab-pane>
      <el-tab-pane label="经费统计" name="analysis">
        <budgetAnalysis v-if="saActiveName === 'analysis'" style="height: 100%;"></budgetAnalysis>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<style>
  .statisticMoneyModel .el-tabs {
    position: relative;
    height: 100%;
  }

  .statisticMoneyModel .el-tabs__content {
    position: absolute;
    left: 0;
    right: 0;
    top: 65px;
    bottom: 0;
  }

  .statisticMoneyModel .el-tab-pane {
    height: 100%;
  }

</style>
<script>
  import budgetAnalysis from './budgetAnalysis_list.vue'
  import finacialStatistics from './financialStatistics.vue'
  import costStatistics from './costStatistics_list.vue'
  export default {

    data() {
      return {
        saActiveName: 'statistic',
        currentTabIdx: "0",
      }
    },
    components: {
      budgetAnalysis,
      costStatistics,
      finacialStatistics
    }


  }

</script>
