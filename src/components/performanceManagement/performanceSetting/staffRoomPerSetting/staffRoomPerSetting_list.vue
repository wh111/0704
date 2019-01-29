<!----------------------------------
****--@name     教研室绩效设置
****--@role     ${*}
****--@date     2017/12/6
****--@author   gx
----------------------------------->
<template>
  <div class="studentPerSetting-sxs">
    <div  class="sxs-handler"><strong>教研室绩效设置</strong></div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="本科教学" name="BKS"> <span slot="label" class="studentPerSetting-text">本科教学</span></el-tab-pane>
      <el-tab-pane label="实习带教" name="SXS"><span slot="label" class="studentPerSetting-text">实习带教</span></el-tab-pane>
      <el-tab-pane label="研究生培养" name="YJS"><span slot="label" class="studentPerSetting-text">研究生培养</span></el-tab-pane>
      <el-tab-pane label="住院医师培训" name="ZYY"><span slot="label" class="studentPerSetting-text">住院医师培训</span></el-tab-pane>
      <el-tab-pane label="进修生" name="JXS"><span slot="label" class="studentPerSetting-text">进修生</span></el-tab-pane>
      <el-tab-pane label="教学能力" name="TeachingAbility"><span slot="label" class="studentPerSetting-text">教学能力</span></el-tab-pane>
    </el-tabs>
    <!--本科教学-->
    <BKS v-if="activeName=='BKS'" class="studentPerSetting-sxs"> </BKS>
    <!--实习带教-->
    <SXS v-if="activeName=='SXS'" class="studentPerSetting-sxs"> </SXS>
    <!--研究生培养-->
    <YJS v-if="activeName=='YJS'" class="studentPerSetting-sxs"> </YJS>
    <!--住院医师培训-->
    <ZYY v-if="activeName=='ZYY'" class="studentPerSetting-sxs"> </ZYY>
    <!--进修生培养-->
    <JXS v-if="activeName=='JXS'" class="studentPerSetting-sxs"> </JXS>
    <!--教学能力-->
    <TeachingAbility v-if="activeName=='TeachingAbility'" class="studentPerSetting-sxs"> </TeachingAbility>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import BKS  from './teacherPerSetting_BKS.vue'  //本科教学
  import SXS  from './teacherPerSetting_SXS.vue'  //实习带教
  import YJS  from './teacherPerSetting_YJS.vue'  //研究生培养
  import ZYY  from './teacherPerSetting_ZYY.vue'  //住院医师培训
  import JXS  from './teacherPerSetting_JXS.vue'  //进修生培养
  import TeachingAbility  from './teacherPerSetting_TeachingAbility.vue'  //教学能力
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        activeName:'BKS',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      BKS,
      SXS,
      YJS,
      ZYY,
      JXS,
      TeachingAbility,
    }
  }
</script>
<style lang="scss">
  .studentPerSetting-sxs{
    height:100%;
    .sxs-handler{
      font-size: 32px;
      text-align: center;
      line-height: 40px;
      margin: 5px;
    }
    .studentPerSetting-text{
      font-size: 16px;
    }
  }

</style>
