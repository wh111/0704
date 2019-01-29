<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div ref="content">
    <el-row style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #dfe6ec;" v-if="!fromWhere">
      <el-col :span="22" align="center">
        <h2 style="line-height:30px;">{{ title && title + '历史考核记录' || '' }}</h2>
      </el-col>
      <el-col :span="2" align="right">
        <el-button type="info" size="small" @click="backList">返回列表</el-button>
      </el-col>
    </el-row>
    <!-- 搜索 -->
    <el-row style="padding-bottom:20px;">
      <el-col :span="4" v-if="!fromWhere">
        <el-button type="info" @click="add">新建考核</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="fromWhere ? 24 : 20" align="right">
        <span>考核名称：</span>
        <el-input  placeholder="请输入考核名称" v-model="searchObj.examName" style="max-width:180px" >
          <!--<el-button slot="append" icon="search" @click="search"></el-button>-->
        </el-input>
        <el-button @click="search" type="info" v-show="!showMoreSearch">查询</el-button>
        <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div ref="showMoreSearch" align="right" style="overflow:hidden;" v-show="showMoreSearch">
      <el-form :inline="true">
        <el-row>
          <!--<el-form-item label="考核名称:">-->
            <!--<el-input v-model="searchObj.examName"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="科室:">
            <el-select v-model="searchObj.depId" filterable clearable placeholder="请选择科室">
              <select-option type="byUserType" :role="userType" :userId="userId"></select-option>
            </el-select>
          </el-form-item>
          <date-group :dateGroup="{text:'',startDate:searchObj.examStartTime,endDate:searchObj.examEndTime}"
                      style="display: inline;">
            <el-form-item label="开始时间：" prop="examStartTime">
              <el-date-picker v-model="searchObj.examStartTime" :editable="false" type="date" placeholder="选择日期"
                              :picker-options="pickerOptions0"
                              @change="handleStartTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" prop="examEndTime">
              <el-date-picker v-model="searchObj.examEndTime" :editable="false" type="date" placeholder="选择日期"
                              :picker-options="pickerOptions1"
                              @change="handleEndTime"></el-date-picker>
            </el-form-item>
          </date-group>
          <el-button @click="search" type="info" v-show="showMoreSearch">查询</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo" style="width: 100%;">
        <el-table-column label="操作" width="260">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">详情</el-button>
            <el-button size="small" type="info" @click="edit(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="defaultScore(scope.row)"
                       :disabled="scope.row.isGraduateMark == 'YES'">设为出科成绩
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="考核名称" prop="examName" show-overflow-tooltip></el-table-column>
        <el-table-column label="考核时间" prop="examTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="考核成绩" prop="mark" show-overflow-tooltip></el-table-column>
        <el-table-column label="科室名称" prop="depName" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否出科考核成绩" prop="isGraduateMark" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.isGraduateMark | typeText }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 模态框 编辑 -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="1000">
      <modal-header slot="header" :content="contentHeader.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :bedsideId="operailityData.bedsideId"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal :width="1000" v-model="showModal" title="查看档案管理弹窗" class-name="vertical-center-modal" @on-cancel="cancel">
      <modal-header slot="header" :content="contentHeader.viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :bedsideId="operailityData.bedsideId"></show>
      <div slot="footer"></div>
    </Modal>
    <!--设置默认弹窗-->
    <Modal :width="500" v-model="defaultScoreModal" class-name="vertical-center-modal" @on-cancel="cancel">
      <modal-header slot="header" :content="contentHeader.defaultScoreId"></modal-header>
      <default-score v-if="defaultScoreModal" @set="subCallback" @cancel="cancel"
                     :operailityData="operailityData"></default-score>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="1000">
      <modal-header slot="header" :content="contentHeader.addId"></modal-header>
      <edit v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择评分表 -->
    <Modal :mask-closable="false" v-model="selectScoreModal" height="200" title="对话框标题"
           class-name="vertical-center-modal"
           :width="1000">
      <modal-header slot="header" :content="contentHeader.selectScoreId"></modal-header>
      <select-score v-if="selectScoreModal" @cancel="cancel('selectScore')" @select="selectScoreCall"></select-score>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api';
  import edit from './user_input.vue';
  import show from './user_view.vue';
  import defaultScore from './user_defaultScore.vue';
  import selectScore from '../../assessmentContent/assessmentContentScore/assessmentContentScore_select.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['title', 'id', 'rowData','fromWhere'],
    data() {
      return {
        self: this,
        tableHeight: 100,
        dynamicHt: 100,
        showMoreSearch: false, // 更多筛选
        defaultScoreModal: false,
        selectScoreModal: false,
        searchObj: { // 搜索
          userId: this.id, // 学生id
          examName: '', // 考核名称
          depId: '', // 科室
          examStartTime: '', // 开始时间
          examEndTime: '', // 结束时间
        },
        totalCount: 0,
        tableData: [],
        operailityData: '',
        // 模态框提示
        contentHeader: {
          addId: {
            id: 'addId',
            title: '新建考核'
          },
          viewId: {
            id: 'viewId',
            title: '考核详情'
          },
          editId: {
            id: 'editId',
            title: '修改考核'
          },
          defaultScoreId: {
            id: 'defaultScoreId',
            title: '设为出科成绩'
          },
          selectScoreId: {
            id: 'selectScoreId',
            title: '选择评分表'
          },
        },
        userId: '',
        userType: '',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;

        let userInfo = this.$store.getters.getUserInfo;
        this.userType = userInfo.studentTypes;
        this.userId = userInfo.id;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          }
        }
        this.setTableData();
      },
      // 返回列表
      backList() {
        this.$emit('show', {
          view: 'index'
        })
      }, /************************* 搜索逻辑 *********************************/
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
        data.examStartTime = this.conductDate(data.examStartTime, 'yyyy-MM-dd') || '';
        data.examEndTime = this.conductDate(data.examEndTime, 'yyyy-MM-dd') || '';
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
      add() {
        this.operailityData = this.rowData;
        this.openModel('selectScore')
      },
      // 选择评分表回调
      selectScoreCall(res) {
        let {id: scoreTableId, scoreTableName} = res;
        this.operailityData.scoreTableId = scoreTableId;
        this.operailityData.scoreTableName = scoreTableName;
        this.operailityData.teacherId = this.userId;
        this.operailityData.teacherName = this.userName;
        this.openModel('add');
        this.cancel('selectScore');
      },
      // 修改
      edit(row) {
        this.operailityData = row;
        this.openModel('edit');
      },
      // 默认成绩
      defaultScore(row) {
        this.operailityData = row;
        this.openModel('defaultScore');
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show');
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
      edit,
      show,
      defaultScore,
      selectScore,
    }
  }

</script>
