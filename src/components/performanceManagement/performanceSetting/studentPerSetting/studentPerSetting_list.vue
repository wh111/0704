<!----------------------------------
****--@name     学生绩效设置
****--@role     ${*}
****--@date     2017/12/6
****--@author   gx
----------------------------------->
<template>
    <div class="studentPerSetting-sxs">
      <div  class="sxs-handler"><strong>学生绩效设置</strong></div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="实习生" name="SXS"> <span slot="label" class="studentPerSetting-text">实习生</span></el-tab-pane>
        <el-tab-pane label="研究生" name="YJS"><span slot="label" class="studentPerSetting-text">研究生</span></el-tab-pane>
        <el-tab-pane label="住院医" name="ZYY"><span slot="label" class="studentPerSetting-text">住院医</span></el-tab-pane>
        <el-tab-pane label="进修生" name="JXS"><span slot="label" class="studentPerSetting-text">进修生</span></el-tab-pane>
      </el-tabs>
      <!--实习生-->
      <sxs v-if="activeName=='SXS'" class="studentPerSetting-sxs"></sxs>
      <!--研究生-->
      <yjs v-if="activeName=='YJS'" class="studentPerSetting-sxs"></yjs>
      <!--住院医-->
      <zyy v-if="activeName=='ZYY'" class="studentPerSetting-sxs"></zyy>
      <!--进修生-->
      <jxs v-if="activeName=='JXS'" class="studentPerSetting-sxs"></jxs>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import sxs  from './studentPerSetting_sxs.vue'  //实习生
    import yjs  from './studentPerSetting_yjs.vue'  //研究生
    import zyy  from './studentPerSetting_zyy.vue'  //住院医
    import jxs  from './studentPerSetting_jxs.vue'  //进修生
    //当前组件引入全局的util
    let Util = null;
    export default {
        data() {
            return {
              activeName:'SXS',
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
          sxs,
          yjs,
          zyy,
          jxs,
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
