<!----------------------------------
****--周历列表(calendar_list)
****--@date     2014-04-12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">

    <div class="listUpAreaBox">
      <div class="listUpArea-menus">
        <!--表格数据操作按钮-->
        <div class="ivu-row">
          <div class="ivu-col ivu-col-span-24">
            <el-button class="but-col" @click="add" type="primary">新 建</el-button>
            <el-button @click="remove" type="danger">删除</el-button>
          </div>
        </div>
      </div>
      <!--<div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          &lt;!&ndash;右侧查询&ndash;&gt;
          <el-form ref="formValidate"  :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px" >
            <div class="listUpArea-searchLeft">
              <el-input placeholder="请输入内容" v-model="formValidate.name">
                <div slot="prepend">节日名称</div>
                <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
              </el-input>
            </div>
            <div class="listUpArea-moreSearch">
              <el-button @click="showMoreSearch" type="text">高级查询</el-button>
            </div>
          </el-form>
        </div>
      </div>-->
    </div>
    <div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox">

    </div>
    <br/>
    <div>
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          align="center"
          :height="dynamicHt"
          :data="tableData1"
          stripe
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange">

          <el-table-column
            label="序号"
            prop="index"
            width="65">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column label="操作" width="350" align="center">
            <template scope="scope">
              <el-button
                size="small"
                @click="show(scope.$index,scope.row)">查看
              </el-button>
              <el-button v-if="scope.row.weekSetState=='NO_SUBMIT'" size="small" @click="edit(scope.$index, scope.row)">
                修改
              </el-button>
              <el-button v-if="scope.row.weekSetState=='RELEASE'" size="small" @click="derive(scope.row.weekSetId)">导出周历
              </el-button>
              <el-button v-if="scope.row.weekSetState=='RELEASE'" size="small"
                         @click="deriveCourse(scope.row.weekSetId)">导出课程表
              </el-button>
              <!--<el-button v-if="scope.row.weekSetState=='NO_SUBMIT'" size="small" @click="reported(scope.$index, scope.row)" type="primary">上报</el-button>-->
              <!--<el-button v-if="scope.row.weekSetState=='NO_ISSUED'" size="small" @click="noReported(scope.$index, scope.row)" type="primary">取消上报</el-button>-->
              <el-button v-if="scope.row.weekSetState=='NO_RELEASE'" size="small" @click="publish(scope.$index)"
                         type="primary">发布
              </el-button>
              <el-button v-if="scope.row.weekSetState=='RELEASE'" size="small" @click="unpublish(scope.$index)"
                         type="danger">取消发布
              </el-button>
              <el-button v-if="scope.row.weekSetState=='NO_SUBMIT'" size="small"
                         @click="modifyStateIssued(scope.$index)" type="primary">发送
              </el-button>
              <el-button v-if="scope.row.weekSetState=='NO_RELEASE'" size="small" @click="cancelIssued(scope.$index)"
                         type="danger">取消发送
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="weekSetName"
            label="周历名称"
            width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="schoolName"
            label="学校"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="gradeNum"
            label="年级"
            width="80">
          </el-table-column>
          <el-table-column
            prop="classNum"
            label="班级"
            width="250"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="semester"
            label="学期"
            width="120">
            <template scope="scope">
              {{scope.row.semester == 'ONE' ? `一学期` : ``}}
              {{scope.row.semester == 'TWO' ? `二学期` : ``}}
            </template>
          </el-table-column>
          <el-table-column
            prop="startWeekSetYear"
            label="学期开始时间"
            width="120"
          >
            <template scope="scope">
              {{scope.row.startEndWeekSetTime && scope.row.startEndWeekSetTime.split('至')[0]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="endWeekSetYear"
            label="学期结束时间"
            width="120">
            <template scope="scope">
              {{scope.row.startEndWeekSetTime && scope.row.startEndWeekSetTime.split('至')[1]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="weekSetState"
            label="状态"
            width="120"
          >
            <template scope="scope">
              {{scope.row.weekSetState == 'NO_SUBMIT' ? `未发送` : ``}}
              {{scope.row.weekSetState == 'NO_RELEASE' ? `已发送未发布` : ``}}
              {{scope.row.weekSetState == 'RELEASE' ? `已发布` : ``}}
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
    <!--修改弹窗-->
    <Modal
      :mask-closable="false"
      v-model="editModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="900">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="editId"></modal-header>
      <add v-if="editModal" @cancel="cancel" @refresh="refresh" @edit="subCallback"
           :edit-operaility-data="editOperailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--增加弹窗-->
    <Modal
      :mask-closable="false"
      v-model="addModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="900">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @refresh="refresh" @add="subCallback"></add>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="900"
    >
      <modal-header slot="header" :content="showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--删除弹窗-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--发布周历-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="publishModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="publishId"></modal-header>
      <operate v-if="publishModal" :type="'publish'" :operate-data="publishData" @operate="subCallback" @cancel="cancel"
               :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!--取消发布周历-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="unpublishModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="unpublishId"></modal-header>
      <operate v-if="unpublishModal" :type="'unpublish'" :operate-data="unpublishData" @operate="subCallback"
               @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!--下发周历-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="modifyStateIssuedModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="modifyStateIssuedId"></modal-header>
      <send v-if="modifyStateIssuedModal" title="发送" :type="'modifyStateIssued'"
            :operate-data="modifyStateIssuedData" :url="url" @operate="subCallback" @cancel="cancel"
            :operaility-data="operailityData"></send>
      <div slot="footer"></div>
    </Modal>
    <!--取消下发周历-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="cancelIssuedModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="cancelIssuedId"></modal-header>
      <operate v-if="cancelIssuedModal" title="取消发送" :type="'cancelIssued'" :operate-data="cancelIssuedData"
               @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>

    <!--上报周历-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="reportedModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="reportedId"></modal-header>
      <operate v-if="reportedModal" :type="'reported'" :operateUrl="url.modifySubmit.path" @operate="subCallback"
               @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>

    <!--上报周历-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="noReportedModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="noReportedId"></modal-header>
      <operate v-if="noReportedModal" :type="'noReported'" :operateUrl="url.modifyNoSubmit.path" @operate="subCallback"
               @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!--导出周历弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="deriveModal"
      title="对话框标题"
      :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <derive v-if="deriveModal" type="derive" messTitle="确定要导出周历吗？" :url="deriveUrl"
              @cancel="cancel"></derive>
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
  //引入--审查--组件
  import edit from './calendar_edit.vue';

  //引入--查看--组件
  import show from './calendar_view.vue';
  //引入--添加--组件
  import add from './calendar_add.vue';
  //引入--发送--组件
  import send from './calendar_send.vue';
  //引入当前组件字典api
  import api from '../api.js';

  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        url: api,
        //查询表单
        deleteUrl: '/' + api.delete,
        formValidate: {
          holidayName: '',
          roleId: '',
          status: ''
        },

        /*--按钮button--*/
        addId: {
          id: 'add',
          title: '添加'
        },
        removeId: {
          id: 'remove',
          title: '删除'
        },
        editId: {
          id: 'edit',
          title: '修改'
        },
        showId: {
          id: 'auditId',
          title: '查看'
        },
        publishId: {
          id: 'forbidden',
          title: '发布周历'
        },
        unpublishId: {
          id: 'startUsing',
          title: '取消发布周历'
        },
        modifyStateIssuedId: {
          id: 'forbidden',
          title: '发送周历'
        },
        cancelIssuedId: {
          id: 'startUsing',
          title: '取消发送周历'
        },
        reportedId: {
          id: 'reportedId',
          title: '提交周历'
        },
        noReportedId: {
          id: 'noReportedId',
          title: '取消提交周历'
        },

        //周历下发
        modifyStateIssuedModal: false,
        modifyStateIssuedData: {
          url: '/' + api.modifyStateIssued.path,
        },
        //取消周历下发
        cancelIssuedModal: false,
        cancelIssuedData: {
          url: '/' + api.cancelIssued.path,
        },

        //周历发布
        publishModal: false,
        publishData: {
          url: '/' + api.publish.path + '_release',
        },
        //取消周历发布
        unpublishModal: false,
        unpublishData: {
          url: '/' + api.publish.path + '_norelease',
        },

        //导出
        deriveUrl: '',
        deriveModal: false,
        deriveId: {id: 'deriveId', title: '导出周历'},
        //导出
        deriveCourseUrl: '',
        deriveCourseModal: false,
        deriveCourseId: {id: 'deriveCourseId', title: '导出课程表'},

        //上报
        reportedModal: false,
        noReportedModal: false,
        editOperailityData: '',
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
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
            "weekSetState":""
          }*/
        ],
        loading: false,
        listTotal: 0,
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '/' + api.list.path,
            params: {
              schoolName: '',
              gradeNum: '',
              classNum: '',
              semester: '',
              weekSetYear: '',
              sortby: '',
              order: '',
            }
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }

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

      refreshList () {
        this.setTableData();
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
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
          this.showMess('只能修改一条数据!')
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;
        this.tableData1 = [];
        data = this.addIndex(data);
        for (var i = 0; i < data.length; i++) {
          data[i].id = data[i].weekSetId
        }
        this.tableData1 = data;
        this.listTotal = responseData.totalCount || 0;
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.formValidate, this.queryQptions.params);
        this.ajax(this.listMessTitle);
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('提交成功!');
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      /*--点击--添加--按钮--*/
      add () {
        this.openModel('add');
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
      show (index) {
        this.operailityData = this.tableData1[index];
        this.showModal = true;
      },

      //上报周历
      reported (index) {
        this.operailityData = this.tableData1[index];
        this.reportedModal = true;
      },

      //取消上报
      noReported (index) {
        this.operailityData = this.tableData1[index];
        this.noReportedModal = true;
      },

      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit (index) {
        if (typeof index == 'undefined') {
          if (!this.isSelected(true)) return;
          this.editOperailityData = this.multipleSelection[0];
          this.openModel('edit')
        } else {
          this.editOperailityData = this.tableData1[index];
          this.openModel('edit')
        }
      },

      //发布周历
      publish (index) {
        this.operailityData = {id: this.tableData1[index].weekSetId};
        this.openModel('publish');
      },

      //取消发布周历
      unpublish (index) {
        this.operailityData = {id: this.tableData1[index].weekSetId};
        this.openModel('unpublish');
      },

      //周历下发
      modifyStateIssued (index) {
        this.operailityData = {id: this.tableData1[index].weekSetId};
        this.openModel('modifyStateIssued');
      },

      //取消周历下发
      cancelIssued (index) {
        this.operailityData = {id: this.tableData1[index].weekSetId};
        this.openModel('cancelIssued');
      },

      /*--点击--导出--按钮--*/
      derive (weekSetId) {
        this.deriveUrl = '/api/' + this.url.exportWeekSetExcel.path + '?' + Util.serializeParams({weekSetId: weekSetId});
        this.openModel('derive');
      },
      /*--点击--导出--按钮--*/
      deriveCourse(weekSetId) {
        this.deriveCourseUrl = '/api/' + this.url.exportCourseTable.path + '?' + Util.serializeParams({weekSetId: weekSetId});
        this.openModel('deriveCourse');
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

      refresh() {
        this.setTableData();
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
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
      })
    },
    components: {
      //当前组件引入的子组件
      edit, add, show, send
    }

  }
</script>

