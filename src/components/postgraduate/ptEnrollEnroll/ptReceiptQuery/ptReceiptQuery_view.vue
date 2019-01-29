<!--
****--@file     ptReceiptQuery_view
****--@date     2017/12/12 14:53
****--@author   YC
****--@describe 回执查看
-->
<template>
  <div class="ptReceiptQueryViewBox">
    <!--表格数据-->
    <el-table align="center" :height="dynamicHt" :context="self" :data="showData" tooltip-effect="dark"
              highlight-current-row style="width: 100%;height: 100%">
      <el-table-column align="center" label="序号" prop="index" width="100"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="mobile" label="手机号" width="180">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="content" label="短信内容">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="times" label="发送时间" align="center" width="200">
        <template scope="scope">
          {{ scope.row.times | formatDate('yyyy-MM-dd HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<style>
  .ptReceiptQueryViewBox{padding-bottom: 30px;}
</style>
<script>
  /*当前组件必要引入*/
  import api from './api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        self: this,
        dynamicHt: 400,
        showData: [],
        totalCount: 0,
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        }

        this.setTableData();
      },
      setTableData() {
        let params = this.$util.getFormData(this.queryQptions, {mobile: this.operailityData.phone});
        let opt = {
          ajaxSuccess: res => {
            this.showData = this.addIndex(res.data);
            this.totalCount = res.totalCount;
          },
          ajaxParams: {
            url: api.get.path,
            params
          }
        }
        this.ajax(opt)
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
