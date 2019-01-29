<template>
  <!-- 单表分析 - 分数 -->
  <div ref="analysisScore">
    <el-row>
      <el-col :span="4" align="left">
        <el-button type="info" @click="backList">返回</el-button>
      </el-col>
      <el-col :span="16" align="center" style="line-height:36px;">
        <h2>{{ scoreData.name }}</h2>
      </el-col>
      <el-col :span="4" align="right">
        <!--<el-button type="success">导出Excel</el-button>-->
      </el-col>
      <el-col align="right" style="margin-top:20px;">
        <el-form :inline="true" ref="formValidate" :model="searchObj"  :rules="singleTableAnalysisList">
          <el-form-item label="姓名：" prop="evaluatedName">
            <el-input v-model="searchObj.evaluatedName"></el-input>
          </el-form-item>
          <el-form-item label="时间范围：">
            <date-group :dateGroup="{text:'',startDate:searchObj.beginTimeS,endDate:searchObj.endTimeS}">
              <el-date-picker name="start" v-model="searchObj.beginTimeS" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0"
                @change="handleStartTime"></el-date-picker>
              <span>-</span>
              <el-date-picker name="end" v-model="searchObj.endTimeS" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1"
                @change="handleEndTime"></el-date-picker>
            </date-group>
          </el-form-item>
          <el-button type="info" @click="search">搜索</el-button>
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%;">
        <el-table-column label="操作" width="160" align="center">
          <template scope="scope">
            <el-button size="small" type="warning" @click="showReport(scope.row)">分析报告</el-button>
          </template>
        </el-table-column>
        <el-table-column label="被评对象" prop="evaluatedName" show-overflow-tooltip></el-table-column>
        <el-table-column label="综合得分" prop="averagScore" show-overflow-tooltip>
          <template scope="scope">{{((scope.row.averagScore||0)/100).toFixed(2) ||0}}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 查看报告 -->
    <Modal :mask-closable="false" v-model="reportModal" height="900" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.reportId"></modal-header>
      <report v-if="reportModal" @cancel="cancel" :operaility-data="operailityData"></report>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util;
  import {singleTableAnalysisList} from '../../../rules'
  import api from '../api';
  import report from './analysis_report';
  export default {
    props: ['scoreData'],
    data() {
      return {
        singleTableAnalysisList,
        self: this,
        dynamicHt: 0,
        reportModal: false,
        searchObj: {
          evaluatedName: '',
          beginTimeS: '',
          endTimeS: '',
        },
        tableData: [],
        operailityData: {},
        contentHeader: {
          reportId: {
            id: 'reportId',
            title: '查看分析报告'
          }
        }
      }
    },
    methods: {
      init() {
        Util = this.$util;
        this.setTableData()
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        let opt = {
          ajaxSuccess: res => this.tableData = res.data,
          ajaxParams: {
            url: api.analysiTableDetail.path + this.scoreData.id,
            method: api.analysiTableDetail.method,
            params: {
              // activityId: this.scoreData.id,
              evaluatedName: this.searchObj.evaluatedName,
              beginTimeS: this.conductDate(this.searchObj.beginTimeS, 'yyyy-MM-dd'),
              endTimeS: this.conductDate(this.searchObj.endTimeS, 'yyyy-MM-dd'),
            }
          }
        };
        this.ajax(opt, isLoading)
      },
      // 分析报告
      showReport(row) {
        this.operailityData = row;
        this.operailityData.activityId = this.scoreData.id;
        this.openModel('report')
      },
      // 返回
      backList() {
        this.$emit('show', 'index')
      },
      // 搜索
      search() {
        this.setTableData()
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.analysisScore.parentNode.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        this.dynamicHt = contenHeight - tableView.offsetTop;
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
    components: {
      report,
    },
    created() {
      this.init()
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
  }

</script>

<style>
  /* 单表分析 */

</style>
