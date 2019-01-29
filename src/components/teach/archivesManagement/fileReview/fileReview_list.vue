<!--档案审核-->
<template>
  <div id="content" ref="content" class="modal">
    <el-row>
      <el-col :span="3">
        <el-button type="danger" @click="audits">批量审核</el-button>
      </el-col>
      <el-col :span="21" align="right">
        <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin"
                 label-width="90px">
          <el-form-item label="姓名">
            <el-input v-model="formValidate.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="formValidate.sex" placeholder="性别">
              <el-option label="全部" value="all"></el-option>
              <el-option label="男" value="boy"></el-option>
              <el-option label="女" value="girl"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="formValidate.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('formValidate')">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData1"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            :selectable="canAudit"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            prop="index"
            width="100">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="140">
            <template scope="scope">
              <el-button size="small" type="info" @click="show(scope.$index)">查看</el-button>
              <el-button size="small" type="warning" :disabled="scope.row.archivesAuditStatus=='AUDIT_SUCCESS'"
                         @click="audit(scope.$index)">审核
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="school.sex"
            label="性别"
            align="center"
            width="80"
            show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.sex | typeText }}
            </template>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            show-overflow-tooltip>
          </el-table-column>

        </el-table>
      </div>
      <!--分页-->
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="myPages.currentPage"
            :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--审核-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="auditModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="auditId"></modal-header>
      <audit v-if="auditModal" @cancel="cancel" @audit="subCallback" :operaility-data="operailityData"></audit>
      <div slot="footer"></div>
    </Modal>
    <!-- 批量审核 -->
    <Modal :mask-closable="false" v-model="auditsModal" height="200" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="auditsId"></modal-header>
      <audits v-if="auditsModal" @cancel="cancel" @audits="subCallback" :operaility-data="operailityData"></audits>
      <div slot="footer"></div>
    </Modal>
    <!--查看档案管理弹窗-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--新建--组件
  import show from "../archivesManagement/archivesManagement_view.vue";
  //引入--选择人员--组件
  import audit from "./fileReview_audit.vue";
  import audits from "./fileReview_audits.vue";
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        //查询表单
        formValidate: {
          name: '',
          sex: '',
          mobile: ''
        },

        auditsIdArr: [], // 批量审核id
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [],
        loading: false,
        auditsModal: false,
        listTotal: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '/archives/list-by-not-audit',
            params: {}
          }
        },
        /*--按钮button--*/
        viewId: {id: 'view', title: '查看'},
        auditId: {id: 'audit', title: '审核'},
        auditsId: {id: "auditsId", title: "批量审核"},
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          //url:this.listUrl,
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }

        this.setTableData();
      },

      // 是否可审核
      canAudit(row) {
        return row.archivesAuditStatus != 'AUDIT_SUCCESS'
      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
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


      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        this.tableData1 = [];
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = responseData.totalCount || 0;
      },
      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params, this.formValidate);
        this.ajax(this.listMessTitle);
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        this.setTableData();
      },


      /*--点击--审核--按钮--*/
      audit(index) {
        this.operailityData = this.tableData1[index];
        this.auditModal = true;
      },

      // 批量审核
      audits() {
        if (!this.multipleSelection.length) {
          this.errorMess('请选择需要审核的人员');
          return false
        }
        this.operailityData = this.multipleSelection;
        this.openModel('audits')
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index) {
        this.operailityData = this.tableData1[index];
        this.showModal = true;
      },


      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },


      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *addMessTitle:{
       *    type:'add',
       *    successTitle:'添加成功!',
       *    errorTitle:'添加失败!',
       *    ajaxSuccess:'ajaxSuccess',
       *    ajaxError:'ajaxError',
       *    ajaxParams:{
       *      url:'/role/add',
       *      method:'post'
       *    }
       *    }
       * @param udata boolean 默认false  是否不需要刷新当前表格数据
       * */
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
      //当前组件引入的子组件
      show, audit, audits
    }
  }
</script>
