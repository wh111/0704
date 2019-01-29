<!--
****--@file     room_info
****--@date     2018/6/8 17:23
****--@author   YC
****--@describe 预约查询-预约上课-考勤
-->
<template>
  <div>
    <el-row>
      <el-form :inline="true" align="right">
        <el-form-item label="考生姓名：">
          <el-input v-model="searchObj.userName"></el-input>
        </el-form-item>
        <el-form-item label="房间号：">
          <el-select v-model="searchObj.roomNum" clearable>
            <el-option value="">全部</el-option>
            <el-option v-for="item in roomList" :key="item.roomId" :value="item.roomNum">{{ item.roomNum }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%;">
        <el-table-column label="房间号" prop="roomNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="考生姓名" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="刷卡时间" prop="time" show-overflow-tooltip></el-table-column>
        <el-table-column label="卡号" prop="cardNum" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="float: right;margin-top:10px;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                       :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'bespeakSearchRoomInfo',
    props: ['operailityData'],
    data () {
      return {
        totalCount: 0,
        self: this,
        dynamicHt: 400, // 表格高度
        loading: false,
        searchObj: { // 搜索
          roomNum: '', //  房间号
          userName: '', // 人员姓名
          reservePojectId: this.operailityData.id // 预约项目id
        },
        tableData: [],
        roomList: []
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.reserveList.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        if (this.operailityData && this.operailityData instanceof Object) {
          this.roomList = this.operailityData.roomList;
        }
        this.search();
      },
      /************************* 搜索逻辑 *********************************/
      search () {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.setTableData();
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
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
