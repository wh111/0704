<!--房间管理-->
<template>
  <div id="roomManage" ref="roomManage">
    <!-- 操作按钮 -->
    <div class="roomButtonList" ref="roomButtonList">
      <el-button size="small" type="primary" @click="add">新建房间</el-button>
      <el-button size="small" type="danger" @click="remove">删除房间</el-button>
    </div>
    <!-- 数据表格 -->
    <div id="tableData" ref="tableData">
      <el-table align="center" :height="dynamicHt" :context="self" :data="roomManageTableData" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="warning" @click="edit(scope.$index,scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="房间号" prop="roomNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="房间名称" prop="roomName" show-overflow-tooltip></el-table-column>
        <el-table-column label="房间所在位置" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="所在楼层" prop="floor" show-overflow-tooltip></el-table-column>
        <el-table-column label="智能设备数量" prop="deviceNum" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.deviceNum || 0 }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
        :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :url-params="api.add"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :id="todoId"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true"
      :width="800">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :id="todoId"></show>
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
  //当前组件引入全局的util
  let Util = null;
  let store = null;

  import api from './api.js'; // api

  // 模态框
  import add from './roomManage_add'; // 增加
  import edit from './roomManage_edit'; // 编辑
  import show from './roomManage_view'; // 查看

  export default {
    props: {
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860
      },
    },
    data() {
      return {
        //* API URL *//
        api,
        //* 表格 *//
        self: this,
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        multipleSelection: '', // 选项
        roomManageTableData: [], // 表格数据
        //* 按钮 *//
        button: {
          addId: {
            id: 'addId',
            title: '增加房间'
          },
          showId: {
            id: 'showId',
            title: '查看房间'
          },
          editId: {
            id: 'editId',
            title: '修改房间'
          },
          removeId: {
            id: 'removeId',
            title: '删除房间'
          }
        },
        //* 增加数据 *//
        operailityData: '',
        // 操作标识
        todoId: 0 // id
      }
    },
    methods: {
      init: function () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          method: api.list.method,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
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
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.roomManageTableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let tableData = this.$refs.tableData;
        let paginationHt = 50 * 2 + 40;
        this.dynamicHt = this.contenHeight - tableData.offsetTop - paginationHt;
      },
      /*----------- 模态框 -------------*/
      // 增加
      add() {
        this.openModel('add')
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
          this.operailityData = this.multipleSelection;
          this.openModel('remove')
        }
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
       * 列表数据选择
       */
      isSelected() {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess("请选择数据!");
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
    watch: {
      contenHeight(val) {
        this.setTableDynHeight()
      },
    }
  }

</script>

<style>
  .roomButtonList {
    margin-bottom: 10px;
  }

</style>
