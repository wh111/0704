<template>
  <!-- 自主训练管理 -->
  <div>
    <el-row>
      <el-col :span="18">
        <!-- 操作按钮 -->
        <el-button type="success" @click="add">新建自主训练</el-button>
        <el-button type="info" @click="bespoke">申请列表</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="6" align="right">
        <el-input placeholder="请输入自主训练名称" v-model="searchObj.name">
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <div id="tableView" ref="tableView" style="margin-top:20px;">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo"
        style="width: 100%;" @selection-change="handleSelectionChange">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column label="操作" width="210" align="center">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="success" @click="edit(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
            <el-button size="small" type="warning"  @click="signIn(scope.row)">签到</el-button>
          </template>
        </el-table-column>
        <el-table-column label="自主训练名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建人" prop="creater" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
        :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.addId"></modal-header>
      <edit v-if="addModal" @cancel="cancel" @add="subCallback"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :opData="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :loading="true" :width="1000">
      <modal-header slot="header" :parent="self" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :opData="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" class-name="vertical-center-modal" :loading="loading"
      :width="500">
      <modal-header slot="header" :content="contentHeader.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 申请列表 -->
    <Modal :mask-closable="false" v-model="bespokeModal"  style="height:500px;" class-name="vertical-center-modal" :loading="true" :width="1000">
      <modal-header slot="header" :parent="self" :content="contentHeader.bespokeId"></modal-header>
      <bespeak v-if="bespokeModal" type="project" @cancel="cancel" style="height:500px;" :opData="operailityData"></bespeak>
      <div slot="footer"></div>
    </Modal>
    <!--签到弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="signInModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="900">
      <modal-header slot="header" :content="signInId"></modal-header>
      <signIn v-if="signInModal" @cancel="cancel" :operaility-data="operailityData"></signIn>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  let Util = null;

  import api from './api'; // API
  import bespeak from '../../bespeakApply/bespeakApply_list.vue'
//  import add from './project_add'; // 增加
  import edit from './project_input.vue'; // 编辑
  import show from './project_view'; // 查看
  import signIn from '../../bespeakClass/bespeakClass_signIn.vue'
  export default {
    props: {
      contenHeight: {
        type: Number,
        default: 100
      },
      update: { // 是否更新表格数据
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        signInModal:false,
        signInId: {id: 'signInId', title: '签到'},
        api,
        totalCount: 0,
        self: this,
        dynamicHt: 100, // 表格高度
        loading: false,
        bespokeModal: false,

        operailityData: '',
        multipleSelection: '', // 表格已选集
        searchObj: { // 搜索
          name: '', //  房间名称
        },
        tableData: [],
        // 模态框提示
        contentHeader: {
          addId: {
            id: 'addId',
            title: '增加'
          },
          bespokeId: {
            id: 'bespokeId',
            title: '预约申请列表'
          },
          editId: {
            id: 'editId',
            title: '修改'
          },
          showId: {
            id: 'showId',
            title: '查看'
          },
          removeId: {
            id: 'removeId',
            title: '删除'
          },
        }
      }
    },
    methods: {
      //签到
      signIn (rowData) {
        this.operailityData = rowData
        this.openModel('signIn')
      },
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init() {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          }
        }
        this.setTableData();
      },
      /************************* 搜索逻辑 *********************************/
      search() {
        this.setTableData();
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
        let tableView = this.$refs.tableView;
        let paginationHt = 40;
        this.dynamicHt = this.contenHeight - tableView.offsetTop - paginationHt;
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
      /************************************** 模态框处理 **************************************************/
      // 增加，选择考核类型
      add(row) {
        this.openModel('add')
      },
      // 编辑
      edit(row) {
        this.operailityData = row;
        this.openModel('edit')
      },
      // 编辑
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      // 删除
      remove(row) {
        this.operailityData = [{
          id: row.id
        }];
        this.openModel('remove')
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
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
      //预约申请列表
      bespoke(){
        this.openModel('bespoke')
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
    },
    components: {
//      add,
      edit,
      show,
      bespeak,
      signIn
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
    },
    created() {
      Util = this.$util;
      this.init()
    }
  }

</script>
<style lang="scss">
  @import'../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
