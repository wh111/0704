<!--
****--@file     perstudent_list
****--@date     2018/10/15 15:16
****--@author   YYL
****--@describe 绩效指标统计
-->
<template>
  <div class="studentPerSetting-sxs">
    <!--<div  class="sxs-handler"><strong>绩效指标维护</strong></div>-->
    <el-tabs v-model="activeName">
      <el-tab-pane label="住院医师" name="zyys"><span slot="label" class="studentPerSetting-text">住院医师</span></el-tab-pane>
      <el-tab-pane label="实习生" name="sxs"><span slot="label" class="studentPerSetting-text">实习生</span></el-tab-pane>
      <el-tab-pane label="进修生" name="jxs"><span slot="label" class="studentPerSetting-text">进修生</span></el-tab-pane>
      <el-tab-pane label="研究生(专业学位)" name="yjszyxw"><span slot="label" class="studentPerSetting-text">研究生(专业学位)</span></el-tab-pane>
      <el-tab-pane label="研究生(科学学位)" name="yjskxxw"><span slot="label" class="studentPerSetting-text">研究生(科学学位)</span></el-tab-pane>
    </el-tabs>
    <div class="content">
      <!--住院医师-->
      <zyys v-if="activeName=='zyys'" class="studentPerSetting-sxs"></zyys>
      <!--实习生-->
      <sxs v-if="activeName=='sxs'" class="studentPerSetting-sxs"></sxs>
      <!--进修生-->
      <jxs v-if="activeName=='jxs'" class="studentPerSetting-sxs"></jxs>
      <!--研究生(专业学位)-->
      <yjszyxw v-if="activeName=='yjszyxw'" class="studentPerSetting-sxs"></yjszyxw>
      <!--研究生(科学学位)-->
      <yjskxxw v-if="activeName=='yjskxxw'" class="studentPerSetting-sxs"></yjskxxw>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //住院医师
  import zyys from './perstudent_zyys'
  //实习生
  import sxs from './perstudent_sxs'
  //进修生
  import jxs from './perstudent_jxs'
  //研究生(专业学位)
  import yjszyxw from './perstudent_yjszyxw'
  // 研究生(科学学位)
  import yjskxxw from './perstudent_yjskxxw'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'perstudent',
    data () {
      return {
        activeName: 'zyys'
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
      zyys,sxs,jxs,yjskxxw,yjszyxw
    }
  };

</script>
<style lang="scss">
  .studentPerSetting-sxs{
    height:100%;
    .studentPerSetting-text{
      font-size: 16px;
    }
    .content {
      padding-bottom: 60px;
      height: 100%;
    }
  }

</style>
