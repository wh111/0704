<template>
  <!-- 门禁设备管理 -->
  <div ref="content">
    <el-row style="padding-bottom:20px;">
      <el-col :span="10">
        <el-button type="warning" @click="back">返回</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="14" align="right">
        <el-input placeholder="人员名称" v-model="searchObj.userName" style="width:300px;" :maxlength="20">
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-input>
        <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
      <el-form :inline="true">
        <el-form-item label="人员名称：">
          <el-input v-model="searchObj.userName"></el-input>
        </el-form-item>
        <el-form-item label="部门：">
          <el-input v-model="searchObj.depName" @focus="selectTree" icon="close" :on-icon-click="clearInput"></el-input>
        </el-form-item>
        <el-form-item style="margin-right:0;">
          <el-button @click="search" type="info">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <div ref="tableView">
      <el-table align="center" :context="self" :height="tableHeight" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="操作" align="center" width="210">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="info" @click="edit(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="人员姓名" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="卡号" prop="cardNumber" show-overflow-tooltip></el-table-column>
        <el-table-column label="部门" prop="depName" show-overflow-tooltip></el-table-column>
        <el-table-column label="授权期限" prop="startDate" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.startDate + '至' + scope.row.endDate }}
          </template>
        </el-table-column>
        <el-table-column label="授权人" prop="createrName" show-overflow-tooltip></el-table-column>
        <el-table-column label="授权时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="jurisdictionStatus" show-overflow-tooltip>
          <!-- <template scope="scope">
            {{ scope.row.jurisdictionStatus | jurisdictionStatus }}
          </template> -->
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
        :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <select-tree :getTreeUrl="api.depList.path" @selectTree="selectTreeCall" ref="selectTree"></select-tree>

    <!-- 模态框 查看（show） -->
    <Modal :mask-closable="false" v-model="showModal" class-name="vertical-center-modal" :width="700">
      <modal-header slot="header" :content="headerContent.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" class-name="vertical-center-modal" :width="700">
      <modal-header slot="header" :content="headerContent.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal :mask-closable="false" v-model="removeModal" class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="headerContent.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;
  import api from './api';
  import selectTree from '../../../common/selectTree';
  import edit from './jurisdiction_userEdit';
  import show from './jurisdiction_userView';
  export default {
    props: ['id'],
    data() {
      return {
        api,
        totalCount: 0,
        self: this,
        dynamicHt: 0,
        tableHeight: 0,
        loading: false,
        showMoreSearch: false, // 更多筛选
        searchObj: { // 搜索
          userName: '', // 人员名称
          depId: '', // 部门
          depName: '', // 部门名称
        },
        tableData: [],
        multipleSelection: [],
        operailityData: [],
        depList: [],
        headerContent: {
          showId: {
            id: "showId",
            title: "查看门禁权限"
          },
          editId: {
            id: "editId",
            title: "编辑门禁权限"
          },
          removeId: {
            id: "removeId",
            title: "删除门禁权限"
          },
        }
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
            pageSize: Util.pageInitPrams.pageSize,
            accessDoorId: this.id
          }
        }

        this.getSelectDep();
        this.setTableData();
      },
      // 获取选择房间
      getSelectDep() {
        this.ajax({
          ajaxSuccess: res => this.roomList = res.data,
          ajaxParams: {
            url: api.depList.path
          }
        })
      },
      /************************* 按钮事件 *********************************/
      // 返回
      back() {
        this.$emit('show', 'device')
      },
      // 添加
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      // 修改
      edit(row) {
        this.operailityData = row;
        this.openModel('edit')
      },
      // 删除
      remove(row) {
        this.operailityData = [row];
        this.openModel('remove')
      },
      // 选择部门
      selectTree() {
        this.$refs.selectTree.openModal()
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
        let contenHeight = this.$refs.content.parentNode.parentNode.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 40;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
      },
      /************************* 弹窗相关 *********************************/
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
      /*
       * 列表数据选择
       */
      isSelected() {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess("请选择需要删除的门禁设备!");
          flag = false;
        }
        return flag;
      },
      // 选择树
      selectTreeCall(depId, depName) {
        this.searchObj.depId = depId;
        this.searchObj.depName = depName;
      },
      // 清除输入
      clearInput() {
        this.searchObj.depId = '';
        this.searchObj.depName = '';
      },
    },
    components: {
      show,
      edit,
      selectTree
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
  /* 门禁设备管理 */

</style>
