<!--
****--@file     ab_table
****--@date     2018/3/17 12:16
****--@author   YC
****--@describe 自定义表格布局组件
-->
<template>
  <div>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="dynamicHt" :context="self" :data="tableDatas"
                tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <!-- 选项 -->
        <el-table-column type="selection" width="55" v-if="hasSelect"></el-table-column>
        <!-- 序号 -->
        <el-table-column align="center" label="序号" prop="index" width="80"></el-table-column>
        <slot></slot>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;" v-if="hasPagination">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes" :total="totalCount"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null
  export default {
    name: 'ab_table',
    props: {
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860
      },
      tableData: { // 表格数据
        type: Array,
        default: () => []
      },
      tableURL: { // 根据url获取表格数据
        type: [String, Object],
        default: () => ''
      },
      searchObj: { // 表格筛选条件（Url）
        type: Object,
        default: () => {}
      },
      loadTableData: { // 改变此数据将重新获取表格数据
        type: [String, Number],
        default: () => 0
      },
      hasSelect: { // 是否有复选框
        type: Boolean,
        default: true
      },
      hasPagination: { // 是否有分页
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        self: this,
        loading: false,
        dynamicHt: 100,
        totalCount: 0,
        tableDatas: []
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          params: {}
        }
        this.queryQptions.params = this.hasPagination ? {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        } : {};
        this.setTableData();
      },
      // 获取表格数据
      setTableData () {
        console.log('0')
        switch (typeof this.tableURL) {
          case 'string':
            this.getTableDataByURL(this.tableURL)
            break
          case 'object':
            this.getTableDataByURL(this.tableURL.path, this.tableURL.method)
            break
          default:
            this.tableDatas = this.addIndex(this.tableData)
            break
        }
      },
      // 根据api获取接口
      getTableDataByURL (url, method = 'get') {
        let ajaxParams = {
          url,
          method
        }
        switch (method) {
          case 'post':
          case 'put':
            ajaxParams.data = Util._.defaultsDeep({}, this.searchObj)
            break
          default:
            ajaxParams.params = Util._.defaultsDeep({}, this.searchObj)
            break
        }
        ajaxParams.params = Util._.defaultsDeep({}, ajaxParams.params || {}, this.queryQptions.params)
        let opt = {
          ajaxSuccess: res => {
            this.tableDatas = this.addIndex(res.data || [])
            this.totalCount = res.totalCount || 0
          },
          ajaxParams
        }
        this.ajax(opt)
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        this.dynamicHt = this.contenHeight - (this.hasPagination ? 62 : 0);
        console.log(this.contenHeight)
      },
      /************************************* 方法 *********************************************/
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.$emit('selectionChange', val)
      }
    },
    created () {
      this.init()
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight()
        //为窗体绑定改变大小事件
        Util.events.addHandler(window, 'resize', this.setTableDynHeight)
      })
    },
    watch: {
      contenHeight () {
        this.setTableDynHeight()
      },
      tableData () {
        this.setTableData()
      },
      tableURL () {
        this.setTableData()
      },
      loadTableData () {
        this.setTableData()
      }
    },
    components: {}
  }

</script>
