<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row>
      <el-col align="right">
        <el-form :inline="true">
          <el-form-item label="资金库名称：">
            <el-input v-model="searchObj.fundName" @keyup.enter.native="setTableData" icon="search" :on-icon-click="setTableData"></el-input>
            <input type="text" style="display: none;">
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table align="center" :maxHeight="400" :context="self" :data="tableData" tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="资金库名称" prop="fundName" show-overflow-tooltip></el-table-column>
      <el-table-column label="经费代码" prop="fundCode" show-overflow-tooltip></el-table-column>
      <el-table-column align="right" label="资金库金额" prop="fundMoney" show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.fundMoney | money }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="流出" prop="goOut" show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.goOut | money }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="流入" prop="enter" show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.enter | money }}
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 16px;">
      <el-col align="center">
        <el-button type="info" @click="selectData">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['onlyOne', 'mustSelect', 'select'],
    data() {
      return {
        //* 表格 *//
        self: this,
        totalCount: 0,
        loading: false,
        multipleSelection: [],
        tableData: [], // 表格数据
        // 搜索
        searchObj: {
          fundName: '', // 资金库名称
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init: function () {
        Util = this.$util;

        this.queryQptions = {
          url: api.select,
          params: {}
        }

        this.setTableData()
      },
      //*----------- 表格 ------------*//
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
        Object.assign(this.queryQptions.params, this.searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        })
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        if (res.data.length) {
          res.data.map(item => item.id = item.fundId)
        }
        this.tableData = res.data || [];
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contentHeight = this.$refs.content.parentNode.offsetHeight;
        let tableData = this.$refs.table.offsetTop;
        let paginationHt = 50;
        this.dynamicHt = contentHeight - tableData - paginationHt;
      },
      /*
       * 列表数据选择
       */
      isSelected() {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess("请选择数据!");
          flag = false;
        }
        return flag;
      },
      /******************** 按钮事件 ****************************/
      // 取消
      cancel() {
        this.$emit('cancel', 'select')
      },
      // 选择数据
      selectData() {
        if (this.mustSelect == true && !this.multipleSelection.length) {
          this.errorMess('至少选择一个选项')
          return
        } else if (this.onlyOne == true && this.multipleSelection.length != 1) {
          this.errorMess(this.multipleSelection.length ? '只能选择一个选项' : '必须选择一个选项')
          return
        }
        this.$emit('select', this.multipleSelection)
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }

</script>
