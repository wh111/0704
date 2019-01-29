<!--
****--@file     award_list
****--@date     2018/11/15 17:01
****--@author   ZWT
****--@describe 获奖管理
-->
<template>
  <div ref="conten">
    <el-row>
      <el-form :inline="true">
        <el-col :span="5">
          <el-form-item>
            <el-button type="info" @click="add">添加</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="19" align="right">
          <el-form-item label="所属生源：">
            <el-select v-model="searchObj.userType" placeholder="请选择">
              <el-option label="住院医师" value="ZYY"></el-option>
              <el-option label="进修生" value="JXS"></el-option>
              <el-option label="研究生(专业学位)" value="YJSZY"></el-option>
              <el-option label="研究生(科学学位)" value="YJSKX"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="获得者：">
            <el-input v-model="searchObj.userName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="seach">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div ref="table">
      <el-table align="center" :data="tableData" :height="dynamicHt"
                tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <!--<el-table-column type="selection" width="55" :selectable="canTodo"></el-table-column>-->
        <!--<el-table-column label="序号" prop="index" width="70"></el-table-column>-->
        <el-table-column label="操作" align="center" width="210">
          <template scope="scope">
            <el-button size="small" type="info" @click="edit(scope.row)"> 修改
            </el-button>
            <el-button size="small" type="danger" @click="remove(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="获得者" prop="userName"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="获得时间" prop="createTime"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="所属生源" prop="userType" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.userType | soundSource }}
          </template>
        </el-table-column>
        <el-table-column label="成果描述" prop="awardDesc"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" prop="awardType"
                         show-overflow-tooltip></el-table-column>
        <el-table-column label="等级" prop="awardLevel"
                         show-overflow-tooltip></el-table-column>
        <!--<el-table-column label="会议结束时间" prop="endTime" show-overflow-tooltip></el-table-column>-->
        <el-table-column label="排名" prop="awardSort" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.awardSort | ranking }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页按钮 -->
      <div style="float: right;margin-top:10px;">
        <el-pagination @size-change="changePageSize"
                       @current-change="changePage"
                       :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes"
                       :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount"></el-pagination>
      </div>
    </div>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal"
           class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback"
           :type="type"></add>
      <div slot="footer"></div>
    </Modal>
    <!--修改-->
    <Modal
      close-on-click-modal="false"
      width="1000"
      v-model="editModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <add v-if="editModal" @cancel="cancel" @edit="subCallback"
           :operaility-data="operailityData" :type="type"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal"
           class-name="vertical-center-modal"
           :loading="loading"
           :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <operate v-if="removeModal" :operateData="removeData" type="remove"
               @operate="subCallback" :operailityData="operailityData"
               @cancel="cancel"></operate>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import add from './award_add';
  import api from './api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'award_list',
    data () {
      return {
        searchObj: {
          userType: '',
          userName: '',
        },
        type: '',
        tableData: [], // 表格数据
        dynamicHt: 100,
        totalCount: 0,
        button: {
          addId: {
            id: 'addId',
            title: '添加',
          },
          showId: {
            id: 'showId',
            title: '查看',
          },
          editId: {
            id: 'editId',
            title: '修改',
          },
          removeId: {
            id: 'removeId',
            title: '删除',
          },
        },
        loading: false,
        removeData: {
          url: api.delete,
          params: {
            id: '',
          },
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
            userType: '',
            userId: '',
          },
        }
        this.setTableData()
      },
      setTableData (isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions,
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = this.addIndex(res.data || []);
      },
      add () {
        this.type = 'add';
        this.operailityData = null;
        this.openModel('add')
      },
      edit (data) {
        this.type = 'edit';
        this.operailityData = data;
        this.openModel('edit');
      },
      seach () {
        this.setTableData()
      },
      handleSelectionChange (val) {
        // let disabled = {remove:false,}
        //
        // for(let i=0;i<val.length;i++){
        //   let item = val[i];
        //   if(['NOT_AUDIT','AUDIT_SUCCESS'].includes(item.status)){
        //     disabled.remove = true;
        //   }
        //
        // }
        //
        // this.disabled = disabled;
        // this.multipleSelection = val;
      },
      remove (data) {
        this.removeData.params.id = data.id;
        this.operailityData = data;
        this.openModel('remove')
        // }
      },
      // 不允许选择参与操作
      canTodo (row) {
        // return row.status != 'AUDIT_SUCCESS'
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let contenHeight = this.$refs.conten.parentNode.offsetHeight;
        let tableTop = this.$refs.table.offsetTop;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableTop - paginationHt;
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
      // 操作回调
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
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
      })
    },
    components: {
      add,
    },
  }

</script>
