<template>
  <div>
    <!-- 表格数据 -->
    <div id="deviceTable" ref="deviceTable">
      <el-table align="center" ref="multipleTable" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
        <el-table-column label="名称" prop="deviceTypeName" show-overflow-tooltip></el-table-column>
        <el-table-column label="编号" prop="deviceIdentifier" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!-- <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
        :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div> -->
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
  export default {
    props: {
      select: { // 已经选中的id集合（数组）
        type: Array,
        default: () => []
      },
      selectOne: { // 是否只选一个
        type: Boolean,
        default: false
      },
      roomId:{ // 房间id
        type:[Number,String],
        default: ''
      },
    },
    data() {
      return {
        // 内容高度
        dynamicHt: 446,
        // 默认激活视图
        selectData: [],
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
            roomId:this.roomId
          }
        }
        this.setTableData()
      },
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
