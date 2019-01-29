<!--
****--@file     theoreticalExaminationProposition_list
****--@date     2018/9/25 16:37
****--@author   ZWT
****--@describe 考务管理-理论考试命题
-->
<template>
  <div ref="content">
    <el-row>
      <el-form :inline="true">
        <el-col :span="4">
          <el-button type="info" :disabled="disabled.add" @click="add">新增</el-button>
          <el-button type="info" :disabled="disabled.edit" @click="edit">编辑</el-button>
          <el-button type="danger" :disabled="disabled.remove" @click="remove">删除</el-button>
        </el-col>
        <el-col :span="20" align="right">
          <el-form-item label="任务下放时间：">
            <el-date-picker v-model="searchObj.createTime" type="date" :editable="false" placeholder="请选择时间"
                            style="width:130px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="命题任务：">
            <el-input v-model="searchObj.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 数据表格 -->
    <div ref="table">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="命题任务" prop="name" align="center"></el-table-column>
        <el-table-column label="任务接收人" prop="userList" show-overflow-tooltip></el-table-column>
        <el-table-column label="命题数量" prop="number" show-overflow-tooltip></el-table-column>
        <el-table-column label="命题要求" prop="request" show-overflow-tooltip></el-table-column>
        <el-table-column label="备注" prop="remark" show-overflow-tooltip></el-table-column>
        <el-table-column label="教学分类" prop="teachType" show-overflow-tooltip></el-table-column>
        <el-table-column label="课程名称" prop="className" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务下放时间" prop="createTime" show-overflow-tooltip></el-table-column>
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
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="940">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <edit v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :type="type"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="940">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :type="type"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--删除弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="removeModal"
           class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api';
  import edit from './llksmt_edit';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'theoreticalExaminationProposition_list',
    data () {
      return {
        deleteUrl: '',
        deptOptions: [],
        //* 表格 *//
        self: this,
        removeData: {
          url: api.delete,
          params: {
            ids: ''
          }
        },
        disabled: {
          add: false,
          edit: false,
          remove: false
        },
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        operailityData: '',
        multipleSelection: '', // 选项
        tableData: [], // 表格数据
        reportedModal: false,
        // 搜索
        searchObj: {
          createTime: '', // 进修科目id
          name: ''
        },
        //* 按钮 *//
        button: {
          editId: {id: 'editId', title: '编辑'},
          addId: {id: 'addId', title: '新增'},
          removeId: {id: 'removeId', title: '删除'}
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init: function () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.listLlKsmt.path,
          method: api.listLlKsmt.method,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };

        this.setTableData();
      },

      //*----------- 表格 ------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        let disabled = {remove: false};
        // if (val.length == 1) {
        //   disabled.add = true;
        // } else if (val.length > 1) {
        //   disabled.edit = true;
        // }
        if (val.length > 1) {
          disabled.edit = true;
        }
        this.disabled = disabled;
        this.multipleSelection = val;
      },

      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      beginTime: '', // 进修科目id
      endTime: '',
      setTableData (isLoading) {
        let searchObj = this.formDate(this.$util._.defaultsDeep({}, this.searchObj),
          ['createTime'], 'yyyy-MM-dd');
        Object.assign(this.queryQptions.params, searchObj);

        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = res.data || [];
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let contentHeight = this.$refs.content.parentNode.offsetHeight;
        let tableData = this.$refs.table.offsetTop;
        let paginationHt = 50;
        this.dynamicHt = contentHeight - tableData - paginationHt;
      },
      /*----------- 模态框 -------------*/
      // 搜索
      search () {
        this.setTableData();
      },
      // 增加
      add () {
        this.type = 'add';
        this.operailityData = null;
        this.openModel('add');
      },
      // 编辑
      edit () {
        this.type = 'edit';
        if (this.multipleSelection.length != 1) {
          this.showMess('请选择一条数据');
          return;
        }
        this.operailityData = this.multipleSelection;
        this.openModel('edit');
      },
      /*--点击--删除--按钮--*/
      remove () {
        this.deleteUrl = api.llksmtdelete;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },

      // 增加回调
      subCallback (target, title, updata) {
        console.log(target, title, updata);
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      /*
       * 列表数据选择
       */
      isSelected () {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess('请选择数据!');
          flag = false;
        }
        return flag;
      }
    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    components: {
      edit
    }
  };
</script>
