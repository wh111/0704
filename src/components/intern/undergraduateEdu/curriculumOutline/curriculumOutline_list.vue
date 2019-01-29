<!----------------------------------
****--@name     课程大纲
****--@role     ${*}
****--@date     2018/7/8
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="80px">
      <el-row style="margin-bottom:0">
        <el-col :span="8">
          <el-button class="but-col" @click="add" type="primary">新 建</el-button>
          <!--<el-button @click="remove" type="danger">删除</el-button>-->
        </el-col>
        <!--搜索项-->
        <el-col :span="16" align="right">
          <el-form-item label="大纲状态:">
            <el-select v-model="formValidate.outlineState" style="width: 120px" placeholder="请选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="0"></el-option>
              <el-option label="禁用" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          align="center"
          :height="dynamicHt"
          :data="tableData"
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
          <el-table-column label="操作" width="300" align="center">
            <template scope="scope">
              <el-button
                size="small"
                type="info"
                @click="show(scope.row)">查看
              </el-button>
              <el-button
                :disabled="scope.row.outlineState!='0'"
                size="small"
                type="primary"
                @click="edit(scope.row)">修改
              </el-button>
              <el-button
                :disabled="scope.row.outlineState!='0'"
                size="small"
                type="warning"
                @click="copy(scope.row)">复制
              </el-button>
              <el-button type="danger" v-if="scope.row.outlineState=='0'" size="small" @click="disable( scope.row)">
                禁用
              </el-button>
              <el-button type="success" v-else size="small" @click="enable(scope.row)">
                启用
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="outlineName"
            label="大纲名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="schoolName"
            label="学校"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="outlineState"
            label="状态"
            show-overflow-tooltip>
            <template scope="scope">
              {{scope.row.outlineState == '0' ? '启用' : '禁用'}}
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
      <addOrEdit v-if="editModal" @cancel="cancel" @edit="subCallback"
                 :operaility-data="editOperailityData"></addOrEdit>
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
      <addOrEdit v-if="addModal" @cancel="cancel" @add="subCallback"></addOrEdit>
      <div slot="footer"></div>
    </Modal>
    <!--复制弹窗-->
    <Modal
      :mask-closable="false"
      v-model="copyModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="900">
      <modal-header slot="header" :content="copyId"></modal-header>
      <addOrEdit v-if="copyModal" type="copy" @cancel="cancel" @copy="subCallback"
                 :operaility-data="editOperailityData"></addOrEdit>
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
    <!--禁用周历-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="disableModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="disableId"></modal-header>
      <operate v-if="disableModal" title="禁用" :type="'disable'"
               :operate-data="disableData" @operate="subCallback" @cancel="cancel"
               :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!--启用-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="enableModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="enableId"></modal-header>
      <operate v-if="enableModal" title="启用" :type="'enable'" :operate-data="enableData"
               @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  //引入--审查--组件
  import show from './curriculumOutline_view.vue';
  //引入--添加--组件
  import addOrEdit from './curriculumOutline_addOrEdit.vue';
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
          outlineState: '',
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
        copyId: {
          id: 'copyId',
          title: '复制'
        },
        disableId: {
          id: 'disableId',
          title: '禁用'
        },
        enableId: {
          id: 'enableId',
          title: '启用'
        },
        showId: {
          id: 'auditId',
          title: '查看'
        },
        tableData: [],

        //周历下发
        modifyStateIssuedModal: false,
        disableModal: false,//禁用
        enableModal: false,//启用
        copyModal: false,//启用
        enableData: {
          url: api.OutlineModifyState.path,
          data: {
            outlineId: '',
            outlineState: '0',
          }
        },
        disableData: {
          url: api.OutlineModifyState.path,
          data: {
            outlineId: '',
            outlineState: '1',
          }
        },
        //取消周历下发
        cancelIssuedModal: false,

        //上报
        reportedModal: false,
        noReportedModal: false,
        editOperailityData: '',
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        loading: false,
        listTotal: 0,
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.OutlineQuery.path,
            params: {}
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
          data[i].id = data[i].weekSetId;
        }
        this.tableData = data;
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

      searchEvent () {
        this.setTableData()
      },

      /*--点击--添加--按钮--*/
      add () {
        this.openModel('add');
      },
      /*--点击--复制--按钮--*/
      copy(rowData) {
        this.editOperailityData = rowData;
        this.openModel('copy');
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
      show (rowData) {
        this.operailityData = rowData;
        this.showModal = true;
      },

      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit (rowData) {
        this.editOperailityData = rowData;
        this.openModel('edit')
      },

      //禁用
      disable (rowData) {
        this.disableData.data.outlineId = rowData.outlineId
        this.openModel('disable');
      },

      //启用
      enable (rowData) {
        this.enableData.data.outlineId = rowData.outlineId
        this.openModel('enable');
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
      addOrEdit, show
    }

  }
</script>

