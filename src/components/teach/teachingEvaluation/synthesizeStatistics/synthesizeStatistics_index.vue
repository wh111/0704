<template>
  <!-- 综合分析统计 -->
  <div ref="synthesizeStatistics">
    <!-- 操作菜单及搜索 -->
    <el-row>
      <el-col :span="6">
        <el-button type="success" @click="add">添加策略</el-button>
        <el-button type="danger" @click="remove">删除策略</el-button>
      </el-col>
      <el-col :span="18" align="right">
        <el-form ref="formValidate" :model="searchObj"  :rules="singleTableAnalysisList"  :inline="true">
          <el-form-item label="策略名称：" prop="title">
            <el-input v-model="searchObj.title" :maxlength="51"></el-input>
          </el-form-item>
          <el-form-item label="分析对象：" prop="objType">
            <el-select v-model="searchObj.objType" placeholder="请选择">
              <el-option v-for="item in objTypeOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="search">查询</el-button>
          <!--<el-button type="info" @click="search">搜索</el-button>-->
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%;"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" width="230" align="center">
          <template scope="scope">
            <el-button size="small" type="success" @click="edit(scope.row)">修改</el-button>
            <el-button size="small" type="info" @click="show(scope.row)">详情</el-button>
            <el-button size="small" type="warning" @click="showAnalysis(scope.row)">查看分析</el-button>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="title" show-overflow-tooltip></el-table-column>
        <el-table-column label="包含评分表" prop="activityCount" show-overflow-tooltip></el-table-column>
        <el-table-column label="分析对象" prop="objType" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.objType | synthesizeStatistics }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="createTimeString" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
        :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="900" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="900" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（show） -->
    <Modal :mask-closable="false" v-model="showModal" height="900" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal :mask-closable="false" height="200" v-model="removeModal" class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="contentHeader.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>

  let Util;
  import {singleTableAnalysisList} from '../../rules'
  import api from './api';
  import objTypeOption from './objTypeOption'; // 分析对象选择对象
  import add from './synthesizeStatistics_add'; // 增加
  import edit from './synthesizeStatistics_edit'; // 编辑
  import show from './synthesizeStatistics_view'; // 查看
  export default {
    data() {
      return {
        singleTableAnalysisList,
        api,
        objTypeOption,
        /* 搜索 */
        searchObj: {
          title: '', // 策略名称
          objType: '', // 分析对象
        },
        /* 表格 */
        tableData: [],
        self: this,
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        multipleSelection: [], // 选项
        operailityData: [],
        roomUsageTableData: [], // 表格数据
        /* 弹窗标题 */
        contentHeader: {
          addId: {
            id: 'addId',
            title: '新建分析策略'
          },
          showId: {
            id: 'showId',
            title: '查看分析策略'
          },
          editId: {
            id: 'editId',
            title: '修改分析策略'
          },
          removeId: {
            id: 'removeId',
            title: '删除分析策略'
          }
        },
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
        let contenHeight = this.$refs.synthesizeStatistics.parentNode.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
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
      /****************************** 按钮事件 ***********************************/
      // 增加
      add() {
        this.openModel('add')
      },
      // 删除
      remove() {
        if (!this.multipleSelection.length) {
          this.errorMess('请选择需要删除的分析策略')
          return
        }
        this.operailityData = this.multipleSelection;
        this.openModel('remove')
      },
      // 搜索
      search() {
        this.setTableData()
      },
      // 修改
      edit(row) {
        this.operailityData = row;
        this.openModel('edit')
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      // 查看分析
      showAnalysis(row) {
        this.$emit('show', 'score', row)
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
      // 增加回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
    },
    components: {
      add,
      edit,
      show
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
  /* 综合分析统计 */

</style>
