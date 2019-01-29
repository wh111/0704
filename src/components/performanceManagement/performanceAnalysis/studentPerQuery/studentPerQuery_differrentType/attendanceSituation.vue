<!----------------------------------
****--@name     日常管理(考勤情况)
****--@role     ${*}
****--@date     2017/12/7
****--@author   gx
----------------------------------->

<template>
  <div>
    <el-table
      align="center"
      :data="tableData"
      tooltip-effect="dark"
      highlight-current-row
      border
      style="width: 100%;height: 100%">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="75">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="absenteeism"
        label="旷工">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="late"
        label="迟到">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="leaveEarly"
        label="早退">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="sickLeave"
        label="病假">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="casualLeave"
        label="事假">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['operailityData'],
    data() {
      return {
        tableData:[
          {
            absenteeism:0,
            late:2,
            leaveEarly:1,
            sickLeave:0,
            casualLeave:1,
          },
        ],
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
    computer:{

    },
    components: {}
  }
</script>
