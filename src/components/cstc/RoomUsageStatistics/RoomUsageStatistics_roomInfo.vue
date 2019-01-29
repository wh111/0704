<!--
****--@file     RoomUsageStatistics_roomInfo
****--@date     2018/8/24 11:18
****--@author   YC
****--@describe 房间统计信息
-->
<template>
  <div class="roomUsageStatisticsReserveInfo" ref="roomInfo">
    <el-row>
      <!-- 搜索框 -->
      <el-col align="right">
        <el-form :inline="true">
          <el-form-item label="事项名称：">
            <el-input placeholder="请输入事项名称" v-model="searchObj.affairName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" type="info" v-if="!showMoreSearch">查询</el-button>
            <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
      <el-form :inline="true">
        <el-form-item label="接待对象：">
          <el-input placeholder="请输入接待对象" v-model="searchObj.receptionObject"></el-input>
        </el-form-item>
        <el-form-item label="人数：">
          <el-input placeholder="请输入人数" v-model="searchObj.peopleNum"></el-input>
        </el-form-item>
        <el-form-item label="登记人：">
          <el-input placeholder="请输入登记人" v-model="searchObj.userName"></el-input>
        </el-form-item>
        <el-form-item label="房间号：">
          <el-input placeholder="请输入房间号" v-model="searchObj.roomNum"></el-input>
        </el-form-item>
        <el-form-item label="事务类型:">
          <el-select v-model="searchObj.affairType" placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in useType" :key="item.code" :label="item.value" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right:0;">
          <el-button @click="search" type="info">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="dateBox">
      <div class="dateSelectBox">
        <span>选择开始日期：</span>
        <el-date-picker v-model="pickerSelectDay" type="date" placeholder="选择日期" @change="getAllDay" :editable="false" clearable
                        style="margin-top: 5px;"></el-date-picker>
      </div>
      <div class="dateBox">
        <el-tabs v-model="activeDay" @tab-click="changeDay">
          <el-tab-pane v-for="(day,index) in days" :key="index" :label="day" :name="day"></el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo" style="width: 100%;">
        <el-table-column width="200" label="房间号" prop="roomNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="时间段" prop="time" show-overflow-tooltip></el-table-column>
        <el-table-column label="事项名称" prop="affairName" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" prop="affairType" show-overflow-tooltip></el-table-column>
        <el-table-column label="登记人" prop="creater" show-overflow-tooltip></el-table-column>
        <el-table-column label="接待对象" prop="receptionObject" show-overflow-tooltip></el-table-column>
        <el-table-column label="人数" prop="peopleNum" show-overflow-tooltip></el-table-column>
        <!--<el-table-column label="开放时间列表" prop="openTimeList">-->
        <!--<template scope="scope">-->
        <!--<el-tag class="rusTimeSlot" :type="item.status === 'tenancyEnds' ? 'danger' : 'success'" v-for="(item,index) in scope.row.openTimeList"-->
        <!--:key="index">-->
        <!--{{ item.startTime }} - {{ item.endTime }}-->
        <!--</el-tag>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>

    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'RoomUsageStatisticsRoomInfo',
    data () {
      return {
        self: this,
        showMoreSearch: false, // 更多筛选
        totalCount: 0,
        dynamicHt: 0,
        tableHeight: 0,
        useType: {},
        tableData: [],
        searchObj: { // 搜索
          affairName: '', //  事项名称
          roomNum: '', // 房间号
          date: '', // 	日期(yyyy-MM-dd)
          receptionObject: '', // 接待对象
          affairType: '', // 事务类型
          peopleNum: '', // 人数
          roomNum: '', // 房间号
          userName: '' // 登记人
        },
        pickerSelectDay: new Date(),
        activeDay: '',
        days: []
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.roomInfoList.path,
          method: api.roomInfoList.method,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        this.getAllDay();
        this.getTypeOption();
      },
      changeDay () {
        this.totalCount = 0;
        this.changePage(1);
      },
      /**
       * 计算全天候的日期
       * 指定日期后的五天日期
       * */
      getAllDay (day) {
        let now = (day ? new Date(day) : new Date()).getTime();
        let days = [];
        for (let i = 0; i < 7; i++) {
          days.push(this.conductDate(new Date(now + (i * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd'));
        }
        this.days = days;
        this.activeDay = days[0];
        this.changeDay();
      },
      // 获取使用类型
      getTypeOption () {
        let opt = {
          ajaxSuccess: res => {
            let useType = {};
            res.data.map(item => {
              useType[item.code] = item;
            });
            this.useType = useType;
            this.setTableData();
          },
          ajaxParams: {
            url: api.getAffairType.path,
            method: api.getAffairType.method
          }
        };
        this.ajax(opt);
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        this.searchObj.date = this.activeDay;
        Object.assign(this.queryQptions.params, this.searchObj);
        let opt = {
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        };
        this.ajax(opt, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let contenHeight = this.$refs.roomInfo.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 100;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
        console.log('调用了');
      },
      /************************* 搜索逻辑 *********************************/
      search () {
        this.setTableData();
      },
      // 获取筛选按钮图标
      getSearchBtnIcon () {
        return this.showMoreSearch ? 'arrow-up' : 'arrow-down';
      },
      // 显示更多筛选
      openMoreSearch () {
        this.showMoreSearch = !this.showMoreSearch;
        this.$nextTick(() => {
          if (this.showMoreSearch) {
            this.tableHeight = this.dynamicHt - this.$refs.showMoreSearch.offsetHeight;
          } else {
            this.tableHeight = this.dynamicHt;
          }
        });
      }
    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    components: {}
  };

</script>
