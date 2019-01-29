<!----------------------------------
****--@name     开题申请填写
****--@role     研究生
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form :model="formValidate" ref="formValidate" inline :rules="rules">
      <el-row>
        <el-col :span="8">
          <el-button :disabled="!updateSuccess" v-if="!isAgain" type="primary" @click="add">添加</el-button>
          <el-button :disabled="!updateSuccess" v-else type="primary" @click="add">再次开题</el-button>
          <el-button :disabled="style.delete" type="danger" @click="remove">删除</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="16" align="right">
          <el-form-item prop="thesisTitle" label="论文题目：">
            <el-input  v-model="formValidate.thesisTitle" placeholder="输入论文题目"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="searchEvent">{{ 'query' | sysLan }}</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>
        <!--高级搜索项-->
        <el-col v-show="searchMore" ref="searchMore" align="right">
          <el-form-item label="研究方向：" prop="researchDirection">
            <el-input v-model="formValidate.researchDirection" placeholder="输入研究方向"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select filterable v-model="formValidate.status" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="导师审核中" value="DSDSH"></el-option>
              <el-option label="导师审核驳回" value="DSBH"></el-option>
              <el-option label="教研室审核中" value="JYSDSH"></el-option>
              <el-option label="教研室审核驳回" value="JYSBH"></el-option>
              <el-option label="教育处审核中" value="JYCDSH"></el-option>
              <el-option label="教育处审核驳回" value="JYCBH"></el-option>
              <el-option label="通过" value="TG"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="searchEvent">{{ 'query' | sysLan }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

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
            width="100">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200">
            <template scope="scope">
              <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
              <el-button size="small" type="warning" :disabled="!['WSB','DSBH','JYSBH','JYCBH',''].includes(scope.row.status)"
                         @click="edit(scope.row)">修改
              </el-button>
              <el-button size="small" type="danger" :disabled="!['WSB','DSBH','JYSBH','JYCBH',''].includes(scope.row.status)"
                         @click="reported(scope.row)">上报
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="thesisTitle"
            label="论文题目">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="researchDirection"
            label="研究方向">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="name"
            label="申请人"
            width="200">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="studentId"
            label="学号">
          </el-table-column>
          <!--<el-table-column-->
          <!--show-overflow-tooltip-->
          <!--prop="boundary"-->
          <!--label="年级"-->
          <!--align="center">-->
          <!--</el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            prop="phone"
            label="手机号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="specialtyCode"
            label="专业代码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="specialtyName"
            label="专业方向">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="applicantType"
            width="150"
            label="开题状态">
            <template scope="scope">
              {{scope.row.applicantType | applicantType}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="status"
            label="状态">
            <template scope="scope">
              {{scope.row.status | typeText}}
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
    <!--新建-->
    <Modal
      :mask-closable="false"
      width="800"
      v-model="addModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :url="url" :isAgain="isAgain"></add>
      <div slot="footer"></div>
    </Modal>
    <!--修改-->
    <Modal
      :mask-closable="false"
      width="800"
      v-model="editModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :url="url"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--删除弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="url.applicationRemove.path" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>

      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      width="800"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :peport="peport" :operaility-data="operailityData" :url="url"></show>
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
      <operate v-if="reportedModal" :type="'reported'" :operateData="reportedData" @operate="subCallback" @cancel="cancel"
               :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!---->
  </div>
</template>
<script>
  import { proposalApplicationWriteList as rules } from '../rules';
  /*当前组件必要引入*/
  import url                                       from './api';
  //引入--新建--组件
  import add                                       from './proposalApplicationWrite_add.vue';
  //引入--修改--组件
  import edit                                      from './proposalApplicationWrite_edit.vue';
  //引入--查看--组件
  import show                                      from './proposalApplicationWrite_view.vue';

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['api', 'peport'],
    data () {
      return {
        rules,
        updateSuccess: false,
        isAgain: false,  // 是否是再次开题
        //查询表单
        listUrl: '/role/list?name=&identify=&type=',
        deleteUrl: '/role/remove',
        formValidate: {
          thesisTitle: '',       //论文题目
          researchDirection: '',//研究方向
          status: ''  //状态
        },
        reportedData: {
//          url:url.applicationReport.path,
          data: {
            status: 'DSDSH'
          }
        },
        style: {
          delete: false
        },
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        searchMore: false,
        reportedModal: false,
        loading: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
//            url:url.applicationList.path,
            params: {}
          }
        },
        /*--按钮button--*/
        addId: {id: 'addId', title: '新建'},
        editId: {id: 'editId', title: '修改'},
        removeId: {id: 'removeId', title: '删除'},
        viewId: {id: 'viewId', title: '查看'},
        reportedId: {id: 'reportedId', title: '上报'}
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        if (this.api) {
          this.url = this.api; // 开题报告填写
        } else {
          this.url = url;// 开题申请填写
        }
        this.reportedData.url = this.url.applicationReport.path;
        this.listMessTitle.ajaxParams.url = this.url.applicationList.path;

        Util = this.$util;
        //ajax请求参数设置
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
        this.style = {publish: false};
        for (let i = 0; i < val.length; i++) {
          let item = val[i];
          if (item.status != 'WSB') {
            this.style.delete = true;
          }
        }
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
          this.showMess('只能修改一条数据!');
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        this.tableData = this.addIndex(responseData.data || []);
        if (responseData.data.length != 0) {
          this.isAgain = true;
        }
        this.updateSuccess = true;
        this.totalCount = responseData.totalCount || 0;
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
      /*--点击--发布--按钮--*/
      reported (data) {
        this.operailityData = [data];
        this.openModel('reported');
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
      add, edit, show
    }
  };
</script>

