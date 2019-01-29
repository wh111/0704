<template>
  <!-- 门禁卡管理 -->
  <div ref="accessControlManage">
    <layout-tree :style="{'height':contenHeight + 'px'}">
      <left-tree slot="left" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
      <div slot="right" id="content" ref="content">
        <el-row style="padding-bottom:20px;">
          <!-- 搜索框 -->
          <el-col align="right">
            <el-input placeholder="姓名" v-model="searchObj.userName" style="width:300px;" :maxlength="20">
              <el-button slot="append" icon="search" @click="search"></el-button>
            </el-input>
            <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
          </el-col>
        </el-row>
        <!-- 多条件 -->
        <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
          <el-form :inline="true">
            <el-form-item label="卡号:">
              <el-input v-model="searchObj.cardNum"></el-input>
            </el-form-item>
            <el-form-item label="申请时间:">
              <date-group :dateGroup="{text:'',startDate:searchObj.createTimeBegin,endDate:searchObj.createTimeEnd}">
                <el-date-picker name="start" v-model="searchObj.createTimeBegin" :editable="false" type="datetime" placeholder="选择开始时间" :picker-options="pickerOptions0"
                  @change="handleStartTime"></el-date-picker>
                <span>-</span>
                <el-date-picker name="end" v-model="searchObj.createTimeEnd" :editable="false" type="datetime" placeholder="选择结束时间" :picker-options="pickerOptions1"
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
          <el-table align="center" :context="self" :height="tableHeight" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="序号" prop="index" width="80"></el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template scope="scope">
                <el-button size="small" type="primary" @click="edit(scope.row)" v-if="scope.row.id">修改卡号</el-button>
                <el-button size="small" type="success" @click="add(scope.row)" v-else>设置卡号</el-button>
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="userName" align="center"></el-table-column>
            <el-table-column label="卡号" prop="cardNum" show-overflow-tooltip>
              <template scope="scope">
                {{ scope.row.cardNum || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="授卡时间" prop="createTime" show-overflow-tooltip>
              <template scope="scope">
                <template v-if="scope.row.createTime">
                  {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm') }}
                </template>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="授卡人" prop="createrName" show-overflow-tooltip>
              <template scope="scope">
                {{ scope.row.createrName || '-' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页按钮 -->
        <div style="float: right;margin-top:10px;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
        </div>
      </div>
    </layout-tree>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="600">
      <modal-header slot="header" :content="contentHeader.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="600">
      <modal-header slot="header" :content="contentHeader.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;
  import api from './api';
  import add from './manage_add';
  import edit from './manage_edit';
  export default {
    data() {
      return {
        contenHeight: 0,
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: "/dept/tree",
          getDataUrl: '',
          isShowMenus: false,
        },
        fromWhereTree: "user",

        totalCount: 0,
        self: this,
        dynamicHt: 0,
        tableHeight: 0,
        loading: false,
        reportModal: false,
        showMoreSearch: false, // 更多筛选
        operailityData: [],
        searchObj: { // 搜索
          depId: '', // 部门id
          userName: '', // 人员姓名
          cardNum: '', // 卡号
          createTimeBegin: '', // 授权时间开始时间
          createTimeEnd: '', // 授权时间结束时间
        },
        tableData: [],
        // 模态框提示
        contentHeader: {
          addId: {
            id: 'addId',
            title: '设置门禁卡'
          },
          editId: {
            id: 'editId',
            title: '修改门禁卡'
          },
        }
      }
    },
    components: {
      add,
      edit
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

        // this.setTableData()
      },
      /********************************* 目录树 **********************************/
      /*
       * 左侧目录树节点click调用父组件方法
       * @param obj {} 当前选中节点的一级数据
       * @param node  {}  整个tree节点所有数据
       * @param  self  {}  当前tree vue实例
       *
       * */
      treeClick(obj, node, self) {
        this.setTreeDepId(obj.id);
      },
      /*
       * 设置当前部门Id
       * */
      setTreeDepId(id) {
        if (id) {
          this.searchObj.depId = id;
          this.setTableData();
        }
      },
      // 获取内容部分高度
      getContentHeight() {
        this.contenHeight = this.$refs.accessControlManage.parentNode.parentNode.offsetHeight;
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
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData() {
        Object.assign(this.queryQptions.params, this.searchObj);
        let params = this.queryQptions.params;
        params.createTimeBegin = this.conductDate(params.createTimeBegin, 'yyyy-MM-dd hh:mm:ss');
        params.createTimeEnd = this.conductDate(params.createTimeEnd, 'yyyy-MM-dd hh:mm:ss');

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
      //设置表格及分页的位置
      setTableDynHeight() {
        let tableView = this.$refs.tableView;
        let paginationHt = 40;
        this.dynamicHt = this.contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
      },
      /************************************** 按钮相关 **************************************************/
      // 设置卡号
      add(row) {
        this.operailityData = row;
        this.openModel('add')
      },
      // 修改卡号
      edit(row) {
        this.operailityData = row;
        this.openModel('edit')
      },
      /************************************** 模态框处理 **************************************************/
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },

      // 回调
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
    created() {
      this.init()
    },
  }

</script>

<style>
  /* 门禁卡管理 */

</style>
