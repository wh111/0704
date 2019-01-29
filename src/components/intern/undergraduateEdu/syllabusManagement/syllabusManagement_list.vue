<!----------------------------------
****--课程表管理(syllabusManagement_list)
****--@date     2017/6/17
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">


    <div
      id="myTable"
      ref="myTable"
    >
      <el-table
        align="center"
        :height="dynamicHt"
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
          width="200">
          <template scope="scope">
            <el-button size="small" type="primary" @click="show(scope.$index, scope.row)">查看
            </el-button>
            <el-button :disabled="scope.row.state !=1" size="small" type="primary"
                       @click="edit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button v-if="scope.row.state ==1" size="small" @click="publish(scope.row)" type="primary">下发
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="schoolName"
          label="学校"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="gradeNum"
          label="年级"
          align="center"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="classNumNames"
          label="班级"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="startWeekSetYear"
          label="开始年度"
          align="center"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="endWeekSetYear"
          label="结束年度"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="semester"
          label="学期"
          align="center"
          show-overflow-tooltip
          width="100">
          <template scope="scope">
            {{scope.row.semester == 'ONE' ? '一学期' : '二学期'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="startEndWeekSetTime"
          label="起止时间"
          align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="填报时间"
          align="center"
          width="140">
        </el-table-column>
        <el-table-column
          prop="whetherArrangedCourse"
          label="状态"
          align="center"
          width="100">
          <template scope="scope">
            {{scope.row.state == '1' ? '未下发' : '已下发'}}
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
      <!--修改弹窗-->
      <Modal
        :mask-closable="false"
        v-model="editModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="1100">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="editId"></modal-header>
        <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :edit-operaility-data="editOperailityData"></edit>
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
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="showId"></modal-header>
        <edit v-if="showModal" whereFrom="show" @cancel="showModal=false"
              :edit-operaility-data="editOperailityData"></edit>
        <div slot="footer"></div>
      </Modal>
      <!--下发周历-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="modifyStateModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="500">
        <modal-header slot="header" :content="modifyStateId"></modal-header>
        <send v-if="modifyStateModal" title="下发" :type="'modifyState'"
              :operate-data="modifyStateIssuedData" @operate="subCallback" @cancel="cancel"
              :operaility-data="editOperailityData" :url="api"></send>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  //引入--修改--组件
  import edit from './syllabusManagement_edit.vue';
  //引入当前组件字典api
  import api from '../api.js';
  import send from './syllabusManagement_send.vue'
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        api,
        editOperailityData: '',
        //列表查询
        formValidate: {},
        dynamicHt: 100,
        self: this,
        tableData1: [],
        loading: false,
        showModal: false,
        modifyStateModal: false,
        listTotal: 0,
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.manageWeekSetTimeTables.path,
            params: {
              schoolName: '',
              gradeNum: '',
              classNum: '',
              semester: '',
              weekSetYear: '',
              sortby: '',
              order: '',
              whetherArrangedCourse: '',
              type: 'two',
            }
          }
        },
        modifyStateIssuedData: {
          url: api.modifyIssued.path,
          data: {
            weekSetId: '',
            outlineId: '',
            researchSectionId: '',
          },
        },
        editId: {
          id: 'edit',
          title: '修改'
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
      edit(index) {
        this.editOperailityData = this.tableData1[index];
        this.openModel('edit')
      },
      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      show(index) {
        this.editOperailityData = this.tableData1[index];
        this.openModel('show')
      },
      publish(rowData) {
//        this.editOperailityData = rowData;
        console.log(rowData);
        this.modifyStateIssuedData.data = {
          weekSetId: rowData.weekSetId,
          outlineId: rowData.outlineId,
          researchSectionId: rowData.courseTeachingResearchRoom,
          teachingResearchRoomId: rowData.courseTeachingResearchRoom,
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
      edit, send
    }
  }
</script>

