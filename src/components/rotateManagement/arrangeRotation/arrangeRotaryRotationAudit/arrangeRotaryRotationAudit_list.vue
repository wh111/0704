<!----------------------------------
****--@name    安排轮转审核
****--@role     ${*}
****--@date     2018/5/30
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form :inline="true">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10">
          <el-button @click="batchAudit" :disabled="disabled.batchAudit" type="primary">批量审核</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14" align="right">
          <el-form-item label="姓名：">
            <input class="hidden">
            <el-input placeholder="请输入内容" v-model.trim="formValidate.userName">
              <div slot="prepend">姓名</div>
              <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br/>
    <!--表格数据操作按钮-->
    <div>
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          stripe
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData1"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="75">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
              <el-button size="small" :disabled="!['NO_PASS'].includes(scope.row.state)"
                         @click="audit(scope.row)">审核
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            show-overflow-tooltip
            label="姓名">
          </el-table-column>
          <el-table-column
            v-if="podClass!=='ZYY'"
            prop="depName"
            label="科室名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="beginTime"
            label="轮转开始时间"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="轮转结束时间"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="arrangeDepState"
            label="状态"
            show-overflow-tooltip>
            <template scope="scope">
              {{scope.row.state | typeText}}
            </template>
          </el-table-column>

        </el-table>
      </div>
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
    <!---->
    <!---->
    <!--查看-->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="对话框标题"

      class-name="vertical-center-modal"
      :loading="true"
      :width="800"
    >
      <modal-header slot="header" :parent="self" :content="showId"></modal-header>
      <show v-if="showModal" :podClass="podClass" @cancel="cancel" :url="api" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--审核-->
    <Modal
      :mask-closable="false"
      v-model="auditModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="true"
      :width="800">
      <modal-header slot="header" :parent="self" :content="auditId"></modal-header>
      <audit v-if="auditModal" :podClass="podClass" @cancel="cancel" :url="api" @audit="subCallback"
             :operaility-data="operailityData"></audit>
      <div slot="footer"></div>
    </Modal>
    <!--批量审核-->
    <Modal
      :mask-closable="false"
      v-model="batchAuditModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="true"
      :width="800">
      <modal-header slot="header" :parent="self" :content="batchAuditId"></modal-header>
      <audit type="batchAudit" v-if="batchAuditModal" :podClass="podClass" @cancel="cancel" :url="api"
             @batchAudit="subCallback"
             :operaility-data="operailityData"></audit>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>

<script>
  /*当前组件必要引入*/
  //引入--微调--组件
  import show from './arrangeRotaryRotationAudit_view.vue';
  import audit from './arrangeRotaryRotationAudit_audit.vue';
  import api from "./api.js";
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['podClass'],
    data() {
      return {
        api,
        //查询表单
        noRotationUrl: '',  // 无需安排轮转url
        //form表单bind数据
        formValidate: {
          userName: "",
          sortby: "",
          order: "",
          rtBeginTimeStart: "",
          rtBeginTimeEnd: "",
          rtEndTimeStart: "",
          rtEndTimeEnd: "",
          arrangeDepState: "",
          podClass: this.podClass || 'SXS',
        },
        /*--按钮button--*/
        auditId: {
          id: 'auditId',
          title: '审核'
        },
        batchAuditId: {
          id: 'batchAuditId',
          title: '批量审核'
        },
        showId: {
          id: 'showId',
          title: '查看'
        },

        noRotationData: {
          data: {
            podIds: '',
          }
        },

        //安排轮转
        rotationModal: false,
        batchAuditModal: false,
        auditModal: false,
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [],
        loading: false,
        listTotal: 0,
        disabled: {
          noRotation: false,
          batchAudit: false,
        },
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.auditDepRotaryDataList.path,
            params: {
              userName: "",
              sortby: "",
              podClass: this.podClass,
              order: "",
              rtBeginTimeStart: "",
              rtBeginTimeEnd: "",
              rtEndTimeStart: "",
              rtEndTimeEnd: "",
              arrangeDepState: "",
            },
          }
        },

      }

    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }

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
        let disabled = {
          noRotation: false,
          batchAudit: false,
        }
        val.map(item => {
          if (!['NO_PASS'].includes(item.state)) {
            disabled.batchAudit = true;
          }
        })
        this.disabled = disabled;
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
        } else {
          var sltTs = this.multipleSelection[0].ts;
          for (var i = 0, item; i < this.multipleSelection.length; i++) {
            item = this.multipleSelection[i];
            if (item.ts != sltTs) {
              this.showMess("请选择相同时间范围的人员一起安排!");
              flag = false;
              break;
            }
          }
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

      /*--点击--安排轮转--按钮--*/
      rotation() {
        if (!this.isSelected()) return;
        let tempArr = [];
        let depName = this.multipleSelection[0].depName;
        let ts = this.multipleSelection[0].ts;
        let podClass = this.multipleSelection[0].podClass;
        for (var i = 0, item; i < this.multipleSelection.length; i++) {
          item = this.multipleSelection[i];
          tempArr.push(item["podId"]);
        }
        this.operailityData = {
          depName,
          ts,
          podClass,
          podIds: tempArr.join(","),
        };
        this.openModel('rotation');
      },

      //无需安排轮转
      noRotation() {
        if (!this.isSelected()) return;
        let podIds = [];
        this.multipleSelection.map(item => {
          podIds.push(item.podId)
        })
        this.noRotationData.data.podIds = podIds.join(',')
        this.openModel('noRotation');
      },

      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(rowData) {
        this.operailityData = rowData;
        this.openModel('show');
      },
      /*
       * 点击--审核--按钮
       * @param index string|number  当前行索引
       * */
      audit(rowData) {
        this.operailityData = rowData;
        this.openModel('audit');
      },
      //批量审核
      batchAudit () {
        if (!this.isSelected()) return;
        let id = this.multipleSelection.reduce((arr, item) => {
          arr.push(item.id)
          return arr;
        }, []).join(',')
        this.operailityData = {
          id: id
        }
        this.openModel('batchAudit');
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
          //this.formValidate = this.setObjValEmpty(this.formValidate);
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
      show, audit
    }

  }
</script>
