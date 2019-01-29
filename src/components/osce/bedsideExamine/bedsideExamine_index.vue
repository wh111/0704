<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div ref="content">
    <!-- 搜索 -->
    <el-row style="padding-bottom:20px;">
      <!-- 搜索框 -->
      <el-col align="right">
        <el-input placeholder="请输入学生姓名" v-model="searchObj.userName" style="max-width:250px">
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-input>
        <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div ref="showMoreSearch" align="right" style="overflow:hidden;" v-show="showMoreSearch">
      <el-form :inline="true">
        <el-row>
          <el-form-item label="姓名:">
            <el-input v-model="searchObj.userName"></el-input>
          </el-form-item>
          <el-form-item label="生源类型:">
            <el-select v-model="searchObj.userType" clearable placeholder="请选择">
              <el-option v-for="item in userTypeOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室:">
            <el-select v-model="searchObj.depId" filterable clearable placeholder="请选择科室">
              <select-option type="byUserType" :role="userType" :userId="userId"></select-option>
            </el-select>
          </el-form-item>
          <date-group :dateGroup="{text:'',startDate:searchObj.startTime,endDate:searchObj.endTime}"
                      style="display: inline;">
            <el-form-item label="开始时间：" prop="sxBeginTime">
              <el-date-picker v-model="searchObj.startTime" :editable="false" type="date" placeholder="选择日期"
                              :picker-options="pickerOptions0"
                              @change="handleStartTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" prop="sxEndTime">
              <el-date-picker v-model="searchObj.endTime" :editable="false" type="date" placeholder="选择日期"
                              :picker-options="pickerOptions1"
                              @change="handleEndTime"></el-date-picker>
            </el-form-item>
          </date-group>
          <el-button @click="search" type="info">查询</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo" style="width: 100%;">
        <el-table-column label="操作" width="230">
          <template scope="scope">
            <el-button size="small" type="info" @click="add(scope.row)">新建考核</el-button>
            <el-button size="small" type="success" @click="show(scope.row)">历史考核记录</el-button>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="生源" prop="podClass" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.podClass | userRoluName }}
          </template>
        </el-table-column>
        <el-table-column label="科室" prop="depName" show-overflow-tooltip></el-table-column>
        <el-table-column label="入科时间" prop="rotaryBeginTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="出科时间" prop="rotaryEndTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="带教老师" prop="teacherName" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="1000">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择评分表 -->
    <Modal :mask-closable="false" v-model="selectScoreModal" height="200" title="对话框标题"
           class-name="vertical-center-modal"
           :width="1000">
      <modal-header slot="header" :content="selectScoreId"></modal-header>
      <select-score v-if="selectScoreModal" @cancel="cancel('selectScore')" @select="selectScoreCall"></select-score>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import userTypeOption from './userTypeOption';
  import add from './user/user_input.vue';
  import selectScore from '../assessmentContent/assessmentContentScore/assessmentContentScore_select.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        self: this,
        tableHeight: 100,
        dynamicHt: 100,
        userTypeOption,
        showMoreSearch: false, // 更多筛选
        selectScoreModal: false,
        searchObj: { // 搜索
          userName: '', // 姓名
          userType: '', // 生源
          depId: '', // 科室
          startTime: '', // 开始时间
          endTime: '', // 结束时间
        },
        totalCount: 0,
        tableData: [],
        operailityData: '',
        // 模态框提示
        addId: {
          id: 'addId',
          title: '新建考核'
        },
        selectScoreId: {
          id: 'selectScoreId',
          title: '选择评分表'
        },
        // 当前登录人的用户信息
        userId: '',
        userName: '',
        userType: '',
      }
    },
    methods: {
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init() {
        Util = this.$util;

        let userInfo = this.$store.getters.getUserInfo;
        this.userType = userInfo.studentTypes;
        this.userId = userInfo.id;
        this.userName = userInfo.name;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.userList.path,
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
        this.$nextTick(() => {
          if (this.showMoreSearch) {
            this.tableHeight = this.dynamicHt - this.$refs.showMoreSearch.offsetHeight;
          } else {
            this.tableHeight = this.dynamicHt;
          }
        })
      },
      /************************* 表格逻辑 *********************************/
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData() {
        Object.assign(this.queryQptions.params, this.searchObj);
        let data = this.queryQptions.params;
        data.startTime = this.conductDate(data.startTime, 'yyyy-MM-dd') || '';
        data.endTime = this.conductDate(data.endTime, 'yyyy-MM-dd') || '';
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
        let contenHeight = this.$refs.content.parentNode.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 50 + otherHeight;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
      },
      /************************************** 模态框处理 **************************************************/
      // 新建
      add(row) {
        this.operailityData = row;
        this.openModel('selectScore')
      },
      // 选择评分表回调
      selectScoreCall(res) {
        let {id: scoreTableId, scoreTableName} = res;
        this.operailityData.scoreTableId = scoreTableId;
        this.operailityData.scoreTableName = scoreTableName;
//        this.operailityData.teacherId = this.userId;
//        this.operailityData.teacherName = this.userName;
        this.openModel('add');
        this.cancel('selectScore');
      },
      // 查看
      show(row) {
        this.$emit('show', {
          view: 'user',
          title: row.userName,
          id: row.userId,
          rowData: row,
        })
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      // 回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
    },
    created() {
      this.init();
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
    components: {
      add,
      selectScore,
    }
  }

</script>
