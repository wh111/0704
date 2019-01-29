<template>
  <!-- 单表分析 - 列表 -->
  <div ref="singleTableAnalysis">
    <!-- 搜索 -->
    <el-form :inline="true" ref="formValidate" :model="searchObj"  :rules="singleTableAnalysisList">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="searchObj.name" :maxlength="51"></el-input>
      </el-form-item >
      <el-form-item label="被评对象：">
        <el-select v-model="searchObj.evaluatedType" placeholder="请选择">
          <el-option v-for="item in evaluatedTypeOption" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="info" @click="search">搜索</el-button>
    </el-form>
    <!-- 表格 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%;">
        <el-table-column label="操作" width="100" align="center">
          <template scope="scope">
            <el-button size="small" type="warning" @click="showAnalysis(scope.row)">查看分析</el-button>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="评价时间" prop="evaluateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" prop="type" show-overflow-tooltip></el-table-column>
        <el-table-column label="评价对象" prop="evaluatedString" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.evaluatedString | synthesizeStatistics }}
          </template>
        </el-table-column>
        <el-table-column label="未评数量" prop="haventScore" show-overflow-tooltip></el-table-column>
        <el-table-column label="已评数量" prop="haveScore" show-overflow-tooltip></el-table-column>
        <el-table-column label="最高分" prop="maxScore" show-overflow-tooltip>
          <template scope="scope">{{((scope.row.maxScore||0)/100).toFixed(2) ||0}}</template>
        </el-table-column>
        <el-table-column label="最低分" prop="minScore" show-overflow-tooltip>
          <template scope="scope">{{((scope.row.minScore||0)/100).toFixed(2) ||0}}</template>
        </el-table-column>
        <el-table-column label="平均分" prop="averagScore" show-overflow-tooltip>
          <template scope="scope">{{((scope.row.averagScore||0)/100).toFixed(2) ||0}}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
        :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
  </div>
</template>

<script>
  let Util;
  import {singleTableAnalysisList} from '../../rules'
  import api from './api';
  import evaluatedTypeOption from '../synthesizeStatistics/objTypeOption';
  export default {
    data() {
      return {
        singleTableAnalysisList,
        evaluatedTypeOption,
        // 搜索
        searchObj: {
          name: '',
          evaluatedType: ''
        },
        /* 表格 */
        tableData: [],
        self: this,
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        multipleSelection: [], // 选项
        operailityData: [],
      }
    },
    methods: {
      /****************************** 初始化 *************************************/
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.setTableData()
      },
      /****************************** 表格相关 ***********************************/
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.singleTableAnalysis.parentNode.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
      },
      /****************************** 按钮事件 ***********************************/
      // 搜索
      search() {
        this.setTableData()
      },
      // 查看分析
      showAnalysis(row) {
        this.$emit('show', 'score', row)
      },
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
