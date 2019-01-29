<!----------------------------------
****--科研日志审核(dd)
****--@date     2017/7/3
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" :model="formValidate" :rules="rules" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10">
          <el-button type="primary" @click="pass">批量通过</el-button>
          <el-button type="danger" @click="reject">批量驳回</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14" align="right">
          <el-form-item label="标题" prop="logTitle">
            <el-input style="width:300px;" v-model="formValidate.logTitle" placeholder="输入标题搜索">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <br>
      <!--高级搜索项-->
      <div v-show="searchMore" ref="searchMore" align="right">
        <el-form-item label="开始时间" prop="searchStartTime">
          <el-date-picker
            v-model="formValidate.searchStartTime"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions0"
            @change="handleStartTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="searchEndTime">
          <el-date-picker
            v-model="formValidate.searchEndTime"
            align="right"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions1"
            @change="handleEndTime">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="状态:">
          <el-select v-model="formValidate.state" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="未上报" value="NO_SUBMIT"></el-option>
            <el-option label="待审核" value="NO_PASS"></el-option>
            <el-option label="通过" value="PASS"></el-option>
            <el-option label="驳回" value="REJECT"></el-option>
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
            :selectable="canSelect"
            type="selection"
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
            width="200">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
              <el-button v-if="scope.row.state!='PASS' && scope.row.state != 'REJECT'" size="small" @click="audit(scope.row)">审核</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="姓名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="year"
            label="年级">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="logTitle"
            label="标题">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="editTime"
            label="日期"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="state"
            label="状态">
            <template scope="scope">
              {{scope.row.state | typeText}}
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
    <!--审核-->
    <Modal
      close-on-click-modal="false"
      width="800"
      v-model="auditModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="auditId"></modal-header>
      <audit v-if="auditModal" @cancel="cancel" @audit="subCallback" :operaility-data="operailityData"></audit>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal
      width="800"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></show>
      <div slot="footer"></div>
    </Modal>

    <!--批量通过-->
    <Modal
      width="500"
      v-model="passModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="passId"></modal-header>
      <operate v-if="passModal" :type="'pass'" :operateUrl="modifySubPassData.url" :operailityData="modifySubPassData.data" :methods="'post'" @cancel="cancel" @operate="subCallback"></operate>
      <div slot="footer"></div>
    </Modal>

    <!--批量驳回-->
    <Modal
      width="500"
      v-model="rejectModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="rejectId"></modal-header>
      <operate v-if="rejectModal" :type="'reject'" :operateUrl="modifySubRejectData.url" :operailityData="modifySubRejectData.data" :methods="'post'" @cancel="cancel" @operate="subCallback"></operate>
      <div slot="footer"></div>
    </Modal>
    <!---->
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import { scientificResearchLog as rules } from '../rules';
  import url                                from '../api';
  //引入--修改--组件
  import audit                              from './scientificResearchLogAudit_audit.vue';
  //引入--查看--组件
  import show                               from './scientificResearchLogAudit_view.vue';

  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        rules,
        url: url,
        modifySubPassUrl: '',
        //查询表单
        formValidate: {
          logTitle: '',       //标题
          searchStartTime: '',       //查询填写开始时间(yyyy-MM-dd)
          searchEndTime: '',    //   查询填写结束时间(yyyy-MM-dd)
          state: '',    //状态
          sortby: '',  //排序字段
          order: '' //排序方式ASC,ASC
        },
        modifySubPassData: {
          url: url.modifySubPass.path,
          data: {
            id: ''
          }
        },
        modifySubRejectData: {
          url: url.modifySubReject.path,
          data: {
            id: ''
          }
        },
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [
//          {
//            "id":111,
//            "depName":"科室",
//            "createUserName":"名称",
//            "createTime":"2014-01-01 10:10:10",
//            "clinicalName":"操作名称",
//            "clinicalType":"病例号",
//            "clinicalTime":"2016-01-01",
//            "note":"备注说明",
//            "teacherName":"指导老师",
//            "state":"NO_SUBMIT"
//          }
        ],
        searchMore: false,
        loading: false,
        passModal: false,
        rejectModal: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.managePageList.path,
            params: {}
          }
        },
        /*--按钮button--*/
        editId: {id: 'editId', title: '修改'},
        viewId: {id: 'viewId', title: '查看'},
        passId: {id: 'passId', title: '通过'},
        auditId: {id: 'auditId', title: '审核'},
        reportedId: {id: 'reportedId', title: '上报'},
        rejectId: {id: 'rejectId', title: '驳回'},
        //人员
        type: ''
      };

    },
    methods: {
      //初始化请求列表数据
      init () {
        console.log("1111");
        Util = this.$util;
        //ajax请求参数设置
        let userInfo = this.$store.getters.getUserInfo;
        let identify = userInfo.roleList[0].identify;
        if (identify == 'JXMS' || identify == 'KEZR' || identify == '') {
          this.type = 'byNowUser';
        } else {
          this.type = 'dep';
        }
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        };

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight () {
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
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      // 允许选择的行
      canSelect(row) {
        return row.state === 'NO_PASS'
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择数据!');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!');
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        if (!responseData.data) return;
        this.tableData = this.addIndex(responseData.data);
        if (!responseData.totalCount) return;
        this.totalCount = responseData.totalCount;
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //搜索监听回调
      searchEvent (isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData();
        }
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        let flag = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
        return flag;
      },

      /*--点击--添加--按钮--*/
      add () {
        this.openModel('add');
      },
      /*--点击--批量通过--按钮--*/
      pass () {
        if (!this.isSelected()) return;
        let tempArr = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state == 'PASS' || this.multipleSelection[i].state == 'REJECT') {
            this.errorMess('已通过或者已驳回的数据不能进行通过');
            return;
          }
          tempArr.push(this.multipleSelection[i].id);
        }
        this.modifySubPassData.data.id = tempArr.join(',');
        this.openModel('pass');
      },

      /*--点击--审核--按钮--*/
      audit (data) {
        this.operailityData = data;
        this.openModel('audit');
      },

      reject () {
        if (!this.isSelected()) return;
        let tempArr = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].state == 'PASS' || this.multipleSelection[i].state == 'REJECT') {
            this.errorMess('已通过或者已驳回的数据不能进行驳回');
            return;
          }
          tempArr.push(this.multipleSelection[i].id);
        }
        this.modifySubRejectData.data.id = tempArr.join(',');
        this.openModel('reject');
      },
      /*--点击--修改--按钮--*/
      edit (data) {
        this.operailityData = data;
        this.openModel('edit');
      },
      /*--点击--删除--按钮--*/
      remove () {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show (data) {
        this.operailityData = data;
        this.openModel('show');
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
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
      subCallback (target, title, updata) {
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
      openModel (options) {
        this[options + 'Modal'] = true;
      },

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight();
        });
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
      //当前组件引入的子组件
      audit, show
    }
  };
</script>
