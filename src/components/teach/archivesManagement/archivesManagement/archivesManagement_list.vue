<!--档案管理-->
<template>
  <div style="height: 100%">
    <layout-tree>
      <left-tree slot="left" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" @tree-remove-node="treeRemoveNode"
                 :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
      <div id="content" ref="content" slot="right">
        <div class="listUpAreaBox">
          <div class="listUpArea-menus">
            <!--表格数据操作按钮-->
            <div class="ivu-row">
              <!--<div class="ivu-col ivu-col-span-24">-->
              <!--<el-button type="primary" @click="exportData">导出档案到word</el-button>-->
              <!--</div>-->
            </div>
          </div>
          <div class="listUpArea-search">
            <div class="listUpArea-searchWrapper">
              <!--右侧查询-->
              <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin"
                       label-width="60px">
                <div class="listUpArea-searchLeft">
                  <el-input placeholder="请输入内容" v-model="formValidate.name">
                    <div slot="prepend">姓名</div>
                    <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
                  </el-input>
                </div>
                <div class="listUpArea-moreSearch">
                  <el-button @click="showMoreSearch" type="text">高级查询</el-button>
                </div>
              </el-form>
            </div>
          </div>
        </div>
        <br/>
        <!--表格数据-->
        <div id="myTable" ref="myTable">
          <el-table
            align="center"
            :height="dynamicHt"
            :context="self"
            :data="tableData1"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="序号"
              prop="index">
              <!--<template scope="scope">-->
              <!--<span>{{scope.row.index}}</span>-->
              <!--</template>-->
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="140"
            >
              <template scope="scope">
                <el-button
                  size="small"
                  @click="show(scope.$index)">查看
                </el-button>
                <el-button
                  size="small"
                  @click="edit(scope.$index)">修改
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              align="center">
            </el-table-column>
            <el-table-column
              prop="sex"
              label="性别"
              align="center"
              width="80"
              show-overflow-tooltip>
              <template scope="scope">
                {{ scope.row.sex | typeText }}
              </template>
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="手机号"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              show-overflow-tooltip>
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
              :total="listTotal">
            </el-pagination>
          </div>
        </div>
        <!--修改角色弹窗-->
        <Modal
          :mask-closable="false"
          v-model="editModal"
          height="200"
          title="对话框标题"
          class-name="vertical-center-modal"
          :width="1100">
          <modal-header slot="header" :content="editId"></modal-header>
          <!--<edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>-->
          <template v-if="editModal">
            <!-- 本科生查看 -->
            <bks-edit v-if="showUserType === 'BKS'" @cancel="cancel" @edit="subCallback"
                      :operaility-data="operailityData"></bks-edit>
            <!-- 进修生查看 -->
            <jxs-edit v-else-if="showUserType === 'JXS'" @cancel="cancel" @edit="subCallback"
                      :operaility-data="operailityData"></jxs-edit>
            <!-- 实习生查看 -->
            <sxs-edit v-else-if="showUserType === 'SXS'" @cancel="cancel" @edit="subCallback"
                      :operaility-data="operailityData"></sxs-edit>
            <!-- 研究生查看 -->
            <yjs-edit v-else-if="showUserType === 'YJS'" @cancel="cancel" @edit="subCallback"
                      :operaility-data="operailityData"></yjs-edit>
            <!-- 住院医查看 -->
            <zyy-edit v-else-if="showUserType === 'ZYY'" @cancel="cancel" @edit="subCallback"
                      :operaility-data="operailityData"></zyy-edit>
            <!-- 其他人员查看 -->
            <other-edit v-else @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></other-edit>
          </template>
          <div slot="footer"></div>
        </Modal>
        <!--导出档案到word-->
        <Modal
          :mask-closable="false"
          width="1000"
          v-model="exportModal"
          title="对话框标题"
          class-name="vertical-center-modal"
          :loading="loading">
          <modal-header slot="header" :content="exportId"></modal-header>
          <ept-archives v-if="exportModal" @cancel="cancel" @export="subCallback"
                        :operaility-data="operailityData"></ept-archives>
          <div slot="footer"></div>
        </Modal>
        <!--查看档案管理弹窗-->
        <Modal
          :mask-closable="false"
          :width="1100"
          v-model="showModal"
          title="查看"
          class-name="vertical-center-modal"
          :loading="loading">
          <modal-header slot="header" :content="viewId"></modal-header>
          <template v-if="showModal">
            <!-- 本科生查看 -->
            <bks-show v-if="showUserType === 'BKS'" :operaility-data="operailityData" :byFilter="byFilter"></bks-show>
            <!-- 进修生查看 -->
            <jxs-show v-else-if="showUserType === 'JXS'" :operaility-data="operailityData"
                      :byFilter="byFilter"></jxs-show>
            <!-- 实习生查看 -->
            <sxs-show v-else-if="showUserType === 'SXS'" :operaility-data="operailityData"
                      :byFilter="byFilter"></sxs-show>
            <!-- 研究生查看 -->
            <yjs-show v-else-if="showUserType === 'YJS'" :operaility-data="operailityData"
                      :byFilter="byFilter"></yjs-show>
            <!-- 住院医查看 -->
            <zyy-show v-else-if="showUserType === 'ZYY'" :operaility-data="operailityData"
                      :byFilter="byFilter"></zyy-show>
            <!-- 其他人员查看 -->
            <other-show v-else :operaility-data="operailityData" :byFilter="byFilter"></other-show>
          </template>
          <div slot="footer"></div>
        </Modal>

      </div>
    </layout-tree>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--导出档案到word--组件
  import eptArchives from "./archivesManagement_export.vue";
  //引入--修改--组件
  // import edit from "./archivesManagement_edit.vue";
  import otherEdit from "../../../base/sysManage/departmentStaff/departmentStaff_edit"; // 其他人员
  import bksEdit from "../../../educationManagement/EnrollEnroll/bksPersonnelManagement/bksPersonnelManagement_edit"; // 本科生
  import jxsEdit from "../../../educationManagement/EnrollEnroll/jxsPersonnelManagement/jxsPersonnelManagement_edit"; // 进修生
  import sxsEdit from '../../../intern/recruitStudent/usersManagement/usersManagement_edit'; // 实习生
  import yjsEdit from "../../../postgraduate/ptEnrollEnroll/yjsPersonnelManagement/yjsPersonnelManagement_edit"; // 研究生
  import zyyEdit from '../../../zyy/rdyEnrollEnroll/rdyPersonnelManagement/rdyPersonnelManagement_edit'; // 住院医
  //引入--查看--组件
  import otherShow from "../../../base/sysManage/departmentStaff/departmentStaff_view.vue"; // 其他人员
  import bksShow from "../../../educationManagement/EnrollEnroll/bksPersonnelManagement/bksPersonnelManagement_view"; // 本科生
  import jxsShow from "../../../educationManagement/EnrollEnroll/jxsPersonnelManagement/jxsPersonnelManagement_view"; // 进修生
  import sxsShow from '../../../intern/recruitStudent/usersManagement/usersManagement_view.vue'; // 实习生
  import yjsShow from "../../../postgraduate/ptEnrollEnroll/yjsPersonnelManagement/yjsPersonnelManagement_view"; // 研究生
  import zyyShow from '../../../zyy/rdyEnrollEnroll/rdyPersonnelManagement/rdyPersonnelManagement_view.vue'; // 住院医
  //  import zyyShow from '../../../'; // 住院医
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        byFilter: false,
        showUserType: 'PYTH', // 查看用户类型
        //查询
        formValidate: {
          name: '',
        },
        //左侧
        theme1: 'light',
        //默认请求数据
        listUrl: 'role/list?name=&identify=&type=',
        exportModal: false,
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [],
        loading: false,
        listTotal: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          type: 'edit',
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: "/archives/list",
            params: {
              name: ""
            }
          }
        },
        /*--按钮button--*/
        viewId: {
          id: 'viewId',
          title: '查看'
        },
        editId: {
          id: 'editId',
          title: '修改'
        },
        exportId: {id: 'exportId', title: '导出档案到word'},

        //tree默认项设置
        deptId: '',
        treeDefaults: {
          getDataUrl: '',
          isShowMenus: false,
        },
        fromWhereTree: "user",

      }
    },
    created() {
      this.init();
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        /*//初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);*/
      })
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
//        this.setTableData();
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


      //查询调用方法
      handleSubmit(name) {
        this.setTableData();
      },


      //通过get请求列表数据并渲染表格数据
      updateListData(responseData) {
        let data = responseData.data;
        this.tableData1 = [];
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = responseData.totalCount || 0;
      },


      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {

      },


      /*--点击--导出--按钮--*/
      exportData() {
        this.openModel('export');
      },


      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(index) {
        if (typeof index == 'undefined') {
          //if(!this.isSelected(true)) return;
          this.operailityData = this.multipleSelection[0];
          this.openModel('edit')
        } else {
          this.operailityData = this.tableData1[index];
          this.openModel('edit')
        }
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index) {
        this.operailityData = this.tableData1[index];
        this.openModel('show');
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(target) {
        this[target + 'Modal'] = false;
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


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        myData.type = data.type.join(",");
        return myData;
      },


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

        /*if(node.isLeaf){  //当前是否为叶子节点
         alert("====")
         }else {

         }*/
        this.setTreeDepId(obj.id);
        this.showTreeList(obj.id);
        this.showUserType = obj.types.toLocaleUpperCase();
      },

      //初始化加载列表数据
      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params, this.formValidate);
        this.postParamToServer(this.listMessTitle);
      },


      //向服务器发送数据
      postParamToServer(options) {
        if (this.deptId != "") {
          options["ajaxParams"]["params"]["deptId"] = this.deptId;
        }
        this.ajax(options);
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
        let params = Util._.defaultsDeep({}, this.queryQptions, {deptId: id});
        let listMessTitle = Util._.defaultsDeep({}, this.listMessTitle);
        listMessTitle.ajaxParams["params"]["deptId"] = id;
        this.postParamToServer(listMessTitle);
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
        this.deptId = id;
        this.setTableData();
      },

    },
    components: {
      //当前组件引入的子组件
      otherShow, bksShow, jxsShow, zyyShow, yjsShow, sxsShow,
      otherEdit, bksEdit, jxsEdit, zyyEdit, yjsEdit, sxsEdit,
      // edit,
      eptArchives
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
  }
</script>
