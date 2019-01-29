<!--
****--@file     myAllowance_list
****--@date     2017/12/13 18:31
****--@author   YC
****--@describe 我的津贴
-->
<template>
  <div ref="content">
    <el-form :inline="true">
      <el-row>
        <el-col align="right">
          <el-form-item label="科室：">
            <el-select v-model="searchObj.depId" placeholder="请选择" clearable>
              <select-option type="byUserType"></select-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发放年月：">
            <el-date-picker v-model="searchObj.provideMonth" type="month" placeholder="选择月" :editable="false"
                            clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select placeholder="请选择" v-model="searchObj.provideStatus" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="正常发放" value="zc"></el-option>
              <el-option label="不发放" value="bff"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData"
                tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userSchool" label="学校" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userMajor" label="专业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="depName" label="科室" show-overflow-tooltip></el-table-column>
        <el-table-column prop="provideMonth" label="发放月份" show-overflow-tooltip></el-table-column>
        <el-table-column prop="provideAmount" label="应发金额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="provideStatus" label="类型" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.provideStatus | typeText }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="headerContent.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  import show from '../allowance/allowance_view'
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        searchMore: false,
        searchObj: {
          provideMonth: '', // 发放年月
          depId: '', // 科室
          provideStatus: '',
          userId: '', // 当前用户
        },
        hospital: [],
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        loading: false,
        operailityData: [],
        multipleSelection: [],
        tableData: [],
        totalCount: 0,
        headerContent: {
          showId: {
            id: 'show',
            title: '查看津贴详情'
          },
        }
      }
    },
    methods: {
      //初始化请求列表数据
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
        this.searchObj.userId = this.$store.getters.getUserInfo.id;
        this.setTableData();
      },
      /********************************* 按钮事件 *****************************/
      // 搜索
      search() {
        this.setTableData()
      },
      // 筛选
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          if (this.searchMore) {
            this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight;
          } else {
            this.tabHeight = this.dynamicHt
          }
        })
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      /********************************* 表格相关 *****************************/
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
        let params = this.queryQptions.params;
        params.provideMonth = this.conductDate(params.provideMonth, 'yyyy-MM');
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.content.parentNode.offsetHeight;
        let tableData = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
        this.tabHeight = this.dynamicHt;
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess("请选择数据!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      // 弹窗回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
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
      this.init();
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
    components: {
      show
    }
  }

</script>
