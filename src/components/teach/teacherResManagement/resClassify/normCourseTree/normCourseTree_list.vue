<!--
****--标准课程(normCourseTree_list)
****--@date     2017/8/4
****--@author   zyc<332533011@qq.com
-->
<template>
  <div ref="treeContent">
    <layout-tree :style="{'height':contenHeight + 'px'}">
      <left-tree slot="left" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" @tree-remove-node="treeRemoveNode" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
      <!-- 标准课程 -->
      <div slot="right" id="content" ref="content">
        <el-form :inline="true">
          <el-row style="padding-bottom:20px;">
            <el-col :span="14">
              <el-button type="primary" @click="add">新建</el-button>
              <el-button type="danger" @click="remove">删除</el-button>
            </el-col>
            <!-- 搜索框 -->
            <el-col :span="10" align="right">
              <el-input placeholder="名称" v-model="searchObj.name" style="width:300px;" :maxlength="20">
                <el-button slot="append" icon="search" @click="search"></el-button>
              </el-input>
              <!--<el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">筛选</el-button>-->
            </el-col>
          </el-row>
          <!-- 多条件 -->
          <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
            <el-form-item label="卡号:">
              <el-input v-model="searchObj.cardNum"></el-input>
            </el-form-item>
            <el-form-item label="申请时间:">
              <date-group :dateGroup="{text:'',startDate:searchObj.createTimeBegin,endDate:searchObj.createTimeEnd}">
                <el-date-picker name="start" v-model="searchObj.createTimeBegin" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0" @change="handleStartTime"></el-date-picker>
                <span>-</span>
                <el-date-picker name="end" v-model="searchObj.createTimeEnd" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime"></el-date-picker>
              </date-group>
            </el-form-item>
            <el-form-item style="margin-right:0;">
              <el-button @click="search" type="info">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
        <!-- 数据表格 -->
        <div ref="tableView">
          <el-table @selection-change="handleSelectionChange" align="center" :context="self" :height="tableHeight" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" prop="index" width="80"></el-table-column>
            <el-table-column label="操作" align="center" width="140">
              <template scope="scope">
                <el-button size="small" @click="show(scope.row)">查看</el-button>
                <el-button size="small" type="primary" @click="edit(scope.row)">修改</el-button>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="name" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="管理员" prop="managerName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建人" prop="operator" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="200">
              <template scope="scope">
                <template v-if="scope.row.createTime">
                  {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm') }}
                </template>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页按钮 -->
        <div style="float: right;margin-top:10px;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
        </div>
      </div>
    </layout-tree>
    <!--修改弹窗-->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="800">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--增加弹窗-->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="800">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true" :width="800">
      <modal-header slot="header" :parent="self" :content="showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!---->

    <!--删除弹窗-->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import layoutTree from "../../../../common/layoutTree.vue";
  import leftTree from "../../../../common/leftTree.vue";

  import add from "./normCourseTree_add.vue";
  import edit from "./normCourseTree_edit.vue";
  import show from "./normCourseTree_view.vue";
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ["types"],
    data() {
      return {
        contenHeight: 0,
        viewTypes: '', // 视图类型
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: api.courseTree.path + "?types=" + this.types,
          getDataUrl: '',
          isShowMenus: false,
          isShowSearch: false, //是否显示目录树查询
        },
        fromWhereTree: "user",

        //查询表单
        deleteUrl: api.courseTreeDel.path,
        //当前tree选中的node id
        deptId: 1,

        // 模态框提示
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
        unAdd:false,
        showMoreSearch: false, // 更多筛选
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        tableHeight: 0,
        self: this,
        loading: false,
        listTotal: 0,
        searchObj: { // 搜索
          name: '', // 名称
          managerName: '', // 管理员
          operator: '', // 操作人
          createTime: '', // 节点创建时间
        },
        tableData: [],

        //当前科室详情
        depDetails: {
          "id": "",
          "name": "",
          "parentId": "",
          "parentName": "",
          "managerId": "",
          "managerName": "",
          "operator": "",
          "createTime": ""
        },

        //初始化加载页面信息
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.courseTreelistPage.path,
            params: {
              "id": "", //点击的树节点ID
              "name": "", //节点名称
            }
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
          //url:this.listUrl,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        //this.setTableData();
      },

      /************************* 搜索逻辑 *********************************/
      search() {
        this.setTableData();
      },

      // 获取筛选按钮图标
      getSearchBtnIcon() {
        return this.showMoreSearch ? 'arrow-up' : 'arrow-down'
      },

      // 显示更多筛选
      openMoreSearch() {
        this.showMoreSearch = !this.showMoreSearch;
        this.$nextTick(() => {
          if (this.showMoreSearch) {
            this.tableHeight = this.dynamicHt - this.$refs.showMoreSearch.offsetHeight;
          } else {
            this.tableHeight = this.dynamicHt;
          }
        })
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

      //通过get请求列表数据并渲染表格数据
      updateListData(responseData) {
        let data = responseData.data;
        let that = this;
        this.tableData = [];
        data = that.addIndex(data);
        that.tableData = data;

        this.listTotal = responseData.totalCount || 0;
      },

      //初始化加载列表数据
      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params, this.searchObj);
        this.postParamToServer(this.listMessTitle);
      },

      //向服务器发送数据
      postParamToServer(options) {
        if (this.deptId != "") {
          options["ajaxParams"]["params"]["id"] = this.deptId;
        }
        this.ajax(options);
      },



      /*--点击--添加--按钮--*/
      add() {
        if(this.unAdd){
          this.showMess('不能在此节点添加');
          return;
        }
        if (this.deptId == "") {
          this.errorMess("请选择左侧目录节点!");
          return;
        }
        this.operailityData = {
          parentName: this.depDetails.name,
          parentId: this.deptId,
          types: this.types
        };
        this.openModel('add');
      },
      /*--点击--删除--按钮--*/
      remove(index) {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },

      /*
       * 点击--查看--按钮
       * @param row Object  当前行数据对象
       * */
      show(row) {

        this.operailityData = row;
        this.showModal = true;
      },


      /*
       * 点击--修改角色--按钮
       * @param row Object  当前行数据对象
       * */
      edit(row) {
        row["parentName"] = this.depDetails.name;
        row["parentId"] = this.deptId;
        this.operailityData = row;
        this.openModel('edit');
      },



      //设置表格及分页的位置
      getContentHeight() {
        this.contenHeight = this.$refs.treeContent.parentNode.parentNode.offsetHeight;
      },


      //设置表格及分页的位置
      setTableDynHeight() {
        this.getContentHeight()
        let tableView = this.$refs.tableView;
        let paginationHt = 45;
        this.dynamicHt = this.contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
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
        // 记录视图
        if(node.level>2){
          this.unAdd = true;
        }else {
          this.unAdd = false;
        }
        this.viewTypes = obj.types;
        this.setTreeDepId(obj.id);
      },


      /*
       * 删除目录树回调
       *
       * */
      treeRemoveNode() {
        this.deptId = '';
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
        };
        this.setTableData();
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
          //刷新左侧目录树根据不同的情况
          this.$children[0].$children[0].updataTree();
        }
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
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
        this.getContentHeight();
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {
      //当前组件引入的子组件
      layoutTree,
      leftTree,
      add,
      edit,
      show,
    }
  }

</script>
