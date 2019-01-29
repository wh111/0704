<!--日常管理-->
<!--评优-->
<template>
  <div>
    <el-steps :active="active" :center="true" class="highestQualityStep">
      <el-step title="自荐" @click.native="switched(0)" style="cursor: pointer"></el-step>
      <el-step title="评分" @click.native="switched(1)" style="cursor: pointer"></el-step>
      <el-step title="民主投票" @click.native="switched(2)" style="cursor: pointer"></el-step>
      <el-step title="奖学金" @click.native="switched(3)" style="cursor: pointer"></el-step>
    </el-steps>
    <!--自荐-->
    <div v-if="active == 0" class="autoLayerContent">
      <recommend></recommend>
    </div>
    <!--评分-->
    <div v-if="active == 1" class="autoLayerContent">
      <score></score>
    </div>
    <!--民主投票-->
    <div v-if="active == 2" class="autoLayerContent">
      <democratic-vote></democratic-vote>
    </div>
    <!--奖学金-->
    <div v-if="active == 3" class="autoLayerContent">
      <scholarship></scholarship>
    </div>
  </div>
</template>
<style>
  .autoLayerContent {
    position: absolute;
    top: 100px;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
<script>
  //引入--自荐审核--
  import recommend from './recommend_study/recommend_list.vue';
  //引入--评分--
  import score from './score/score_studyList.vue';
  //引入--民主投票--
  import democraticVote from './democraticVote/democraticVote_list.vue';
  //引入--奖学金--
  import scholarship from './scholarship/scholarship_study_list.vue';

  export default {
    data() {
      return {
        active: 0,
        step: 3
      }
    },
    methods: {
      switched(index) {
        this.active = index;
      }
    },
    components: {
      recommend, score, democraticVote, scholarship
    }
  }
</script>
