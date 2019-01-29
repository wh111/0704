<template>
  <!-- 评分表选择组件 -->
  <layout-tree style="height:450px;">
    <!-- 左侧目录树 -->
    <left-tree slot="left" @tree-click="treeClick" :treeOptions="leftTreeOpt.treeDefaults" :fromWhereTreeType="leftTreeOpt.fromWhereTree"
      @setCurrSltNodeId="setCurrSltNodeId"></left-tree>
    <!-- 右侧内容 -->
    <div slot="right" id="content" ref="content" style="padding:0;">
      <!-- 搜索 -->
      <el-form :inline="true" class="el-form-item-search" onsubmit="return false">
        <el-form-item label="病例名称：">
          <el-input size="small" v-model="searchObj.caseName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格数据 -->
      <div id="tableData" ref="tableData">
        <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo"
          style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column label="病例名称" prop="caseName" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.caseName + (scope.row.scoreTableId ? ' （评分表：' + scope.row.scoreTableName + '）' : '') }}
            </template>
          </el-table-column>
          <el-table-column label="是否有剧本" prop="isScript" show-overflow-tooltip width="110" align="center">
            <template scope="scope">
              {{ (scope.row.isScript || '0') | typeText }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div style="float: right;margin-top:10px;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
          :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
      <el-row style="padding-top:10px;clear:both;">
        <el-col :span="6" :offset="6" align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
        <el-col :span="6" align="center">
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </div>
  </layout-tree>
</template>

<script>
  let Util = null;

  import treeApi from '../api'; // treeApi
  import caseApi from './api'; // 病例api

  import layoutTree from '../../../common/layoutTree'; // 左侧结构
  import leftTree from '../tree/menu'; // 菜单组件

  export default {
    data() {
      return {
        treeApi,
        self: this,
        // 内容高度
        dynamicHt: 100,
        treeRoadArr: [], // 节点路径数组
        tree: {
          treeRoad: '', // 节点路径
          treeId: 0, // 节点id
        },
        searchObj: {
          caseName: ''
        },
        totalCount: 0,
        tableData: [],
        //保存按钮基本信息
        loadBtn: {
          title: '确定选择病例',
          callParEvent: 'listenSubEvent'
        },
        multipleSelection: ''
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
            url: caseApi.list.path,
            method: caseApi.list.method,
            params: {
              curPage: 1,
              pageSize: Util.pageInitPrams.pageSize
            }
          },
          this.listMessTitle = { //初始化加载页面信息
            ajaxSuccess: 'updateListData',
            ajaxParams: {
              url: treeApi.structure.path,
              params: {}
            }
          },
          this.leftTreeOpt = { // 左侧菜单
            //tree默认项设置
            treeDefaults: {
              getTreeUrl: treeApi.structure.path, // 获取数据api
              baseUrl: treeApi.baseUrl.path,
              getDataUrl: treeApi.structure.path,
              isShowSearch: false, // 隐藏搜索
              isShowMenus: false, // 隐藏操作菜单
              defaultProps: {
                label: 'treeName'
              },
              asyn: true,
            },
            fromWhereTree: "custom", // 菜单类型
            //deptId: '1', // 菜单选中id
          }

        // this.setTableData();
      },
      // 搜索
      search() {
        this.setTableData();
      },
      // 选择评分表
      listenSubEvent() {
        if (this.isSelected(true)) {
          this.$emit('select', this.multipleSelection[0]);
          this.cancel();
        }
      },
      //---------------------------------- 左侧菜单树 ------------------------------------------//
      /*
       * 左侧目录树节点click调用父组件方法
       *
       * @param obj {} 当前选中节点的一级数据
       * @param node  {}  整个tree节点所有数据
       * @param  self  {}  当前tree vue实例
       *
       * */
      treeClick(obj, node, self) {
        // this.setTreeDepId(obj.id);
        // this.showTreeList(obj.id);
        // this.getTreeRoadArr(node);
        this.setTreeObj(obj);
        // 重置搜索
        this.searchObj.caseName = '';
        this.setTableData();
      },
      // 设置节点默认id
      setCurrSltNodeId(id, data) {
        this.tree.treeId = id;
        this.tree.treeRoad = data.treeRoad;
        // 获取右侧数据
        this.setTableData();
      },
      /*
       * 设置菜单相关信息（传给子组件）
       */
      setTreeObj(obj) {
        this.tree.treeId = obj.id;
        this.tree.treeRoad = obj.treeRoad;
      },
      // 根据node来获取节点路径
      getTreeRoadArr(node) {
        let tag = true;
        let _node = node;
        this.treeRoadArr.length = 0;
        while (tag) {
          this.treeRoadArr[_node.level - 1] = _node.data.id;
          _node = _node.parent;
          if (_node.level === 0) {
            tag = false;
          }
        }
        this.tree.treeRoad = this.treeRoadArr.join(',');
      },
      /*
       * 根据部门id查询当前部门的人员信息
       * @param id number 当前部门id
       * */
      showTreeList(id) {
        //初始化加载页面信息
        let params = Util._.defaultsDeep({}, this.queryQptions, {
          deptId: id
        });
        let listMessTitle = Util._.defaultsDeep({}, this.listMessTitle);
        listMessTitle.ajaxParams["params"]["deptId"] = id;
        this.postParamToServer(listMessTitle);
      },
      //向服务器发送数据
      postParamToServer(options) {
        if (this.deptId != "") {
          options["ajaxParams"]["params"]["deptId"] = this.leftTreeOpt.deptId;
        }
        this.ajax(options);
      },
      //*--------------------------- 表格 -----------------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        Object.assign(this.queryQptions.params, this.tree, this.searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess("请选择一个病例!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能选择一个病例!")
          flag = false;
        }
        return flag;
      },
      /******************************* 其他逻辑 ****************************************************/
      // 获取内容部分高度
      getContentHeight() {
        let contenHeight = this.$refs.content.parentNode.offsetHeight;
        let tableData = this.$refs.tableData;
        let paginationHt = 50 * 2 - 10;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
      },
      // 取消
      cancel() {
        this.$emit('cancel', 'caseSelect')
      },
    },
    components: {
      leftTree,
      layoutTree
    },
    created() {
      this.init()
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContentHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.getContentHeight);
      })
    }
  }

</script>

<style>


</style>
