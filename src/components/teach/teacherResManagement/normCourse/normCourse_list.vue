<!-- 基础教务 - 资源库管理 - 标准课程 -->
<template>
  <layout-tree>
    <left-tree slot="left" :clickAddChange="clickAddChange" @setCurrSltNodeId="setTreeDepId" @clickAdd="handleAdd" @tree-click="treeClick" @tree-remove-node="treeRemoveNode" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
    <div slot="right" id="content" ref="content" class="modal">
      <div class="listUpAreaBox">
        <div class="listUpArea-menus">
          <div class="add-remove">
            <el-button class="but-col" @click="add" type="info">创建标准课程</el-button>
            <el-button class="but-col" @click="examine" :disabled="canTodo(['DSH','TESTRUN'])" type="success">审核标准课程</el-button>
            <el-button class="but-col" @click="testRun" type="primary">课程试运行</el-button>
            <el-button class="but-col" @click="exit" :disabled="canTodo(['RUN'])" type="danger">课程退出</el-button>
          </div>
        </div>
        <div class="listUpArea-search">
          <div class="listUpArea-searchWrapper">
            <!--右侧查询-->
            <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px">
              <div class="listUpArea-searchLeft">
                <input class="hidden">
                <el-input placeholder="请输入课程名称" v-model="formValidate.title">
                  <div slot="prepend">课程名称</div>
                  <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
                </el-input>
              </div>
              <!--<div class="listUpArea-moreSearch">-->
                <!--<el-button @click="showSearchMore" type="text">高级查询</el-button>-->
              <!--</div>-->
            </el-form>
          </div>
        </div>
      </div>
      <!--<div v-if="searchMore" class="listUpAreaMoreSearchBox" ref="searchMore">-->
        <!--<el-form :inline="true" align="right">-->
          <!--<el-form-item label="课程名称：">-->
            <!--<el-input v-model="formValidate.title"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-button type="info" @click="search">查询</el-button>-->
        <!--</el-form>-->
      <!--</div>-->
      <div id="myTable" ref="myTable" class="userDataTable">
        <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <!-- <el-table-column label="序号" prop="index" width="70">
          </el-table-column> -->
          <el-table-column label="操作" align="center" width="140">
            <template scope="scope">
              <el-button size="small" type="info" @click="show(scope.row)">查看
              </el-button>
              <el-button size="small" type="success" @click="edit(scope.row)" :disabled="canEdit(scope.row)">修改
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="课程名称" align="center" width="200"></el-table-column>
          <el-table-column prop="operator" label="创建人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="课程状态" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.status | courseStatus }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="auditStatus" label="审核状态" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.auditStatus | curriculum | typeText }}
            </template>
          </el-table-column> -->
          <el-table-column prop="totalLesson" label="课程节数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="创建日期" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新日期" show-overflow-tooltip>
            <template scope="scope">
              {{ (scope.row.updateTime||'-') | formatDate('yyyy-MM-dd HH:mm:ss') }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin: 10px;" align="right">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
        </el-pagination>
      </div>
      <!--弹窗-->
      <div>
        <!--修改弹窗-->
        <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="1100">
          <modal-header slot="header" :content="headerContent.editId"></modal-header>
          <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :style="modelStyle"></edit>
          <div slot="footer" style="height: 44px"></div>
        </Modal>
        <!--增加弹窗-->
        <Modal :mask-closable="false" v-model="addModal" class-name="vertical-center-modal" :width="1100">
          <modal-header slot="header" :content="headerContent.addId"></modal-header>
          <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :style="modelStyle"></add>
          <div slot="footer" style="height: 44px"></div>
        </Modal>
        <!-- 查看弹窗 -->
        <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1100">
          <modal-header slot="header" :parent="self" :content="headerContent.showId"></modal-header>
          <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :lookUrl="'/criterionCourse/info/' + operailityData.id" :style="modelStyle"></show>
          <div slot="footer"></div>
        </Modal>
        <!--审核弹窗-->
        <Modal :mask-closable="false" v-model="examineModal" height="200" class-name="vertical-center-modal" :width="1100">
          <modal-header slot="header" :parent="self" :content="headerContent.examineId"></modal-header>
          <examine v-if="examineModal" @cancel="cancel" @examine="subCallback" :operaility-data="operailityData" :style="modelStyle"></examine>
            <div slot="footer" style="height:110px"></div>
        </Modal>
        <!--课程试运行弹窗-->
        <Modal :mask-closable="false" v-model="testRunModal" height="200" class-name="vertical-center-modal" :width="600">
          <modal-header slot="header" :parent="self" :content="headerContent.testRunId"></modal-header>
          <template v-if="testRunModal">
            <test-run-download v-if="operailityData.assessmentFileId" @cancel="cancel" @down="subCallback" :operaility-data="operailityData"></test-run-download>
            <test-run-upload v-else @cancel="cancel" @testRun="subCallback" :operaility-data="operailityData"></test-run-upload>
          </template>
          <div slot="footer"></div>
        </Modal>
        <!--退出课程弹窗-->
        <Modal :mask-closable="false" height="200" v-model="exitModal" title="对话框标题" class-name="vertical-center-modal" :width="500">
          <modal-header slot="header" :content="headerContent.exitId"></modal-header>
          <div v-if="exitModal">
            <div class="remove">课程“{{ operailityData.title }}”确定退出吗？</div>
            <el-row>
              <el-col :span="10" :offset="14">
                <el-button @click="exitSub" type="primary">确定</el-button>
                <el-button class="but-col" @click="cancel('exit')">取消</el-button>
              </el-col>
            </el-row>
          </div>
          <div slot="footer"></div>
        </Modal>
        <!--删除弹窗-->
        <!-- <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="removeModal" class-name="vertical-center-modal"
          :width="500">
          <modal-header slot="header" :content="removeId"></modal-header>
          <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
          <div slot="footer"></div>
        </Modal> -->
      </div>
    </div>
  </layout-tree>
</template>

<script>
  import api from './api';
  import treeApi from './treeApi';
  /*当前组件必要引入*/
  //引入--修改--组件
  import edit from "./normCourse_edit";
  //引入--查看--组件
  import show from "./normCourse_view";
  //引入--添加--组件
  import add from "./normCourse_add";
  //引入--审核--组件
  import examine from "./normCourse_examine";
  //引入--试运行--组件
  import testRunUpload from "./testRun/upload";
  import testRunDownload from "./testRun/download";

  import layoutTree from "../../../common/layoutTree";
  import leftTree from "./_tree/menu";

  //当前组件引入全局的util
  let Util = null;
  let store = null;
  export default {
    data() {
      return {
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: api.tree.path,
          getDataUrl: '',
          isShowMenus: false,
          isShowSearch: false,
        },
        fromWhereTree: "user",

        //查询表单
        deleteUrl: '/role/remove',
        formValidate: {
          title: '', // 课程名称
        },
        /*--按钮button--*/
        headerContent: {
          addId: {
            id: 'addId',
            title: '添加'
          },
          removeId: {
            id: 'removeId',
            title: '删除'
          },
          examineId: {
            id: 'examineId',
            title: '审核'
          },
          editId: {
            id: 'editId',
            title: '修改'
          },
          showId: {
            id: 'showId',
            title: '查看'
          },
          exitId: {
            id: "exitId",
            title: '课程退出'
          },
          testRunId: {
            id: "testRunId",
            title: '课程试运行'
          },
        },
        // 弹窗样式
        modelStyle: {
          height: '650px'
        },
        //点击add按钮,值发生改变
        clickAddChange: false,
        //当前tree选中的node id
        deptId: '',

        searchMore: false,
        examineModal: false,
        exitModal: false,
        testRunModal: false,

        operailityData: [],
        multipleSelection: [],
        dynamicHt: 100,
        tabHeight: 100,
        self: this,
        tableData: [],
        loading: false,
        listTotal: 0,

        //初始化加载页面信息
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.listPage.path,
            params: {}
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
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }
      },
      // 是否可进行操作
      canTodo(type) {
        let data = this.multipleSelection;
        if (data.length) {
          if (data.length !== 1) { // 只能操作一个
            return true
          }
          if (type.indexOf(data[0].status) < 0) {
            return true
          }
        }
        return false
      },
      // 是否可修改
      canEdit(row) {
        return ['DSH', 'RUN', 'TESTRUN'].indexOf(row.status) > -1
      },
      /*************************************** 表格相关 **********************************************/
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
        this.tabHeight = parHt - myTable.offsetTop - paginationHt;
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
          this.showMess("请选择课程!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能选择一条课程!")
          flag = false;
        }
        return flag;
      },


      //通过get请求列表数据并渲染表格数据
      updateListData(responseData) {
        let data = responseData.data;
        this.tableData = [];
        data = this.addIndex(data);
        this.tableData = data;
        this.listTotal = responseData.totalCount || 0;
      },


      //初始化加载列表数据
      setTableData() {
        this.setAjaxParams();
        this.postParamToServer();
      },

      //设置提交的参数
      setAjaxParams() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params,
          this.formValidate);
      },


      //向服务器发送数据
      postParamToServer() {
        let options = Util._.defaultsDeep({}, this.listMessTitle);
        if (this.deptId != "") {
          options["ajaxParams"]["params"]["typeId"] = this.deptId;
        }
        this.ajax(options);
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit() {
        this.setTableData();
      },

      /************************************** 按钮事件 ************************************************/
      // 添加
      add() {
        this.clickAddChange = !this.clickAddChange;
        // this.openModel('add');
      },

      // 添加
      handleAdd(isSltedTreeNode) {
        // if (!this.undistributedDep()) return;
        let isSltedTree = this.isSltedTree(isSltedTreeNode);
        if (isSltedTree) {
          this.operailityData = {
            deptId: this.deptId
          };
          this.openModel('add');
        } else {
          this.$message.error("请选择相应分类!")
        }
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
      show(row) {
        this.operailityData = row;
        this.openModel('show');
      },


      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(row) {
        this.operailityData = row;
        this.openModel('edit')
      },

      // 审核
      examine() {
        if (this.isSelected(true)) {
          this.operailityData = this.multipleSelection[0];
          this.openModel('examine')
        }
      },
      // 试运行
      testRun() {
        if (!this.isSelected(true)) return;
        this.operailityData = this.multipleSelection[0];
        this.openModel('testRun')
      },
      // 退出
      exit() {
        if (!this.isSelected(true)) return;
        this.operailityData = this.multipleSelection[0];
        this.openModel('exit')
      },
      // 课程退出
      exitSub() {
        this.ajax({
          ajaxSuccess: res => {
            this.setTableData();
            this.successMess('课程退出成功！');
            this.cancel('exit');
          },
          ajaxError: () => this.errorMess('课程退出失败！'),
          ajaxParams: {
            url: api.endOperation.path + this.operailityData.id,
            method: api.endOperation.method
          }
        })
      },

      // 搜索
      search() {
        this.setTableData();
      },

      // 高级搜索按钮
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          if (this.searchMore) {
            this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight;
          } else {
            this.tabHeight = this.dynamicHt
          }
        })
      },

      /*
       * 未分配可管理的部门
       * @return flag blooean
       * */
      undistributedDep() {
        return true
        let flag = true;
        if (this.deptId == "") {
          this.showMess("还没有给您分配部门管理员!暂无部门可管理!");
          flag = false;
        }
        return flag
      },

      /****************************************** 弹窗相关 ********************************************/
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

      /***************************************** 树相关 ***********************************************/
      /*
       * 左侧目录树节点click调用父组件方法
       *
       * @param obj {} 当前选中节点的一级数据
       *
       * @param node  {}  整个tree节点所有数据
       *
       * @param  self  {}  当前tree vue实例
       *
       * */
      treeClick(obj, node, self) {
        this.setTreeDepId(obj.id);
        this.showTreeList(obj.id);
      },


      /*
       * 删除目录树回调
       *
       * */
      treeRemoveNode() {
        this.setTreeDepId("");
        this.showTreeList("")
      },


      /*
       * 根据部门id查询当前部门的人员信息
       * @param id number 当前部门id
       * */
      showTreeList(id) {
        //初始化加载页面信息
        //        this.postParamToServer();
      },


      /*
       * 是否选择部门
       * @return flag blooean  是否选择目录树节点
       * */
      isSltedTree(isSltedTreeNode) {
        let flag = false;
        if (this.deptId != "" || isSltedTreeNode(this.treeClickInit)) {
          flag = true;
        }
        return flag;
      },


      /*
       *  初始化或者刷新数列表的时候  调用treeClick函数 为deptId赋值
       * */
      treeClickInit(obj) {
        this.treeClick(obj)
      },


      /*
       * 设置当前部门Id
       * */
      setTreeDepId(id) {
        if (id) {
          this.deptId = id;
          this.setTableData();
        }
      },
    },

    //初始化组件
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
      examine,
      // testRun,
      testRunUpload,
      testRunDownload,
      layoutTree,
      leftTree
    }

  }

</script>
<style lang="scss">
  .add-remove {
    margin-bottom: 20px;
  }

  .header {
    height: 30px;
    font-size: 18px;
    color: #ffffff;
  }

  .userDataTable {
    margin-top: 20px;
  }

  .listUpAreaMoreSearchBox {
    margin-top: 20px;
    .el-select .el-input {
      width: 100%;
    }
    &~.userDataTable {
      margin-top: 0;
    }
  }

</style>
