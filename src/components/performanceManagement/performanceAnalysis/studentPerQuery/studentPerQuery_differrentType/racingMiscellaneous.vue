<!----------------------------------
****--@name     能力提升(各类竞赛)
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
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="result"
        label="结果">
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
            name:'2017级技能操作大赛',
            result:'参与',
          },
          {
            name:'2017级技能操作大赛',
            result:'获奖',
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
