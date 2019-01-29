<!--日常管理-->
<!--评优-->


<template>
  <div style="height: 100%;position: relative;">
    <el-steps :active="active" :center="true" class="highestQualityStep">
      <el-step title="评优项目管理" @click.native="switched(0)"></el-step>
      <el-step title="自荐审核" @click.native="switched(1)"></el-step>
      <el-step title="评分" @click.native="switched(2)"></el-step>
      <el-step title="组织投票" @click.native="switched(3)"></el-step>
      <el-step title="公告" @click.native="switched(4)"></el-step>
      <el-step title="奖学金" @click.native="switched(5)"></el-step>
    </el-steps>
    <!--评优项目管理-->
    <div v-if="active == 0" class="autoLayerContent">
      <project-management></project-management>
    </div>
    <!--自荐审核-->
    <div v-if="active == 1" class="autoLayerContent">
      <recommend></recommend>
    </div>
    <!--评分-->
    <div v-if="active == 2" class="autoLayerContent">
      <score></score>
    </div>
    <!--组织投票-->
    <div v-if="active == 3" class="autoLayerContent">
      <organizationa-voting></organizationa-voting>
    </div>
    <!--公告-->
    <div v-if="active == 4" class="autoLayerContent">
      <notice></notice>
    </div>
    <!--奖学金-->
    <div v-if="active == 5" class="autoLayerContent">
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
  .highestQualityStep .el-step__icon{cursor: pointer;}
</style>
<script>
  //引入--评优项目管理--
  import projectManagement from './projectManagement/projectManagement_list.vue';
  //引入--自荐审核--
  import recommend from './recommend/recommend_list.vue';
  //引入--评分--
  import score from './score/score_depList.vue';
  //引入--组织投票--
  import OrganizationaVoting from './OrganizationaVoting/OrganizationaVoting_list.vue';
  //引入--公告--
  import notice from './notice/notice_list.vue';
  //引入--奖学金--
  import scholarship from './scholarship/scholarship_list.vue';

  export default {
    data() {
      return {
        active: 0,
      }
    },
    methods: {
      switched(index) {
        this.active = index;
      }
    },
    components: {
      projectManagement, recommend, score, OrganizationaVoting, notice, scholarship
    }
  }
</script>
