<template>
  <!-- 模型预约管理 -->
  <div class="bespeakSetModel" ref="bespeakSetModel" :style="{'height':contenHeight + 'px'}">
    <layout-tree>
      <!-- 左侧目录树 -->
      <tree-menu slot="left" @tree-click="treeClick" :treeOptions="leftTreeOpt.treeDefaults" :fromWhereTreeType="leftTreeOpt.fromWhereTree"
        @setCurrSltNodeId="setCurrSltNodeId"></tree-menu>
      <!-- 右侧内容 -->
      <div slot="right" id="content" ref="content" class="modal" style="padding:0;">
        <el-form :inline="true">
          <el-row>
            <el-col :span="8">
              <!-- 操作按钮 -->
              <el-form-item>
                <el-button type="success" @click="set(false)">预约设置</el-button>
              </el-form-item>
            </el-col>
            <!-- 搜索框 -->
            <el-col :span="16" align="right">
              <el-form-item>
                <el-input placeholder="请输入设备名称" v-model="searchObj.deviceTypeName">
                  <el-button slot="append" icon="search" @click="search"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 多条件 -->
        <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
          <el-form :inline="true">
            <el-form-item label="设备名称:">
              <el-input v-model="searchObj.deviceTypeName"></el-input>
            </el-form-item>
            <el-form-item label="设备数量:">
              <el-input v-model.number="searchObj.deviceNum"></el-input>
            </el-form-item>
            <el-form-item label="开放预约数量:">
              <el-input v-model.number="searchObj.openNum"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 表格数据 -->
        <div id="tableView" ref="tableView">
          <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo"
            style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="操作" width="140" align="center">
              <template scope="scope">
                <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
                <el-button size="small" type="success" @click="set(scope.row)">设置</el-button>
              </template>
            </el-table-column>
            <el-table-column label="设备名称" prop="deviceTypeName" show-overflow-tooltip></el-table-column>
            <el-table-column label="描述" prop="describes" show-overflow-tooltip>
              <template scope="scope">
                {{ scope.row.describes || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="总数量" prop="deviceNum" show-overflow-tooltip>
              <template scope="scope">
                {{ scope.row.deviceNum || '0' }}
              </template>
            </el-table-column>
            <el-table-column label="开放预约数量" prop="openNum" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" prop="isOpen" show-overflow-tooltip>
              <template scope="scope">
                {{ scope.row.isOpen | bespeakSetRoomStatus }}
              </template>
            </el-table-column>
            <el-table-column label="开放时间" prop="<timeModel></timeModel>" show-overflow-tooltip>
              <template scope="scope">
                {{ scope.row.timeModel | typeText }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div style="float: right;margin-top:10px;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
        </div>
      </div>
    </layout-tree>

    <!-- 模态框 设置（set） -->
    <Modal :mask-closable="false" v-model="setModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.setId"></modal-header>
      <model-set v-if="setModal" @cancel="cancel" @set="subCallback" :op-data="operailityData"></model-set>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（show） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <model-view v-if="showModal" @cancel="cancel" :op-data="operailityData"></model-view>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util;
  import treeApi from '../../device/treeApi';
  import api from './api';

  // 左侧菜单树
  import layoutTree from "../../../common/layoutTree";
  // 右侧内容
  import treeMenu from "../../device/tree/menu";

  import modelSet from './model_set'; // 设置
  import modelView from './model_view'; // 查看

  export default {
    props: ['contenHeight'],
    data() {
      return {
        // 默认激活视图
        deActiveName: '', // storage
        // 左侧菜单
        leftTreeOpt: {
          //tree默认项设置
          treeDefaults: {
            getTreeUrl: treeApi.tree.path, //目录树结构请求地址
            baseUrl: treeApi.baseUrl,
            // getDataUrl: '', //获取目录树叶子节点请求数据地址
            isShowSearch: false, // 隐藏搜索
            isShowMenus: false, // 隐藏操作菜单
          },
          fromWhereTree: "user", // 菜单类型
        },
        deptId: '', // 菜单选中id
        /********************* 右侧 ***************************/
        totalCount: 0,
        self: this,
        tableHeight: 1,
        dynamicHt: 100, // 表格高度
        loading: false,
        showMoreSearch: false, // 更多筛选
        showModal: false, // 查看
        setModal: false, // 设置

        operailityData: '',
        multipleSelection: '', // 表格已选集
        searchObj: { // 搜索
          deviceTypeName: '', //  deviceTypeName
          deviceNum: '', // 设备数量
          openNum: '', // 开放预约数量
          sortby: '', // 排序字段
          order: '', // 排序方式
        },
        tableData: [],
        // 模态框提示
        contentHeader: {
          setId: {
            id: 'setId',
            title: '模型预约设置'
          },
          showId: {
            id: 'showId',
            title: '查看模型预约设置'
          }
        }
      }
    },
    methods: {
      //---------------------------------- 左侧菜单树 ------------------------------------------//
      // 设置默认ID
      setCurrSltNodeId(id) {
        if (this.deptId == "") {
          this.deptId = id;
        } else {
          this.deptId = id;
        }
        this.setTableData();
      },
      /*
       * 左侧目录树节点click调用父组件方法
       *
       * @param obj {} 当前选中节点的一级数据
       * @param node  {}  整个tree节点所有数据
       * @param  self  {}  当前tree vue实例
       *
       * */
      treeClick(obj, node, self) {
        this.deptId = obj.id;
        this.setTableData();
      },
      /***************************** 右侧 *************************************/
      //初始化请求列表数据
      init() {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          }
        }
        // this.setTableData();
      },
      /************************* 搜索逻辑 *********************************/
      search() {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.setTableData();
      },
      // 获取筛选按钮图标
      getSearchBtnIcon() {
        return this.showMoreSearch ? 'arrow-up' : 'arrow-down'
      },
      // 显示更多筛选
      openMoreSearch() {
        this.showMoreSearch = !this.showMoreSearch
        this.$nextTick(() => {
          if (this.showMoreSearch) {
            this.tableHeight = this.dynamicHt - this.$refs.showMoreSearch.offsetHeight
          } else {
            this.tableHeight = this.dynamicHt;
          }
        })

      },
      /************************* 表格逻辑 *********************************/
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
        Object.assign(this.queryQptions.params, {
          depId: this.deptId
        });
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
      //设置表格及分页的位置
      setTableDynHeight() {
        let tableView = this.$refs.tableView;
        let paginationHt = 40;
        this.dynamicHt = this.contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
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
      /************************************** 模态框处理 **************************************************/
      // 增加，选择考核类型
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      // 设置
      set(row) {
        this.operailityData = row && [row] || this.multipleSelection;
        if (!this.operailityData.length) {
          this.errorMess('请选择需要设置的模型')
          return
        }
        this.openModel('set')
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove() {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove')
        }
      },
      // 增加回调
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
    },
    components: {
      layoutTree,
      treeMenu,
      modelView,
      modelSet
    },
    watch: {
      contenHeight(val) {
        this.setTableDynHeight()
      },
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight()
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    created() {
      Util = this.$util;
      this.init()
    }
  }

</script>

<style>
  /* 模型预约管理 */

</style>
