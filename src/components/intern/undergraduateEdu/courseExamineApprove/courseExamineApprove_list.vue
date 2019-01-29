<!----------------------------------
****--@name     课程审核
****--@role     ${*}
****--@date     2018/5/25
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--搜索项-->
        <el-col :span="24" align="right">
          <!-- <el-form-item label="审核状态：">
             <el-select v-model="formValidate.courseArrangeState" placeholder="科室">
               <el-option label="全部" value=""></el-option>
               <el-option label="待审核" value="NO_PASS"></el-option>
               &lt;!&ndash;<el-option label="驳回" value="REJECT"></el-option>&ndash;&gt;
               &lt;!&ndash;<el-option label="通过" value="PASS"></el-option>&ndash;&gt;
               &lt;!&ndash;<el-option label="未上报" value="NO_SUBMIT"></el-option>&ndash;&gt;
             </el-select>
           </el-form-item>-->
          <el-form-item label="教研室：">
            <el-select v-model="formValidate.courseTeachingResearchRoom" filterable placeholder="科室">
              <select-option :url="url.getByDepth.path+'?depth=2'"></select-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
          <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
        </el-col>
      </el-row>
      <!--高级搜索项-->
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
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            prop="index"
            width="80">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="240">
            <template scope="scope">
              <el-button size="small" type="info" @click="show(scope.row)">查看
              </el-button>
              <el-button :disabled="scope.row.state!==3" size="small" @click="audit(scope.row)">审核
              </el-button>
              <el-button :disabled="scope.row.state!==5" size="small" @click="deriveCourse(scope.row)">导出课程表
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="courseDep"
            label="教研室">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="schoolNames"
            label="学校">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="gradeNum"
            label="年级">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="classNum"
            label="班级"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="weekSetStartYear"
            label="开始年度"
            width="100">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="weekSetEndYear"
            label="结束年度"
            width="100">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="semester"
            label="学期"
            width="100">
            <template scope="scope">
              {{scope.row.semester | typeText}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="weekSetStartTime"
            width="180"
            label="起止时间">
            <template scope="scope">
              {{ scope.row.weekSetStartTime}} - {{ scope.row.weekSetEndTime}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="state"
            label="状态">
            <template scope="scope">
              {{scope.row.state | depSyllabusManagement}}
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
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" whereFrom="jysAudit"
            :editOperailityData="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--审核-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="auditModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="auditId"></modal-header>
      <audit v-if="auditModal" :url="url" @audit="subCallback" @cancel="cancel"
             :type="type" :operaility-data="operailityData"></audit>
      <div slot="footer"></div>
    </Modal>
    <!--导出课程表弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="deriveCourseModal"
      title="对话框标题"
      :width="500">
      <modal-header slot="header" :content="deriveCourseId"></modal-header>
      <derive v-if="deriveCourseModal" type="deriveCourse" messTitle="确定要导出课程表吗？" :url="deriveCourseUrl"
              @cancel="cancel"></derive>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../api'
  //引入--查看--组件
  import show from '../syllabusManagement/syllabusManagement_edit.vue';
  import audit from './courseExamineApprove_audit.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      type: {//类型
        type: String,
        default: 'jyc'
      },
    },
    data() {
      return {
        deriveUrl: '',
        url: url,
        //查询表单
        deleteUrl: '/role/remove',
        formValidate: {
          courseBeginTime: '', //查询课程开始时间
          courseEndTime: '', //查询课程结束时间
          sortby: '',//排序列
          order: '', //升序、降序
          courseArrangeState: '',
          courseTeachingResearchRoom: '',
          type: this.type,
        },
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        searchMore: false,
        loading: false,
        deriveModal: false,
        passModal: false,
        rejectModal: false,
        auditModal: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.weekTimeCourseReviewList.path,
            params: {}
          }
        },
        //导出
        deriveCourseUrl: '',
        deriveCourseModal: false,
        deriveCourseId: {id: 'deriveCourseId', title: '导出课程表'},
        /*--按钮button--*/
        viewId: {id: 'viewId', title: '查看'},
        auditId: {id: 'auditId', title: '审核'},

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
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
          this.showMess('请选择数据!');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!')
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData) {
        this.tableData = this.addIndex(responseData.data || []);
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.getFormValidate());
        this.ajax(this.listMessTitle);
      },

      getFormValidate() {
        return this.formDate(this.$util._.defaultsDeep({}, this.formValidate), ['courseBeginTime', 'courseEndTime'], 'yyyy-MM-dd');
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

      /*--点击--修改--按钮--*/
      audit(data) {
        this.operailityData = data;

        this.openModel('audit');
      },

      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = data;
        this.openModel('show');
      },

      /*--点击--导出--按钮--*/
      deriveCourse({weekSetId}) {
        this.deriveCourseUrl = '/api/' + this.url.exportCourseTable.path + '?' + Util.serializeParams({weekSetId: weekSetId});
        this.openModel('deriveCourse');
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
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    components: {
      //当前组件引入的子组件
      show, audit
    }
  }
</script>
