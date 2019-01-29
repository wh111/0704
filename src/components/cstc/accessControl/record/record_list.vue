<template>
  <!-- 刷卡记录 -->
  <div ref="content">
    <el-row style="padding-bottom:20px;">
      <!-- 搜索框 -->
      <!--<el-col :span="10">
        <el-button @click="exportExcel">{{ 'export' | sysLan}}</el-button>
      </el-col>-->
      <el-col :span="24" align="right">
        <el-input placeholder="刷卡人姓名" v-model="searchObj.userName" style="width:300px;" :maxlength="20">
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-input>
        <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
      <el-form :inline="true">
        <el-form-item label="卡号:">
          <el-input v-model="searchObj.iccardNum"></el-input>
        </el-form-item>
        <el-form-item label="刷卡时间:">
          <date-group :dateGroup="{text:'',startDate:searchObj.swingStartTime,endDate:searchObj.swingEndTime}">
            <el-date-picker name="start" v-model="searchObj.swingStartTime" :editable="false" type="datetime"
                            placeholder="选择开始时间" :picker-options="pickerOptions0"
                            @change="handleStartTime"></el-date-picker>
            <span>-</span>
            <el-date-picker name="end" v-model="searchObj.swingEndTime" :editable="false" type="datetime"
                            placeholder="选择结束时间" :picker-options="pickerOptions1"
                            @change="handleEndTime"></el-date-picker>
          </date-group>
        </el-form-item>
        <el-form-item style="margin-right:0;">
          <el-button @click="search" type="info">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <div ref="tableView">
      <el-table align="center" :context="self" :height="tableHeight" :data="tableData" tooltip-effect="dark"
                style="width: 100%">
        <el-table-column label="刷卡人姓名" prop="userName" align="center"></el-table-column>
        <el-table-column label="卡号" prop="iccardNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备所在位置" prop="location" show-overflow-tooltip></el-table-column>
        <el-table-column label="刷卡时间" prop="swingTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="刷卡人所在部门" prop="depName" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount"></el-pagination>
    </div>
    <!--导出-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="值班费标题"
           class-name="duty-fee-modal"
           :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <derive v-if="deriveModal" type="derive" messTitle="确定要导出吗？" :url="exportExcelUrl"
              @cancel="deriveModal = false"></derive>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null
  import api from './api';

  export default {
    data() {
      return {
        exportExcelUrl: '',
        totalCount: 0,
        self: this,
        dynamicHt: 0,
        tableHeight: 0,
        loading: false,
        showMoreSearch: false, // 更多筛选
        deriveModal: false, // 导出
        searchObj: { // 搜索
          userName: '', // 人员姓名
          iccardNum: '', // 卡号
          swingStartTime: '', // 开始时间
          swingEndTime: '', // 结束时间
        },
        tableData: [],
        deriveId: {id: 'deriveId', title: '导出'},
      }
    },
    methods: {
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

      /************************* 搜索逻辑 *********************************/
      search() {
        this.setTableData();
      },
      // 获取筛选按钮图标
      getSearchBtnIcon() {
        return this.showMoreSearch ? 'arrow-up' : 'arrow-down'
      },
      // 显示更多筛选
      openMoreSearch() {
        this.showMoreSearch = !this.showMoreSearch;
        this.$nextTick(() => {
          if (this.showMoreSearch) {
            this.tableHeight = this.dynamicHt - this.$refs.showMoreSearch.offsetHeight;
          } else {
            this.tableHeight = this.dynamicHt;
          }
        })
      },
      /************************* 表格逻辑 *********************************/
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData() {
        Object.assign(this.queryQptions.params, this.searchObj);
        let params = this.queryQptions.params;
        params.swingStartTime = this.conductDate(params.swingStartTime, 'yyyy-MM-dd hh:mm:ss');
        params.swingEndTime = this.conductDate(params.swingEndTime, 'yyyy-MM-dd hh:mm:ss');

        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        })
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.content.parentNode.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 40;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
      },

      /*
      * 点击--导出--按钮
      * */
      exportExcel () {
        let params = this.formDate(this.$util._.defaultsDeep({}, this.searchObj), ['courseBeginTime', 'courseEndTime'], 'yyyy-MM-dd hh:mm:ss')
        this.exportExcelUrl = '/api' + api.exportExcel.path + '?' + this.$util.serializeParams(params)
        this.deriveModal = true
      },
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    created() {
      this.init()
    },
  }

</script>

<style>
  /* 刷卡记录 */

</style>
