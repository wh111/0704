<template>
  <!-- 分析报告 - 住院医师综合统计表 -->
  <div class="analysisScore">
    <el-form>
      <el-row>
        <el-col align="center" style="line-height:30px;">
          <h3>综合统计表</h3>
        </el-col>
        <!--<el-col :span="4" align="right">
        <el-button size="small" type="info">导出统计表</el-button>
      </el-col>-->
        <fieldset class="analysisScoreInfo">
          <legend>&nbsp;&nbsp;基本信息&nbsp;&nbsp;</legend>
          <el-col :span="18" class="infoText">
            <el-col>评价主体：{{ viewData.name }}</el-col>
            <el-col :span="12">身份：{{ viewData.identity |userRoluName }}</el-col>
            <el-col :span="12">当前培训科室：{{ viewData.depName }}</el-col>
            <el-col>培养专业：{{ viewData.specialty }}</el-col>
            <el-col>开始培训时间：{{ viewData.depBeginTime }}</el-col>
            <el-col>培训时间：{{ viewData.ts }}年</el-col>
          </el-col>
          <el-col :span="6" align="right">
            <!--<img src="../../../../../assets/ambuf/images/physician.png" class="physicianPic" @click="show">-->
            <img src="../../../../../assets/ambuf/images/physician.png" class="physicianPic">
          </el-col>
        </fieldset>
        <!-- 评价概述 -->
        <fieldset>
          <legend>&nbsp;&nbsp;{{ viewData.activityName }}&nbsp;&nbsp;</legend>
          <h4>
            <span>最高分： {{((viewData.maxScore||0)/100).toFixed(2) ||0}}</span>
            <span>最低分：{{((viewData.minScore||0)/100).toFixed(2) ||0}}</span>
            <span>平均分：{{((viewData.averageScore||0)/100).toFixed(2) ||0}}</span>
          </h4>
          <p class="scoreNumText">评分人数：{{ viewData.haveScore }}</p>
          <p class="scoreNumText">未评人数：{{ viewData.notScore }}</p>
          <el-table align="center" :max-height="dynamicHt" :context="self" :data="viewData.appraiserEvaluatedDtoList" tooltip-effect="dark">
            <el-table-column label="评分人" prop="appraiserName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="评价对象" prop="evaluatedName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="分数" prop="totalScore" show-overflow-tooltip align="center">
              <template scope="scope">{{((scope.row.totalScore||0)/100).toFixed(2) ||0}}</template>
            </el-table-column>
            <el-table-column label="时间" prop="updateTimeString" show-overflow-tooltip align="center"></el-table-column>

            <el-table-column label="操作" prop="updateTimeString"
                             show-overflow-tooltip align="center">
              <template scope="scope">
                <el-button type="success" size="small"
                           @click="showEvaluationTable(scope.row)">查看
                </el-button>
                <el-button type="success" size="small"
                           @click="importEvaluationTable(scope.row)">导出
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </el-row>
    </el-form>
    <!-- 模态框 查看（show） -->
    <Modal :mask-closable="false" v-model="showModal" height="900" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看评价表 -->
    <!--<Modal :mask-closable="false" v-model="tableModal" height="900" class-name="vertical-center-modal" :width="900">-->
    <!--<modal-header slot="header" :content="contentHeader.EvaluationTableId"></modal-header>-->
    <!--<evaluation-table v-if="tableModal" @cancel="cancel" :operaility-data="operailityData"></evaluation-table>-->
    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="addModal"
      title="新建教学活动"
      class-name="vertical-center-modal"
    >
      <modal-header slot="header" :content="contentHeader.EvaluationTableId"></modal-header>
      <add v-if="addModal" :type="type" @cancel="cancel" :url="url"
           @add="subCallback" :activityId="operailityAdd.activityId"
           :operailityData="operailityAdd"></add>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="deriveModal"
      title="对话框标题"
      :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <derive v-if="deriveModal" type="derive" messTitle="确定要导出到excel吗？"
              :url="deriveUrl"
              @cancel="cancel"></derive>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from '../api';
  import show from './analysis_show';
  import add from '../../../teachingEvaluation/myEvaluation/myEvaluation_add'
  export default {
    props: ['operailityData'],
    data() {
      return {
        deriveUrl: '',
        url: api,
        self: this,
        dynamicHt: 220,
        viewData: {
          "name": "-",
          "identity": "-",
          "depName": "-",
          "specialty": "-",
          "depBeginTime": "-",
          "ts": "-",
          "thisScore": 0,
          "activityName": "-",
          "maxScore": 0,
          "minScore": 0,
          "averageScore": 0,
          "haveScore": 0,
          "notScore": 0,
          "appraiserEvaluatedDtoList": []
        },
        operailityAdd: '',
        contentHeader: {
          showId: {
            id: 'showId',
            title: '查看'
          },
          EvaluationTableId:{
            id:'EvaluationTableId',
            title:'评价表'
          }
        },
        type: '',
        tableModal: false,
        deriveModal: false,
        deriveId: {
          id: 'deriveId',
          title: '导出',
        },
      }
    },
    methods: {
      // 根据分析对象获取对应的评分表
      getViewData() {
        this.ajax({
          ajaxSuccess: res => res.data && (this.viewData = res.data),
          ajaxParams: {
            url: api.analysiTableReport.path,
            method: api.analysiTableReport.method,
            params: {
              activityId: this.operailityData.activityId,
              evaluatedId: this.operailityData.evaluatedId
            }
          }
        })
      },
      // 查看（点击医生图片）
      show() {
        this.openModel('show')
      },
      //查看评价表
      showEvaluationTable (data) {
        data.userId = data.evaluatedId;
        this.operailityAdd = data;
        this.openModel('add')
      },
      //导出分析表
      importEvaluationTable (data) {
        this.deriveUrl = '/api/appraiserEvaluated/excel/get?activityId=' +
          data.activityId + '&evaluatedId=' + data.evaluatedId +
          '&appraiserEvaluatedId=' + data.id + '&appraiserId=' +
          data.appraiserId
        this.openModel('derive')
      },
      /****************************** 模态框 *************************************/
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.init();
        }
      },
      identity(type){
        let obj={
          'SXS': '实习生',
          'YJS': '研究生',
          'JXS': '进修生',
          'ZYY': '住院医',

        }
        return obj[type]

      },
    },
    created() {
      this.getViewData()
    },
    components: {
      show,
      add,
    }
  }

</script>

<style lang="scss">
  /* 分析报告 - 住院医师综合统计表 */

  .analysisScore {
    fieldset {
      &~fieldset {
        margin-top: 20px;
      }
      h4 {
        margin-bottom: 16px;
        span {
          margin-right: 20px;
        }
      }
    }
    legend {
      font-size: 16px;
    }
    .el-table {
      max-width: 848px;
    }
    .scoreNumText {
      font-size: 14px;
      margin-bottom: 16px;
    }
  }

  .analysisScoreInfo {
    .infoText .el-col {
      margin-bottom: 10px;
    }
    .physicianPic {
      height: 140px;
      cursor: pointer;
    }
  }

</style>
