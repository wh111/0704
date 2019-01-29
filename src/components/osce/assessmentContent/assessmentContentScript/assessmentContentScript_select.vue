<template>
  <!-- 剧本选择组件 -->
  <div>
    <!-- 表格数据 -->
    <div id="tableData" ref="tableData" style="height:450px;">
      <el-table align="center" :height="450" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo"
        style="width: 100%" @selection-change="handleSelectionChange" empty-text="该病例没有剧本">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="剧本名称" prop="scriptName" show-overflow-tooltip></el-table-column>
        <el-table-column label="剧本简介" prop="scriptContent" show-overflow-tooltip></el-table-column>
      </el-table>
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
</template>

<script>
  let Util = null;

  import api from './api'; // API

  export default {
    props: {
      caseId: { // 病例id
        type: Number,
        required: true
      }
    },
    data() {
      return {
        api,
        self: this,
        tableData: [],
        //保存按钮基本信息
        loadBtn: {
          title: '确定选择剧本',
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
          url: this.api.getByCase.path,
          method: this.api.getByCase.method,
          params: {
            caseId: this.caseId, // 病例id
            // curPage: 1,
            // pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.setTableData();
      },
      // 选择评分表
      listenSubEvent() {
        if (this.isSelected(true)) {
          this.$emit('select', this.multipleSelection[0]);
          this.cancel();
        }
        // console.log(this.multipleSelection[0]);
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
      setTableData() {
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        })
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
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
          this.showMess("请选择一个剧本!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能选择一个剧本!")
          flag = false;
        }
        return flag;
      },
      // 取消
      cancel() {
        this.$emit('cancel', 'scriptSelect')
      }
    },
    created() {
      this.init()
    }
  }

</script>
