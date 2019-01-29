<!--档案审核-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" :inline="true" label-width="90px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10">
          <el-button type="primary" @click="add">添加</el-button>
          <el-button type="danger" @click="remove">删除</el-button>
          <!--<el-button type="danger" @click="defend">职业防护</el-button>-->
        </el-col>
        <!--搜索项-->
        <el-col :span="14" align="right">
          <el-form-item label="姓名:" prop="diseaseName">
            <el-input v-model="formValidate.userName" placeholder="姓名">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>

      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore">
        <el-form-item label="科室" prop="depId">
          <el-select filterable v-model="formValidate.depId" placeholder="科室">
            <select-option type="byUserType"></select-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formValidate.status" placeholder="状态">
            <el-option
              v-for="item in stasusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="info" @click="searchEvent">查询</el-button>
      </div>
    </el-form>
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
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55" :selectable="canSelect">
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
            width="400">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)" type="info">查看</el-button>
              <el-button :disabled="scope.row.status!='WSB'&&scope.row.status!='BTG'&&scope.row.status!='BH'" size="small" @click="edit(scope.row)" type="warning">修改
              </el-button>
              <el-button :disabled="scope.row.status!='WSB'&&scope.row.status!='BTG'&&scope.row.status!='BH'" size="small" @click="reported(scope.row)" type="danger">
                上报
              </el-button>
              <el-button :disabled="!['REPORTWSB','TG','REPORTBH'].includes(scope.row.status) " size="small" type="primary"
                         @click="upload(scope.row)">上传资料
              </el-button>
              <el-button :disabled="!['REPORTTG','REIMBURSEMENTWSB','REIMBURSEMENTBH'].includes(scope.row.status) " size="small"
                         type="success"
                         @click="expense(scope.row)">报销申请
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="userName"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="depName"
            label="科室"
            width="120">
          </el-table-column>

          <el-table-column
            prop="exposureLevel"
            label="暴露级别"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="isInfected"
            label="结论"
          >
            <template scope="scope">
              {{!!scope.row.isInfected ? '暴露后感染病毒':' 暴露后未感染病毒'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="reportDate"
            label="报告时间"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="120">
            <template scope="scope">
              {{scope.row.status | occupationalExposure}}
            </template>
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
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <div>

      <!--新建-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="addModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="addId"></modal-header>
        <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
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
        <modal-header slot="header" :content="editId"></modal-header>
        <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
        <div slot="footer"></div>
      </Modal>
      <!--删除弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="removeModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="500">
        <modal-header slot="header" :content="removeId"></modal-header>
        <remove v-if="removeModal" :delete-url="deleteUrl" @remove="subCallback" @cancel="cancel"
                :operaility-data="operailityData"></remove>

        <div slot="footer"></div>
      </Modal>
      <!--查看弹窗-->
      <Modal
        width="1000"
        v-model="showModal"
        title="查看档案管理弹窗"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="viewId"></modal-header>
        <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>
      <!--上报弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="reportedModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="500">
        <modal-header slot="header" :content="reportedId"></modal-header>
        <operate v-if="reportedModal" :type="'reported'" :operateUrl="reportedUrl" @operate="subCallback"
                 @cancel="cancel" :operaility-data="operailityData"></operate>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--上传资料弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="uploadModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="800">
        <modal-header slot="header" :content="uploadId"></modal-header>
        <upload v-if="uploadModal" @upload="subCallback" @cancel="cancel" :operaility-data="operailityData"></upload>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--报销申请弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="expenseModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="800">
        <modal-header slot="header" :content="expenseId"></modal-header>
        <expense v-if="expenseModal" @expense="subCallback" @cancel="cancel"
                 :operaility-data="operailityData"></expense>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--职业防护弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="defendModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="800">
        <modal-header slot="header" :content="defendId"></modal-header>
        <defend v-if="defendModal" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></defend>
        <div slot="footer"></div>
      </Modal>
      <!---->
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--新建--组件
  import add from "./occupationalExposure_add.vue";
  //引入--修改--组件
  import edit from "./occupationalExposure_edit.vue";
  //引入--查看--组件
  import show from "./occupationalExposure_view.vue";
  //引入--上传资料--组件
  import upload from "./occupationalExposure_upload.vue";
  //引入--报销申请--组件
  import expense from "./occupationalExposure_expense.vue";
  //引入--职业防护--组件
  import defend from "./occupationalExposure_defend.vue";

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        //查询表单
        listUrl: '/role/list?name=&identify=&type=',
        deleteUrl: 'occupationalExposure/remove',
        reportedUrl: 'occupationalExposure/modifyStatus', //上报
        formValidate: {
          userName: '',  //学员姓名
          depId: '',      //科室ID
          status: ''      //审批状态
        },
        // 这里获取当前登录人员信息
        applicant: {},
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        searchMore: false,
        tableData: [],
        stasusOptions: [
          {
            value: '',
            label: '全部'
          }, {
            value: 'WSB',
            label: '未上报'
          }, {
            value: 'DSH',
            label: '审核中(待审)'
          }, {
            value: 'TG',
            label: '通过'
          }, {
            value: 'BTG',
            label: '不通过'
          }, {
            value: 'BH',
            label: '驳回修改'
          }, {
            value: 'REPORTWSB',
            label: '化验报告未上报'
          }, {
            value: 'REPORTDSH',
            label: '化验报告待审核'
          }, {
            value: 'REPORTBH',
            label: '化验报告驳回'
          }, {
            value: 'REPORTTG',
            label: '化验报告通过'
          }, {
            value: 'REIMBURSEMENTWSB',
            label: '报销申请未上报'
          }, {
            value: 'REIMBURSEMENTDSH',
            label: '报销申请待审核'
          }, {
            value: 'REIMBURSEMENTBH',
            label: '报销申请被驳回'
          }, {
            value: 'REIMBURSEMENTTG',
            label: '报销申请通过'
          }, {
            value: 'REPORTTG',
            label: '化验报告通过'
          }, {
            value: 'REPORTTG',
            label: '化验报告通过'
          }
        ],
        //转换暴露状态
        loading: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: 'occupationalExposure/list',
            params: {},
          }
        },

        expenseAuditModal: false,
        medicalAuditModal: false,
        reportedModal: false,
        uploadModal: false,
        expenseModal: false,
        defendModal: false,
        /*--按钮button--*/
        addId: {id: 'addId', title: '新建'},
        editId: {id: 'editId', title: '修改'},
        removeId: {id: 'removeId', title: '删除'},
        viewId: {id: 'viewId', title: '查看'},
        auditId: {id: 'auditId', title: '审核'},
        expenseAuditId: {id: 'expenseAuditId', title: '报销审核'},
        medicalAuditId: {id: 'medicalAuditId', title: '体检报告审核'},
        reportedId: {id: 'reportedId', title: '上报'},
        uploadId: {id: 'uploadId', title: '上传资料'},
        expenseId: {id: 'expenseId', title: '报销申请'},
        defendId: {id: 'defendId', title: '职业防护'},
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        }
        let userInfo = this.$store.getters.getUserInfo;
        this.applicant.applicantId = userInfo.id;
        this.applicant.applicantName = userInfo.name;
        this.setTableData();
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

      // 允许选择的行
      canSelect(row) {
        // 未上报、驳回的数据才可以被选中删除
        return !!~['WSB', 'BH'].indexOf(row.status)
      },

      //通过get请求列表数据
      updateListData(responseData) {
        this.tableData = this.addIndex(responseData.data);
        this.totalCount = responseData.totalCount || 0;
      },


      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.formValidate);
        this.ajax(this.listMessTitle);
      },


      //搜索监听回调
      searchEvent(isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData()
        }
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        let flag = false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
        return flag
      },


      /*--点击--添加--按钮--*/
      add() {
        this.operailityData = this.applicant;
        this.openModel("add");
      },


      /*--点击--修改--按钮--*/
      edit(data) {
        this.operailityData = this.addApplicant(data);
        this.openModel("edit");
      },


      /*--点击--删除--按钮--*/
      remove() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },


      /*--点击--职业防护--按钮--*/
      defend() {
        this.operailityData = this.multipleSelection;
        this.openModel('defend');
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = this.addApplicant(data);
        this.openModel("show");
      },


      audit(data) {
        this.operailityData = this.addApplicant(data);
        this.openModel("audit");
      },


      //体检报告审核
      medicalAudit(data) {
        this.operailityData = this.addApplicant(data);
        this.openModel("medicalAudit");
      },


      //报销审核
      expenseAudit(data) {
        this.operailityData = this.addApplicant(data);
        this.openModel("expenseAudit");
      },


      //上报
      reported(data) {
        this.operailityData = this.addApplicant(data);
        this.openModel("reported");
      },


      //上传资料
      upload(data) {
        this.operailityData = this.addApplicant(data);
        this.openModel("upload");
      },


      //报销申请
      expense(data) {
        this.operailityData = this.addApplicant(data);
        this.openModel("expense");
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


      //添加登录人员信息
      addApplicant(data, user) {

        data.applicantName = user ? user.applicantNmae : this.applicant.applicantName;
        data.applicantId = user ? user.applicantId : this.applicant.applicantId;
        return data

      },


      //转换暴露状态
      converterStatus(status) {
        switch (status) {
          case 'WSB' :
            status = '未上报';
            break;
          case 'DSH' :
            status = '审核中(待审)';
            break;
          case 'TG' :
            status = '通过';
            break;
          case 'BTG' :
            status = '不通过';
            break;
          case 'BH' :
            status = '驳回修改';
            break;
          case 'REPORTWSB' :
            status = '化验报告未上报';
            break;
          case 'REPORTDSH' :
            status = '化验报告待审核';
            break;
          case 'REPORTBH' :
            status = '化验报告驳回';
            break;
          case 'REPORTTG' :
            status = '化验报告通过';
            break;
          case 'REIMBURSEMENTWSB' :
            status = '报销申请未上报';
            break;
          case 'REIMBURSEMENTDSH' :
            status = '报销申请待审核';
            break;
          case 'REIMBURSEMENTBH' :
            status = '报销申请被驳回';
            break;
          case 'REIMBURSEMENTTG' :
            status = '报销申请通过';
            break;
        }
        return status;

      },

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
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
      add,
      edit,
      show,
      upload,
      expense,
      defend
    }
  }
</script>
