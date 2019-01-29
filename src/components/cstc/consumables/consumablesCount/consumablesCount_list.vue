<template>
  <!-- 盘点记录 -->
  <div>
    <!-- 操作按钮 -->
    <div class="roomButtonList" ref="buttonList">
      <el-button size="small" type="primary" @click="add">新建盘点记录</el-button>
      <el-button size="small" type="danger" @click="remove">删除盘点记录</el-button>
    </div>
    <!-- 数据搜索 -->
    <el-form :inline="true" :model="searchObj" ref="searchForm" label-width="86px" class="el-form-item-search" style="margin-top:10px">
      <el-form-item label="耗材名称：">
        <el-input v-model="searchObj.consumablesName"></el-input>
      </el-form-item>
      <el-form-item label="盘点人：">
        <el-input v-model="searchObj.inventoryMan"></el-input>
      </el-form-item>
      <el-form-item label="盘点时间：">
        <date-group :dateGroup="{text:'',startDate:searchObj.inventoryStartTime,endDate:searchObj.inventoryEndTime}">
          <el-date-picker name="start" v-model="searchObj.inventoryStartTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0"
            @change="handleStartTime"></el-date-picker>
          <span>-</span>
          <el-date-picker name="end" v-model="searchObj.inventoryEndTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1"
            @change="handleEndTime"></el-date-picker>
        </date-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <div id="tableData" ref="tableData">
      <el-table align="center" :context="self" :data="tableData" tooltip-effect="dark" :height="dynamicHt" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="warning" @click="edit(scope.$index,scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="耗材名称" prop="consumablesName" show-overflow-tooltip></el-table-column>
        <el-table-column label="预期数量" prop="expectNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="实际数量" prop="actualNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="相差数量" prop="differenceNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="盘点时间" prop="inventoryTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="盘点人" prop="inventoryMan" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>

    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
        :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addCountModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.addCountId"></modal-header>
      <add v-if="addCountModal" @cancel="cancel" @addCount="subCallback"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :id="todoId" :url-params="api.modify"
        :get-url-params="api.get"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true"
      :width="800">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :id="todoId" :url-params="api.get"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading"
      :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;

  // api
  import api from './api';

  import add from './consumablesCount_add'; // 新建
  import edit from './consumablesCount_edit'; // 编辑
  import show from './consumablesCount_view'; // 查看

  export default {
    props: {
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860
      }
    },
    data() {
      return {
        api,
        // 搜索
        searchObj: {
          consumablesName: '', // 耗材名称
          inventoryMan: '', // 盘点人
          inventoryStartTime: '', // 开始时间
          inventoryEndTime: '', // 结束时间
        },
        multipleSelection: [], // 选项
        operailityData: '', // 操作的数据
        self: this,
        loading: false,
        addCountModal: false,
        dynamicHt: 100, // 表格高度
        // 操作id
        todoId: '',
        //* 按钮 *//
        button: {
          addCountId: {
            id: 'addCountId',
            title: '新增盘点记录'
          },
          showId: {
            id: 'showId',
            title: '查看盘点记录'
          },
          editId: {
            id: 'editId',
            title: '修改盘点记录'
          },
          removeId: {
            id: 'removeId',
            title: '删除盘点记录'
          }
        },
        // 表格数据
        totalCount: 0,
        tableData: []
      }
    },
    methods: {
      init: function () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: this.api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          }
        }

        this.setTableData()
      },

      //*----------- 表格 ------------*//
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
        let params = this.queryQptions.params;
        params.inventoryStartTime = this.conductDate(params.inventoryStartTime, 'yyyy-MM-dd') || '';
        params.inventoryEndTime = this.conductDate(params.inventoryEndTime, 'yyyy-MM-dd') || '';
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
        let tableData = this.$refs.tableData;
        let paginationHt = 50 + 46;
        this.dynamicHt = this.contenHeight - tableData.offsetTop - paginationHt;
      },
      // 归还
      borrow(index, row) {
        this.ajax({
          ajaxSuccess: 'listDataSuccess', // 需要更新时间
          ajaxParams: {
            url: this.api.modifyReturn.path,
            method: this.api.modifyReturn.method,
            params: {
              id: row.id
            }
          }
        })
      },
      /*----------- 模态框 -------------*/
      // 增加
      add() {
        this.openModel('addCount')
      },
      // 编辑
      edit(index, row) {
        this.todoId = row.id;
        this.openModel('edit');
      },
      // 查看
      show(row) {
        this.todoId = row.id;
        this.openModel('show');
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove() {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection; // 选项
          this.openModel('remove')
        }
      },
      // 搜索
      search() {
        this.setTableData();
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
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
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
      }
    },
    components: {
      add,
      edit,
      show
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
    watch: {
      contenHeight(val) {
        this.setTableDynHeight()
      }
    },
    created() {
      this.init()
    }
  }

</script>

<style>


</style>
