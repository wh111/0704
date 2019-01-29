<!----------------------------------
****--@name     轮转记录
****--@role     ${*}
****--@date     2017/11/23
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-table
        align="center"
        :height="height"
        :data="operailityData.rotaryDepts"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          align="center"
          prop="depName"
          label="科室名称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="beginTime"
          label="开始时间"
          align="center">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="endTime"
          label="结束时间"
          align="center">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="teachUsers"
          label="带教老师">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="userSummary"
          label="小结是否填写"
          width="100">
          <template scope="scope">
            {{scope.row.userSummary?'已填写':'未填写'}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="depSummary"
          label="科室是否评语"
          width="100">
          <template scope="scope">
            {{scope.row.depSummary?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="theoryExaminationScores"
          label="理论考核成绩"
          width="80">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="osceExaminationScores"
          label="技能考核成绩"
          width="80">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="dayExaminationScores"
          label="日常考核成绩"
          width="80">
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
    /*当前组件必要引入*/

    //当前组件引入全局的util
    let Util = null;
    export default {
      props:['operailityData','height'],
        data() {
            return {}
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
        components: {}
    }
</script>
