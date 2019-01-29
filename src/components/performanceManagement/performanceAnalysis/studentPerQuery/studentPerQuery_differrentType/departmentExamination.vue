<!----------------------------------
****--@name     培训质量(出科考试)
****--@role     ${*}
****--@date     2017/12/7
****--@author   gx
----------------------------------->
<!----------------------------------
****--@name     培训质量(定期评价)
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
        prop="passMark"
        label="及格分数">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="score"
        label="得分">
        <template scope="scope">
          <span :style="{color:(+scope.row.score==+scope.row.passMark||+scope.row.score>+scope.row.passMark)?'#34FF3E':'#fa5180'}">{{+scope.row.score}}</span>
        </template>
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
            name:'出科理论考试',
            passMark:60,
            score:89,
          },
          {
            name:'出科技能考试',
            passMark:60,
            score:85,
          },
          {
            name:'出科技能考试',
            passMark:60,
            score:95,
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
