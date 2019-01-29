<!--
****--@file     proposalApplicationWrite_select
****--@date     2018/8/4 18:21
****--@author   YC
****--@describe 选择开题申请
-->
<template>
  <div>
    <el-col align="right">
      <el-form ref="form" :model="formValidate" inline>
        <el-form-item prop="thesisTitle" label="论文题目：">
          <el-input v-model="formValidate.thesisTitle" placeholder="输入论文题目"></el-input>
        </el-form-item>
        <el-form-item label="研究方向：" prop="researchDirection">
          <el-input v-model="formValidate.researchDirection" placeholder="输入研究方向"></el-input>
        </el-form-item>
        <el-button @click="searchEvent" type="info">{{ 'query' | sysLan }}</el-button>
      </el-form>
    </el-col>

    <el-table
      align="center"
      :height="300"
      :context="self"
      :data="tableData"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;height: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        align="center"
        label="序号"
        prop="index"
        width="100">
        <template scope="scope">
          <span>{{scope.row.index}}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="thesisTitle"
        label="论文题目">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="researchDirection"
        label="研究方向">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="specialtyCode"
        label="专业代码">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="specialtyName"
        label="专业方向">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="applicantType"
        width="150"
        label="开题状态">
        <template scope="scope">
          {{scope.row.applicantType | applicantType}}
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div style="margin: 10px;">
      <div align="right">
        <el-pagination
          @size-change="changePageSize"
          @current-change="changePage"
          :current-page="myPages.currentPage"
          :page-sizes="myPages.pageSizes"
          :page-size="myPages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <div align="center">
      <el-button @click="select" type="info">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'proposalApplicationWriteSelect',
    data () {
      return {
        self: this,
        formValidate: {
          thesisTitle: '',       //论文题目
          researchDirection: '',//研究方向
          status: 'TG'  //状态
        },
        tableData: [],
        totalCount: 0,
        multipleSelection: [],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.applicationList.path,
            params: {}
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        };

        this.setTableData();
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      //通过get请求列表数据
      updateListData (responseData) {
        this.tableData = this.addIndex(responseData.data || []);
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //搜索监听回调
      searchEvent (isLoading) {
        //        isLoading(true);
//        let isSubmit = this.handleSubmit('formValidate');
//        if (isSubmit) {
        this.setTableData();
//        }
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        let flag = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
        return flag;
      },
      select () {
        if (this.multipleSelection.length !== 1) {
          this.errorMess(!this.multipleSelection.length ? '请选择开题' : '只能选择一个开题');
          return false;
        }
        this.$emit('select', this.multipleSelection);
      },
      cancel () {
        this.$emit('cancel', 'select');
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
