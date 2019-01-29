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
            <el-col :span="12">身份：{{ viewData.identity | userRoluName}}</el-col>
            <el-col :span="12">当前培训科室：{{ viewData.depName }}</el-col>
            <el-col v-if="strategyData" v-show="strategyData.viewContent&&strategyData.viewContent.indexOf('培训专业')>-1">培养专业：{{ viewData.specialty }}</el-col>
            <el-col v-if="strategyData" v-show="strategyData.viewContent&&strategyData.viewContent.indexOf('年度')>-1">开始培训时间：{{ viewData.depBeginTime }}</el-col>
            <el-col v-if="strategyData" v-show="strategyData.viewContent&&strategyData.viewContent.indexOf('培训年限')>-1">培训时间：{{ viewData.ts }}年</el-col>
          </el-col>
          <el-col :span="6" align="right">
            <!--<img src="../../../../../assets/ambuf/images/physician.png" class="physicianPic" @click="show">-->
            <img src="../../../../../assets/ambuf/images/physician.png" class="physicianPic">
          </el-col>
        </fieldset>
        <!-- 评价概述 -->
        <fieldset>
          <legend>&nbsp;&nbsp;评价概述&nbsp;&nbsp;</legend>
          <h4>
            <span>最高分：{{ viewData.thisScore }}</span>
            <!--<span>排名：1</span>-->
          </h4>
          <el-table align="center" :max-height="dynamicHt" :context="self" :data="viewData.strategyResourceDtoList" tooltip-effect="dark">
            <el-table-column label="评分表" prop="activityName" show-overflow-tooltip align="center">
              <template scope="scope">
                {{ scope.row.activityName }}
              </template>
            </el-table-column>
            <el-table-column label="得分" prop="oneScore" show-overflow-tooltip align="center">
              <template scope="scope">
                {{((scope.row.oneScore||0)/100).toFixed(2) ||0}}
              </template>
            </el-table-column>
            <el-table-column label="权重" prop="weight" show-overflow-tooltip align="center"></el-table-column>
          </el-table>
        </fieldset>
        <!-- 循环 -->
        <fieldset v-for="(item,index) in viewData.evaluateStrategyScroeDtoList" :key="index">
          <legend>&nbsp;&nbsp;{{ item.activityName }}&nbsp;&nbsp;</legend>
          <h4>
            <span>最高分：{{((item.maxScore||0)/100).toFixed(2) ||0}}</span>
            <span>最低分：{{((item.minScore||0)/100).toFixed(2) ||0}}</span>
            <span>平均分：{{((item.averageScore||0)/100).toFixed(2) ||0}}</span>
          </h4>
          <p class="scoreNumText">评分人数：{{ item.haveScore }}</p>
          <p class="scoreNumText">未评人数：{{ item.notScore }}</p>
          <el-table align="center" :max-height="dynamicHt" :context="self" :data="item.appraiserEvaluatedDtoList" tooltip-effect="dark">
            <el-table-column label="评分人" prop="appraiserName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="评价对象" prop="evaluatedName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="分数" prop="totalScore" show-overflow-tooltip align="center">
              <template scope="scope">
                {{((scope.row.totalScore||0)/100).toFixed(2) ||0}}
              </template>
            </el-table-column>
            <el-table-column label="时间" prop="updateTimeString" show-overflow-tooltip align="center"></el-table-column>
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
  </div>
</template>

<script>
  import api from '../api';
  import show from './analysis_show';
  export default {
    props: ['operailityData','strategyData'],
    data() {
      return {
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
          "strategyResourceDtoList": [],
          "evaluateStrategyScroeDtoList": []
        },
        contentHeader: {
          showId: {
            id: 'showId',
            title: '查看'
          }
        }
      }
    },
    methods: {
      // 根据分析对象获取对应的评分表
      getViewData() {
        this.ajax({
          ajaxSuccess: res => res.data && (this.viewData = res.data),
          ajaxParams: {
            url: api.strategyTableReport.path,
            method: api.strategyTableReport.method,
            params: {
              strategyId: this.operailityData.strategyId,
              evaluatedId: this.operailityData.evaluatedId
            }
          }
        })
      },
      // 查看（点击医生图片）
      show() {
        this.openModel('show')
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

    },
    created() {
      this.getViewData()
    },
    components: {
      show
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
