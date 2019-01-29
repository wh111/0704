<!----------------------------------
****--@name     学生绩效（查看）
****--@role     ${*}
****--@date     2017/12/7
****--@author   gx
----------------------------------->
<template>
    <div>
      <div  style=" font-size: 32px;text-align: center;line-height: 40px;margin-bottom: 15px;"><strong>教研室教学能力评估</strong></div>
      <!--列表数据-->
      <el-table
        align="center"
        :data="operailityData"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;height: 100%">
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="score"
          label="得分">
        </el-table-column>
      </el-table>
      <br>

      <div>
        <!--表格数据-->
        <div
          id="myTable"
          ref="myTable"
        >
          <el-table
            align="center"
            :data="tableData"
            border
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;height: 100%">
            <el-table-column
              show-overflow-tooltip
              prop="classify"
              label="分类">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="firstLevel"
              label="一级指标">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="secondLevel"
              label="二级指标">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="score"
              label="得分"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="remark"
              label="备注">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="操作"
              width="80">
              <template scope="scope">
                <el-button size="small" type="info" @click="performance(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
</template>
<script>
    //当前组件引入全局的util
    import tableData from './staffRoomPerQuery_quotaData.js'
    let Util = null;
    export default {
      props:['operailityData'],
        data() {
            return {
              dynamicHt:100,
              tableData: tableData,
              performanceId:{id:'performanceId',title:'查看'},
              performanceType:'',
              rowData:''
            }
        },
        methods: {
          //初始化请求列表数据
          init() {

          },

          performance(row){
//            this.rowData = row;
//            this.performanceId.title = row.secondLevel;
//            this.performanceType = row.type;
//            this.showModal = true;
          },

        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
        }
    }
</script>
