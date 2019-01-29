<!----------------------------------
****--@name     轮转统计
****--@role     ${*}
****--@date     2018/10/24
****--@author   gx
----------------------------------->
<template>
  <div style="height: 100%">
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="按科室查询" name="dep"></el-tab-pane>
        <el-tab-pane label="按带教老师查询" name="teacher"></el-tab-pane>
      </el-tabs>
    </template>
    <depList style="height: 100%" v-if="activeName==='dep'"></depList>
    <teacherList style="height: 100%"
                 v-if="activeName==='teacher'"></teacherList>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import depList from './rotaryStatistics_depList.vue'
  import teacherList from './rotaryStatistics_teacherList.vue'
  //当前组件引入全局的util
  let Util = null
  export default {
    data () {
      return {
        activeName: 'dep',
      }
    },
    methods: {
      //初始化请求列表数据
      init () {

      },

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      depList,
      teacherList,
    },
  }
</script>
<style>
  #myTable .el-table .cell, #myTable .el-table th > div {
    padding-left: 14px;
    padding-right: 14px;
  }
</style>
