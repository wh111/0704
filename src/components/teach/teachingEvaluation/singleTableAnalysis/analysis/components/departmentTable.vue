<!--
****--@file     evaluateTable
****--@date     2017/12/8 下午4:09
****--@author   jhd
****--@describe   科室评价表
-->
<template>
  <div class="cttsacd-content">
    <p class="tip">
      <span>轮转科室：科室名称</span>
      <span class="right">轮转起止时间：2017-11-08 至 2017-12-08</span>
    </p>
    <el-table
      align="center"
      border
      :span-method="arraySpanMethod"
      :data="tableData1"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;height: 100%"
    >
      <el-table-column
        prop="title"
        label=""
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        prop="bzt"
        label="不赞同">
      </el-table-column>
      <el-table-column
        prop="bztbfd"
        label="不赞同不反对">
      </el-table-column>
      <el-table-column
        prop="jbzt"
        label="基本赞同"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="hzt"
        label="很赞同"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="wqzt"
        label="完全赞同"
        align="center"
      >
      </el-table-column>

    </el-table>
    <p class="tip">
      <span class="right" style="margin-right: 100px">总计：</span>
    </p>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        tableData1: [{
          title: '我很了解这位医生',
          bzt: '',
          bztbfd: '',
          jbzt: '',
          hzt: '',
          wqzt: ''
        }, {
          title: '这位医生把我当人看',
          bzt: '',
          bztbfd: '',
          jbzt: '',
          hzt: '',
          wqzt: ''
        }, {
          title: '这位医生非常理解我的感受',
          bzt: '',
          bztbfd: '',
          jbzt: '',
          hzt: '',
          wqzt: ''
        }, {
          title: '我知道该期望这位医生什么',
          bzt: '',
          bztbfd: '',
          jbzt: '',
          hzt: '',
          wqzt: ''
        }, {
          title: '这位医生非常关心我',
          bzt: '',
          bztbfd: '',
          jbzt: '',
          hzt: '',
          wqzt: ''
        }, {
          title: '这位医生认真对待我',
          bzt: '',
          bztbfd: '',
          jbzt: '',
          hzt: '',
          wqzt: ''
        }, {
          title: '这位医生按照我的方式接受我，尊重我',
          bzt: '',
          bztbfd: '',
          jbzt: '',
          hzt: '',
          wqzt: ''
        }, {
          title: '与这位医生在一起我非常放松',
          bzt: '',
          bztbfd: '',
          jbzt: '',
          hzt: '',
          wqzt: ''
        }]
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

      },
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (rowIndex  === 11) {
          return [7, 1];
        }
      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }

</script>
<style lang="scss">
  @import './style';
</style>
