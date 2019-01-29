<!----------------------------------
****--@name     资金库管理
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="content">
    <el-row>
      <el-form ref="formValidate"  :inline="true">
        <el-col :span="12">
          <el-button type="info" @click="add">添加</el-button>
          <el-button type="danger" @click="remove">删除</el-button>
        </el-col>
        <el-col :span="12" align="right">
          <el-form-item label="资金库名称：">
            <el-input v-model="searchObj.fundName"></el-input>
          </el-form-item>
          <el-form-item label="经费代码：" prop="fundCode">
            <el-input v-model="searchObj.fundCode"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 数据表格 -->
    <div ref="table">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canTodo" ></el-table-column>
        <el-table-column label="操作" align="center" width="210">
          <template scope="scope">
            <!-- 添加即可查看 -->
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
            <!-- 草稿和驳回状态可修改 -->
            <el-button size="small" type="warning" @click="edit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="资金库名称" prop="fundName" show-overflow-tooltip></el-table-column>
        <el-table-column label="经费代码" prop="fundCode" show-overflow-tooltip></el-table-column>
        <el-table-column label="初始化金额（元）" prop="fundMoney" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.fundMoney || '0' }}
          </template>
        </el-table-column>
        <el-table-column label="入账金额（元）" prop="enter" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.enter || '0' }}
          </template>
        </el-table-column>
        <el-table-column label="出账金额（元）" prop="goOut" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.goOut || '0' }}
          </template>
        </el-table-column>
        <el-table-column label="结余金额（元）" prop="enter" show-overflow-tooltip>
          <template scope="scope">
            {{ Number(scope.row.fundMoney)-Number(scope.row.goOut)+Number(scope.row.enter) }}
          </template>
        </el-table-column>
        <el-table-column label="系统默认"  prop="isSystem" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.isSystem==1?'是':'否'  }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount"></el-pagination>
    </div>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <clm-input v-if="addModal" @cancel="cancel" @add="subCallback"></clm-input>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <clm-input v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></clm-input>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :loading="true"
           :width="800">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" class-name="vertical-center-modal"
           :loading="loading"
           :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel" title="确认禁用选中的资金库？"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import clmInput from './capitalLibraryManagement_input.vue';
  import show from './capitalLibraryManagement_view.vue';
  import {capitalLibraryManagement as rules} from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        deleteUrl: api.delete,
        deptOptions: [],
        //* 表格 *//
        self: this,
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        operailityData: '',
        multipleSelection: '', // 选项
        tableData: [], // 表格数据
        reportedModal: false,
        // 搜索
        searchObj: {
          fundName: '', // 资金库名称
          fundCode: '',
        },
        //* 按钮 *//
        button: {
          addId: {id: 'addId', title: '增加资金库'},
          showId: {id: 'showId', title: '查看资金库'},
          editId: {id: 'editId', title: '修改资金库'},
          removeId: {id: 'removeId', title: '删除资金库'},
        },
      }
    },
    methods: {
      //初始化请求列表数据
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
      canTodo(row){
        return row.isSystem == '0'
      },
      // 清除选择的资金库
      clearFundSelect() {
        this.searchObj.fundId = '';
        this.searchObj.fundName = '';
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
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        if (res.data.length) {
          res.data.map(item => item.id = item.fundId)
        }
        this.tableData = res.data || [];
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contentHeight = this.$refs.content.parentNode.offsetHeight;
        let tableData = this.$refs.table.offsetTop;
        let paginationHt = 50;
        this.dynamicHt = contentHeight - tableData - paginationHt;
      },
      /*----------- 模态框 -------------*/
      // 搜索
      search() {
        this.setTableData()
      },
      // 增加
      add() {
        this.operailityData = null;
        this.openModel('add')
      },
      // 编辑
      edit(row) {
        this.operailityData = row;
        this.openModel('edit');
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show');
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove() {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove')
        }
      },
      // 上报
      reported(row) {
        this.operailityData = row;
        this.openModel('reported')
      },
      // 上报操作
      reportedCall() {
        let opt = {
          ajaxSuccess: res => this.subCallback('reported', '上报成功'),
          ajaxError: () => this.errorMess('上报失败'),
          ajaxParams: {
            url: api.audit.path,
            method: api.audit.method,
            data: {
              ids: this.operailityData.id,
              status: '1'
            }
          }
        };
        this.ajax(opt)
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
      clmInput,
      show,
    }
  }
</script>
