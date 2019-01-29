<!--
****--@file     permaintenance_list
****--@date     2018/10/15 15:15
****--@author   YYL
****--@describe 绩效指标维护
-->
<template>
  <div class="studentPerSetting-sxs">
    <!--<div  class="sxs-handler"><strong>绩效指标维护</strong></div>-->
    <el-tabs v-model="activeName">
      <el-tab-pane label="本科教育" name="bkjx"><span slot="label" class="studentPerSetting-text">本科教育</span></el-tab-pane>
      <el-tab-pane label="实习带教" name="sxdj"><span slot="label" class="studentPerSetting-text">实习带教</span></el-tab-pane>
      <el-tab-pane label="研究生培养" name="yjspy"><span slot="label" class="studentPerSetting-text">研究生培养</span></el-tab-pane>
      <el-tab-pane label="住院医师培养" name="zyyspy"><span slot="label" class="studentPerSetting-text">住院医师培养</span></el-tab-pane>
      <el-tab-pane label="进修生培养" name="jxspy"><span slot="label" class="studentPerSetting-text">进修生培养</span></el-tab-pane>
      <el-tab-pane label="教学能力" name="jxnl"><span slot="label" class="studentPerSetting-text">教学能力</span></el-tab-pane>
      <el-tab-pane label="扣分项" name="kfx"><span slot="label" class="studentPerSetting-text">扣分项</span></el-tab-pane>
    </el-tabs>
    <div class="content">
      <!--本科教育-->
      <bkjx v-if="activeName=='bkjx'" class="studentPerSetting-sxs"></bkjx>
      <!--实习带教-->
      <sxdj v-if="activeName=='sxdj'" class="studentPerSetting-sxs"></sxdj>
      <!--研究生培养-->
      <yjspy v-if="activeName=='yjspy'" class="studentPerSetting-sxs"></yjspy>
      <!--住院医师培养-->
      <zyyspy v-if="activeName=='zyyspy'" class="studentPerSetting-sxs"></zyyspy>
      <!--进修生培养-->
      <jxspy v-if="activeName=='jxspy'" class="studentPerSetting-sxs"></jxspy>
      <!--教学能力-->
      <jxnl v-if="activeName=='jxnl'" class="studentPerSetting-sxs"></jxnl>
      <!--扣分项-->
      <kfx v-if="activeName=='kfx'" class="studentPerSetting-sxs"></kfx>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import bkjx from './perteach_bkjx.vue';  //本科教育
  import sxdj from './perteach_sxdj.vue';  //实习带教
  import yjspy from './perteach_yjspy.vue';  //研究生培养
  import zyyspy from './perteach_zyyspy'; //住院医师培养
  import jxspy from './perteach_jxspy'; //进修生培养
  import jxnl from './perteach_jxnl'; //教学能力
  import kfx from './perteach_kfx'; //扣分项
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'permaintenance',
    data () {
      return {
        activeName: 'bkjx'
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      bkjx,
      sxdj,
      yjspy,
      zyyspy,
      jxspy,
      jxnl,
      kfx
    }
  };

</script>
<style lang="scss">
  .studentPerSetting-sxs{
    height:100%;
    /*.sxs-handler{*/
    /*font-size: 32px;*/
    /*text-align: center;*/
    /*line-height: 40px;*/
    /*margin: 5px;*/
    /*}*/
    .studentPerSetting-text{
      font-size: 16px;
    }
    .content {
      padding-bottom: 60px;
      height: 100%;
    }
  }

</style>
