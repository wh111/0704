<template>
  <div>
    <layout-tree style="height:500px;" ref="selectContent">
      <!-- 左侧目录树 -->
      <tree-menu slot="left" @tree-click="treeClick" :treeOptions="leftTreeOpt.treeDefaults" :fromWhereTreeType="leftTreeOpt.fromWhereTree" @setCurrSltNodeId="setCurrSltNodeId"></tree-menu>
      <!-- 右侧内容 -->
      <div slot="right" id="content" ref="content" class="modal" style="padding:0;">
        <div ref="selSearch">
          <el-input placeholder="请输入设备名称" v-model="deviceTypeName" style="margin-bottom:18px;">
            <el-button slot="append" icon="search" @click="setTableData"></el-button>
          </el-input>
        </div>
        <!-- 表格数据 -->
        <div id="deviceTable" ref="deviceTable">
          <el-table align="center" ref="multipleTable" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
            <el-table-column label="名称" prop="deviceTypeName" show-overflow-tooltip></el-table-column>
            <el-table-column label="开放数量" prop="openNum" show-overflow-tooltip>
              <template scope="scope">
                {{ scope.row.openNum || 0 }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <!-- <div style="float: right;margin-top:10px;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
        </div> -->
      </div>
    </layout-tree>
    <el-row style="clear:both;padding-top:20px;">
      <el-col :span="6" :offset="6" align="center">
        <el-button type="primary" @click="selectDevice">确定</el-button>
      </el-col>
      <el-col :span="6" align="center">
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  let Util;
  // API
  import api from './api';

  // 左侧菜单树
  import layoutTree from "../../common/layoutTree";
  // 右侧内容
  import treeMenu from "../device/tree/menu";
  export default {
    props: {
      timeData: {
        type: Object,
        default: () => ({
          date: '', // 日期
          reserveTimeSetId: '', // 时间段id
        })
      },
      select: { // 已经选中的id集合（数组）
        type: Array,
        default: () => []
      },
      selectOne: { // 是否只选一个
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        // 内容高度
        dynamicHt: 446,
        // 默认激活视图
        selectData: [],
        // 左侧菜单
        leftTreeOpt: {
          //tree默认项设置
          treeDefaults: {
            getTreeUrl: api.tree.path, //目录树结构请求地址
            baseUrl: api.baseUrl,
            // getDataUrl: '', //获取目录树叶子节点请求数据地址
            isShowSearch: false, // 隐藏搜索
            isShowMenus: false, // 隐藏操作菜单
          },
          fromWhereTree: "user", // 菜单类型
        },
        depId: '', // 菜单选中id
        self: this,
        // 表格数据
        totalCount: 0,
        tableData: [],
        deviceTypeName: '', // 搜索设备名称
        multipleSelection: '', // 选项
        operailityData: '', // 操作的数据
        loading: false,

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.select.path,
          method: api.select.method,
          params: {
            date: this.timeData.date,
            reserveTimeSetId: this.timeData.reserveTimeSetId,
            // curPage: 1,
            // pageSize: Util.pageInitPrams.pageSize
          }
        }
      },
      //---------------------------------- 左侧菜单树 ------------------------------------------//
      // 设置默认ID
      setCurrSltNodeId(id) {
        if (this.depId == "") {
          this.depId = id;
        } else {
          this.depId = id;
        }
        this.setTableData()
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
        this.depId = obj.id;
        this.deviceTypeName = '';
        this.setTableData()
      },
      // 获取内容部分高度
      // getContentHeight() {
      //   this.contenHeight = this.$refs.content.parentNode.offsetHeight;
      // },
      //*--------------------------- 表格 -----------------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.selectData = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData() {
        this.queryQptions.params.depId = this.depId;
        this.queryQptions.params.deviceTypeName = this.deviceTypeName || '';
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        })
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = res.data;
        this.$nextTick(() => {
          if (this.select.length) {
            let thisPageIds = [];
            let rowIndex;
            res.data.map(item => thisPageIds.push(item.id));
            this.select.map(id => {
              rowIndex = thisPageIds.indexOf(id);
              if (rowIndex > -1) {
                this.$refs.multipleTable.toggleRowSelection(this.tableData[rowIndex]); // 选中数据
              }
            })
          }
        })
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let conHt = this.$refs.selectContent.offsetHeight;
        let seaHt = this.$refs.selSearch.offsetHeight;
        this.dynamicHt = conHt - seaHt;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly) {
        let len = this.selectData.length;
        let flag = true;
        if (len == 0) {
          this.showMess("请选择设备!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能选择一个设备!")
          flag = false;
        }
        return flag;
      },
      /**************** 按钮交互 ***************/
      // 取消
      cancel() {
        this.$emit('cancel', 'selectDevice')
      },
      // 确定
      selectDevice() {
        if (this.isSelected(this.selectOne)) {
          this.$emit('select', this.selectData)
        }
      },
    },
    components: {
      layoutTree,
      treeMenu,
    },
    // mounted() {
    //   //页面dom稳定后调用
    //   this.$nextTick(function () {
    //     //初始表格高度及分页位置
    //     // this.setTableDynHeight();
    //   })
    // },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  @import '../../../assets/ambuf/css/manage_v1.0/tableMoreInfo';

</style>
