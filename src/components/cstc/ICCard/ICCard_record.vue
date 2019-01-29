<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div ref="ICCardRecord">
    <el-row>
      <el-col :span="6">
        <el-button @click="exportExcel">{{ 'export' | sysLan}}</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="18" align="right">
        <el-form :inline="true">
          <el-form-item label="姓名:">
            <el-input placeholder="请输入姓名" v-model="searchObj.userName" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="卡号:">
            <el-input placeholder="请输入卡号" v-model="searchObj.cardNum" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="房间号:">
            <el-select v-model="searchObj.roomId" clearable placeholder="请选择房间">
              <el-option v-for="(item,index) in roomData" :key="index" :value="item.id" :label="item.roomName+'（'+item.roomNum+'）'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <!--<el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">筛选</el-button>-->
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo" style="width: 100%;">
        <el-table-column label="序号" type="index" width="80" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="房间号" prop="roomNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="考生姓名" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="刷卡时间" prop="recordTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="卡号" prop="cardNum" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
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
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        totalCount: 0,
        self: this,
        tableHeight: 0,
        loading: false,
        searchObj: { // 搜索
          userName: '', // 人员姓名
          roomId:"",
          cardNum:""
        },
        tableData: [],
        roomData:[],
        deriveModal: false, // 导出
        deriveId: {id: 'deriveId', title: '导出'},
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.recordList.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.getRoomData();
        this.setTableData();
      },

      getRoomData(){
        let opt = {
          ajaxSuccess: res=>this.roomData=res.data,
          ajaxParams:{
            url:api.roomList
          }
        };
        this.ajax(opt)
      },

      search() {
        this.setTableData();
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData() {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        })
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = this.addIndex(res.data);
      },
      // 获取内容部分高度
      getContentHeight() {
        this.contenHeight = this.$refs.ICCardRecord.parentNode.parentNode.offsetHeight;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let tableView = this.$refs.tableView;
        let paginationHt = 50;
        this.dynamicHt = this.contenHeight - tableView.offsetTop - paginationHt;
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
    created() {
      this.init();
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContentHeight();
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, "resize", this.getContentHeight);
      })
    },
    components: {}
  }

</script>
