<!---房间信息管理--->
<template>
  <div id="content" ref="content" class="modal">
    <steps></steps>
    <el-form :model="formValidate" ref="formValidate" :rules="rules.roomMessList" label-width="100px">
      <el-row>
        <el-col :span="10">
          <el-button type="primary" @click="add">添加</el-button>
          <el-button type="primary" @click="batchAdd">批量添加</el-button>
          <el-button type="primary" @click="selectBuild">导入</el-button>
          <el-button type="danger" @click="remove">删除</el-button>
        </el-col>
        <el-col :span="14" align="right">
          <el-form-item prop="buildingName">
            <input class="hidden">
            <el-input v-model="formValidate.buildingName" placeholder="输入大楼名称搜索">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!--列表操作按钮-->
    <div style="margin-bottom: 20px;">

    </div>
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
            width="100">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="160">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
              <el-button size="small" @click="edit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="buildingName"
            label="大楼名称"
            show-overflow-tooltip
            width="200">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="sex"
            label="房间类别"
          >
            <template scope="scope">
              {{scope.row.sex | roomSex}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="no"
            label="房间号"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bedNum"
            label="床位数"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="remark"
            label="备注">

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
      close-on-click-modal="false"
      width="1000"
      v-model="addModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" :rules="rules" @add="subCallback" :operaility-data="operailityData"
           :url="url"></add>
      <div slot="footer"></div>
    </Modal>
    <!--批量新建-->
    <Modal
      close-on-click-modal="false"
      width="1000"
      v-model="batchAddModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="batchAddId"></modal-header>
      <batch-add v-if="batchAddModal" @cancel="cancel" :rules="rules" @batchAdd="subCallback"
                 :operaility-data="operailityData" :url="url"></batch-add>
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
      <edit v-if="editModal" @cancel="cancel" :rules="rules" @edit="subCallback" :operaility-data="operailityData"
            :url="url"></edit>
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
      <remove v-if="removeModal" :delete-url="url.roomRemove" @remove="subCallback" @cancel="cancel"
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
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></show>
      <div slot="footer"></div>
    </Modal>

    <!--选择大楼弹窗-->
    <Modal
      width="500"
      v-model="selectBuildModal"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="selectBuildId"></modal-header>
      <selectBuild v-if="selectBuildModal" @cancel="cancel" :rules="rules" @selectBuild="selectBuildCallback"
                   :operaility-data="operailityData" :url="url"></selectBuild>
      <div slot="footer"></div>
    </Modal>

    <!--导入弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="toChannelModal"
           class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="toChannelId"></modal-header>
      <toChannel v-if="toChannelModal" @toChannel="subCallback" :url="url" @cancel="cancel"
                 :selectBuildData="selectBuildData"
                 :operaility-data="operailityData"></toChannel>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../app'
  //引入--新建--组件
  import add from "./roomMess_add.vue";
  //引入--新建--组件
  import batchAdd from "./roomMess_batchAdd.vue";
  //引入--修改--组件
  import edit from "./roomMess_edit.vue";
  //引入--查看--组件
  import show from "./roomMess_view.vue";
  //导入房间
  import toChannel from './roomMess_toChannel.vue'
  //选择大楼
  import selectBuild from './roomMess_selectBuild.vue'
  //引入--验证--组件
  import rules from "../rules.js";
  import steps from '../dormitory_common/steps.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        rules: rules,
        url: url,
        //查询表单
        listUrl: '/role/list?name=&identify=&type=',
        deleteUrl: '/role/remove',
        formValidate: {
          buildingName: '',       //大楼名称模糊检索
          sortby: '',//排序列
          order: ''     //升序、降序
        },
        selectBuildData: {},
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        loading: false,
        totalCount: 0,
        batchAddModal: false,
        toChannelModal: false,
        selectBuildModal: false,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.roomListPage,
            params: {}
          }
        },
        /*--按钮button--*/
        addId: {id: 'addId', title: '新建'},
        toChannelId: {id: 'toChannelId', title: '新建'},
        selectBuildId: {id: 'selectBuildId', title: '选择大楼'},
        editId: {id: 'editId', title: '修改'},
        removeId: {id: 'removeId', title: '删除'},
        viewId: {id: 'viewId', title: '查看'},
        batchAddId: {id: 'batchAddId', title: '批量添加'},

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
        this.openModel("add");
      },

      /*--点击--批量添加--按钮--*/
      batchAdd() {
        this.openModel("batchAdd");
      },


      /*--点击--修改--按钮--*/
      edit(data) {
        this.operailityData = data;
        this.openModel("edit");
      },
      /*--点击--删除--按钮--*/
      remove() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = data;
        this.openModel("show");
      },

      //导入房间
      toChannel() {
        this.openModel("toChannel");
      },


      //导入先选择大楼
      selectBuild() {
        this.openModel("selectBuild");
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


      //选择大楼的回调函数
      selectBuildCallback(item) {
        this.selectBuildData = item;
        this.cancel('selectBuild');
        this.toChannel() // 打开导入弹窗
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
      add, edit, show, batchAdd, steps, toChannel, selectBuild
    }
  }
</script>
