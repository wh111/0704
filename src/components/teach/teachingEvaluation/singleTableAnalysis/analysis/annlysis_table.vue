<!--
****--@file     annlysis_table
****--@date     2017/12/8 下午4:02
****--@author   jhd
****--@describe   评价表
-->
<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基地评价表" name="first">
      <base-table></base-table>
    </el-tab-pane>
    <el-tab-pane label="科室评价表" name="second">
      <department-table></department-table>
    </el-tab-pane>
    <el-tab-pane label="住院医师评价表" name="third">
      <inpatient-table></inpatient-table>
    </el-tab-pane>
    <el-tab-pane label="科室带教综合评价表" name="fourth">
      <teaching-table></teaching-table>
    </el-tab-pane>
    <el-tab-pane label="日常考核表" name="fifth">
      <daily-table></daily-table>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  /*当前组件必要引入*/
  import baseTable from './components/baseTable.vue'
  import departmentTable from './components/departmentTable.vue'
  import inpatientTable from './components/inpatientTable.vue'
  import teachingTable from './components/teachingTable.vue'
  import dailyTable from './components/dailyTable.vue'
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      init(){
        Util = this.$util
      },
      handleClick(tab, event) {

      }
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      baseTable,
      departmentTable,
      inpatientTable,
      teachingTable,
      dailyTable
    }
  }

</script>
