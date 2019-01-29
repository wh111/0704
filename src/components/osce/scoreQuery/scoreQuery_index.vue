<template>
  <!-- 列表数据 -->
  <div ref="dataList">
    <!-- 搜索 -->
    <el-row>
      <el-col align="right" style="width:90px;float:right;">
        <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
      </el-col>
      <el-col :span="6" style="float:right;">
        <el-input placeholder="请输入考核名称" v-model="searchObj.sceneName">
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div class="editForm noMarginBottom" style="overflow:hidden;" v-show="showMoreSearch">
      <el-form :inline="true" style="margin-top:10px;float:right;" label-width="74px">
        <el-row>
          <el-form-item label="考核名称:">
            <el-input v-model="searchObj.sceneName"></el-input>
          </el-form-item>
          <el-form-item label="考核类型:">
            <el-select v-model="searchObj.sceneType" placeholder="请选择">
              <el-option v-for="item in examineTypeOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="考核状态:">
            <el-select v-model="searchObj.status" placeholder="请选择">
              <el-option v-for="item in examineStatuOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-button @click="search">查询</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <div id="tableView" ref="tableView" style="padding-top:10px;">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo"
        style="width: 100%;">
        <el-table-column label="序号" type="index" width="80" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="80">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="考核名称" prop="sceneName" show-overflow-tooltip></el-table-column>
        <el-table-column label="开始时间" prop="statrTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="站数" prop="stationNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="考核人数" width="120" prop="examineeNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="考核类型" prop="sceneType" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.sceneType | typeText }}
          </template>
        </el-table-column>
        <!--<el-table-column label="状态" prop="status" show-overflow-tooltip>-->
          <!--<template scope="scope">-->
            <!--{{ scope.row.status | typeText }}-->
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
  let Util = null;

  import examineIntervalApi from '../examineInterval/api'; // 考核场次api

  import examineTypeOption from '../examineInterval/examineTypeOption'; // 类型选择
  import examineStatuOption from '../examineInterval/examineStatuOption'; // 状态选择

  import view from './scoreQuery_view'; // 查看

  export default {
    data() {
      return {
        self: this,
        dynamicHt: 100,
        examineTypeOption,
        examineStatuOption,
        showMoreSearch: false, // 更多筛选
        searchObj: { // 搜索
          sceneName: '', // 场次名称
          sceneType: '', // 类型
          status: 'FINISH' // 状态
        },
        totalCount: 0,
        tableData: [],
      }
    },
    methods: {
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init() {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: examineIntervalApi.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          }
        }
        this.setTableData();
      },
      /************************* 搜索逻辑 *********************************/
      search() {
        this.setTableData();
      },
      // 获取筛选按钮图标
      getSearchBtnIcon() {
        return this.showMoreSearch ? 'arrow-up' : 'arrow-down'
      },
      // 显示更多筛选
      openMoreSearch() {
        this.showMoreSearch = !this.showMoreSearch
        if (this.showMoreSearch) {
          this.dynamicHt = this.dynamicHt - 47;
        } else {
          this.dynamicHt = this.dynamicHt + 47;
        }
      },
      /************************* 表格逻辑 *********************************/
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData() {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        })
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight(otherHeight = 0) {
        let contenHeight = this.$refs.dataList.parentNode.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 50 + otherHeight + 16;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
      },
      // 查看
      show(row) {
        this.$emit('show', {
          view: 'view',
          title: row.sceneName,
          id: row.id
        })
      },
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    created() {
      Util = this.$util;
      this.init()
    }
  }

</script>

<style lang="scss">
  .noMarginBottom {
    .el-form-item {
      margin-bottom: 0;
    }
  }

</style>
