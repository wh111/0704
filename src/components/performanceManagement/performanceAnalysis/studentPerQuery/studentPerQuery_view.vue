<!----------------------------------
****--@name     学生绩效（查看）
****--@role     ${*}
****--@date     2017/12/7
****--@author   gx
----------------------------------->
<template>
    <div>
      <div  style=" font-size: 32px;text-align: center;line-height: 40px;margin-bottom: 15px;"><strong>学生个人绩效</strong></div>
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
          prop="codeNumber"
          label="编号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="studentTypes"
          label="生源">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="grade"
          label="年级">
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
              width="130">
              <template scope="scope">
                <el-button type="info" size="small" @click="performance(scope.row)">完成情况</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--查看弹窗-->
      <Modal
        :mask-closable="false"
        width="900"
        v-model="showModal"
        title="查看档案管理弹窗"
        class-name="vertical-center-modal">
        <modal-header slot="header" :content="performanceId"></modal-header>
        <trainingManual v-if="showModal && performanceType=='trainingManual'" :operailityData="rowData"></trainingManual>
        <workload v-if="showModal && performanceType=='workload'" :operailityData="rowData"></workload>
        <departmentExamination v-if="showModal && performanceType=='departmentExamination'" :operailityData="rowData"></departmentExamination>
        <regularAssessment v-if="showModal && performanceType=='regularAssessment'" :operailityData="rowData"></regularAssessment>
        <completion v-if="showModal && performanceType=='completion'" :operailityData="rowData"></completion>
        <attendanceSituation v-if="showModal && performanceType=='attendanceSituation'" :operailityData="rowData"></attendanceSituation>
        <departmentReport v-if="showModal && performanceType=='departmentReport'" :operailityData="rowData"></departmentReport>
        <manualWriting v-if="showModal && performanceType=='manualWriting'" :operailityData="rowData"></manualWriting>
        <teachingEvaluation v-if="showModal && performanceType=='teachingEvaluation'" :operailityData="rowData"></teachingEvaluation>
        <rewardsRecord v-if="showModal && performanceType=='rewardsRecord'" :operailityData="rowData"></rewardsRecord>
        <punishmentRecord v-if="showModal && performanceType=='punishmentRecord'" :operailityData="rowData"></punishmentRecord>
        <racingMiscellaneous v-if="showModal && performanceType=='racingMiscellaneous'" :operailityData="rowData"></racingMiscellaneous>
        <div slot="footer"></div>
      </Modal>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import tableData from './studentPerQuery_viewData.js';
    //培训手册完成情况
    import trainingManual from './studentPerQuery_differrentType/trainingManual.vue';
    //培训工作量
    import workload from './studentPerQuery_differrentType/workload.vue';
    //培训质量(出科考试)
    import departmentExamination from './studentPerQuery_differrentType/departmentExamination.vue';
    //培训质量(定期评价)
    import regularAssessment from './studentPerQuery_differrentType/regularAssessment.vue';
    //培训质量(结业考核)
    import completion from './studentPerQuery_differrentType/completion.vue';
    //日常管理(考勤情况)
    import attendanceSituation from './studentPerQuery_differrentType/attendanceSituation.vue';
    //日常管理(入科报道及时程度)
    import departmentReport from './studentPerQuery_differrentType/departmentReport.vue';
    //日常管理(手册书写完成)
    import manualWriting from './studentPerQuery_differrentType/manualWriting.vue';
    //日常管理(教学评价完成度)
    import teachingEvaluation from './studentPerQuery_differrentType/teachingEvaluation.vue';
    //日常管理(奖励记录)
    import rewardsRecord from './studentPerQuery_differrentType/rewardsRecord.vue';
    //日常管理(惩罚记录)
    import punishmentRecord from './studentPerQuery_differrentType/punishmentRecord.vue';
    //能力提升(各类竞赛)
    import racingMiscellaneous from './studentPerQuery_differrentType/racingMiscellaneous.vue';
    //当前组件引入全局的util
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
            this.rowData = row;
            this.performanceId.title = row.secondLevel;
            this.performanceType = row.type;
            this.showModal = true;
          },

        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
          trainingManual,
          workload,
          departmentExamination,
          regularAssessment,
          completion,
          attendanceSituation,
          departmentReport,
          manualWriting,
          teachingEvaluation,
          rewardsRecord,
          punishmentRecord,
          racingMiscellaneous,
        }
    }
</script>
