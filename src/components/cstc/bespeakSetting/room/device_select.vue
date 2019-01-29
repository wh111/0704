<template>
  <div>
    <el-form :inline="true" v-if="selectDeviceType === 'other'" align="right">
      <el-form-item label="名称：">
        <el-input v-model="searchObj.deviceTypeName"></el-input>
      </el-form-item>
      <el-form-item label="编号：">
        <el-input v-model="searchObj.deviceIdentifier"></el-input>
      </el-form-item>
      <el-form-item label="型号：">
        <el-input v-model="searchObj.model"></el-input>
      </el-form-item>
      <el-button @click="search">查询</el-button>
    </el-form>
    <!-- 表格数据 -->
    <div id="deviceTable" ref="deviceTable">
      <el-table align="center" ref="multipleTable" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
        <el-table-column label="名称" prop="deviceTypeName" show-overflow-tooltip></el-table-column>
        <el-table-column label="编号" prop="deviceIdentifier" show-overflow-tooltip></el-table-column>
        <el-table-column label="型号" prop="model" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;" v-if="totalCount">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pageInfo.currentPage" :page-sizes="pageInfo.pageSizes"
                     :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

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
  export default {
    props: {
      url: {
        type: String,
        default: ''
      },
      select: { // 已经选中的id集合（数组）
        type: Array,
        default: () => []
      },
      selectOne: { // 是否只选一个
        type: Boolean,
        default: false
      },
      selectDeviceType: {
        type: String,
        default: 'room'
      }
    },
    data () {
      return {
        // 内容高度
        dynamicHt: 460,
        // 默认激活视图
        selectData: [],
        searchObj: {
          deviceTypeName: '', // 设备名称
          deviceIdentifier: '', // 设备编号
          model: '' // 型号
        },

        self: this,
        // 表格数据
        totalCount: 0,
        tableData: [],
        deviceTypeName: '', // 搜索设备名称
        multipleSelection: '', // 选项
        operailityData: '', // 操作的数据
        loading: false,
        pageInfo: {
          currentPage: 1,
          pageSizes: [20],
          pageSize: 20,
          listLayout: 'total, sizes, prev, pager, next, jumper',
          listTotal: 0
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.pageInfo = Util._.defaultsDeep({}, Util.pageInitPrams);

        this.queryQptions = {
          url: this.url,
          params: {
            curPage: 1,
            pageSize: this.pageInfo.pageSize
          }
        };

//        this.queryQptions = {
//          url: this.url,
//          method: 'get',
//        };
        this.setTableData();
      },
      changePageSize (n) {
        this.queryQptions.params.pageSize = n;
        this.setTableData();
      },
      changePage (n) {
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.queryQptions.params.curPage = n;
        this.setTableData();
      },
      search () {
        this.queryQptions.params = Object.assign(this.queryQptions.params, this.searchObj);
        this.setTableData();
      },
      //*--------------------------- 表格 -----------------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.selectData = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData () {
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        });
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
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
            });
          }
        });
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let conHt = this.$refs.selectContent.offsetHeight;
        let seaHt = this.$refs.selSearch.offsetHeight;
        this.dynamicHt = conHt - seaHt;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.selectData.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择设备!');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能选择一个设备!');
          flag = false;
        }
        return flag;
      },
      /**************** 按钮交互 ***************/
      // 取消
      cancel () {
        this.$emit('cancel', 'selectDevice');
      },
      // 确定
      selectDevice () {
        if (this.isSelected(this.selectOne)) {
          this.$emit('select', this.selectData);
        }
      }
    },
    components: {},
    // mounted() {
    //   //页面dom稳定后调用
    //   this.$nextTick(function () {
    //     //初始表格高度及分页位置
    //     // this.setTableDynHeight();
    //   })
    // },
    created () {
      this.init();
    }
  };

</script>
