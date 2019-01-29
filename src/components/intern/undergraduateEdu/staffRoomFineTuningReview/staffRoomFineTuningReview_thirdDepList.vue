<!----------------------------------
****--@name     教研室审核（三级科室列表）
****--@role     ${*}
****--@date     2018/6/13
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <div
      id="myTable"
      ref="myTable"
    >
      <el-table
        align="center"
        :height="500"
        :context="self"
        stripe
        :data="tableData1"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="序号"
          prop="index"
          width="70">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="150">
          <template scope="scope">
            <el-button size="small" type="primary" @click="show(scope.$index, scope.row)">查看</el-button>
            <el-button
              :disabled="operailityData.state!==4&&![2].includes(scope.row.state)||[4].includes(scope.row.state)"
              v-if="typeView!=='show'"
              size="small"
              type="primary"
              @click="audit(scope.$index, scope.row)">审核
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="schoolNames"
          label="学校"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="courseTeachingResearchRoomThirdName"
          label="科室"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="gradeNum"
          label="年级"
          align="center"
          width="80"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="classNum"
          label="班级"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="startEndWeekSetTime"
          label="起止时间"
          align="center"
          width="240">
          <template scope="scope">
            {{scope.row.weekSetStartTime}} —— {{scope.row.weekSetEndTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          align="center"
          width="120">
          <template scope="scope">
            {{scope.row.state | staffRoomFineTuningReview}}
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
    <br/>
    <!--审核历史列表-->
    <el-table
      v-if="reviewMessList!=0"
      align="center"
      :max-height="200"
      :data="reviewMessList"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;height: 100%">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="80">
      </el-table-column>
      <el-table-column
        align="center"
        prop="createUserName"
        label="审核人"
        width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="审核时间"
        width="120">
        <template scope="scope">
          {{scope.row.createTime | formatDate('yyyy-MM-dd')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="reviewMess"
        label="审核意见"
        align="center">
      </el-table-column>
      <el-table-column
        prop="spState"
        width="120"
        label="审核状态">
        <template scope="scope">
          {{ scope.row.spState | typeText}}
        </template>
      </el-table-column>
    </el-table>
    <!--修改弹窗-->
    <Modal
      :mask-closable="false"
      v-model="auditModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1100">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="auditId"></modal-header>
      <audit v-if="auditModal" @cancel="cancel" @audit="subCallback" :operaility-data="editOperailityData"></audit>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1100">
      <modal-header slot="header" :content="showId"></modal-header>
      <calendar v-if="showModal" type="show" :editOperailityData="editOperailityData"></calendar>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  //引入--修改--组件
  import audit from './staffRoomFineTuningReview_audit.vue'
  import calendar from './depSyllabusManagement_calendar.vue'
  //引入当前组件字典api
  import api from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'typeView'],
    data() {
      return {
        editOperailityData: '',
        //列表查询
        formValidate: {},
        dynamicHt: 100,
        self: this,
        reviewMessList: [],//获取的审核意见
        tableData1: [
          /*{
            "weekSetId":"",
            "schoolName":"",
            "gradeNum":"",
            "classNum":"",
            "startWeekSetYear":"",
            "endWeekSetYear":"",
            "semester":"",
            "startEndWeekSetTime":"",
            "createTime":"",
            "whetherArrangedCourse":"",
            "weekState":""
          }*/
        ],
        modifyStateIssuedData: {
          url: api.thirdModifyIssued.path,
          data: {
            weekSetId: '',
            outlineId: '',
          },
        },
        editModal: false,
        loading: false,
        modifyStateModal: false,
        showModal: false,
        listTotal: 0,
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.weekTimeCourseThirdReviewList.path,
            params: {
              outlineId: this.operailityData.outlineId,
              weekSetId: this.operailityData.weekSetId,
              courseTeachingResearchRoom: this.operailityData.courseTeachingResearchRoom,
            }
          }
        },
        auditId: {
          id: 'edit',
          title: '审核'
        },
        modifyStateId: {
          id: 'modifyStateId',
          title: '下发'
        },
        showId: {
          id: 'showId',
          title: '查看'
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
          //url:this.listUrl,
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }
        this.setTableData();
        this.getAuditMsg()//获取审核意见
      },

      //获取审核意见
      getAuditMsg() {
        let holidayListTitle = {
          ajaxSuccess: (res) => {
            console.log(res);
            let data = res.data;
            this.reviewMessList = data || [];
          },
          ajaxParams: {
            url: api.getReviewMess.path,
            params: {stateId: this.operailityData.stateId}
          }
        }
        this.ajax(holidayListTitle);
      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        this.tableData1 = [];
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = responseData.totalCount || 0;
      },

      setTableData(params) {
        this.setAjaxParams();
        this.ajax(this.listMessTitle);
      },

      //设置提交的参数
      setAjaxParams() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params, this.formValidate);
      },
      /*
           * 点击--修改角色--按钮
           * @param index string|number  当前行索引
           * */
      show(index) {
        this.editOperailityData = this.tableData1[index];
        this.openModel('show')
      },
      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      audit(index) {
        this.editOperailityData = this.tableData1[index];
        this.openModel('audit')
      },

      publish(rowData) {
        this.modifyStateIssuedData.data = {
          weekSetId: rowData.weekSetId,
          outlineId: rowData.outlineId,
          researchSectionId: rowData.courseTeachingResearchRoom,
        }
        this.openModel('modifyState')
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
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    components: {
      audit, calendar,
    }
  }
</script>

