<template>
  <!-- 综合分析统计 - 视图切换 -->
  <div>
    <index v-show="activeName === 'index'" @show="show"></index>
    <ays-score v-if="activeName === 'score'" @show="show" :scoreData="scoreData"></ays-score>
  </div>
</template>

<script>
  import index from './singleTableAnalysis_index'; // 综合分析首页列表
  import aysScore from './analysis/analysis_score'; // 住院医师日常考核科室评价表（查看分析）
  export default {
    data() {
      return {
        scoreData: {}, // 查看分析数据
        activeName: 'index',
      }
    },
    methods: {
      show(view, scoreData) {
        this.activeName = view;
        if (scoreData) {
          this.scoreData = scoreData
        }
      }
    },
    components: {
      index,
      aysScore
    }
  }

</script>

<style>
  /* 综合分析统计 */

</style>
