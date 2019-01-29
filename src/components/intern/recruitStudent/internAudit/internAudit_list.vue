<!-- 实习生审核 -->
<template>
  <div ref="internAuditListMain">
    <el-form :inline="true" class="internAuditList">
      <el-row>
        <el-col :span="10">
          <el-button type="success" @click="allExamine">批量审核</el-button>
        </el-col>
        <el-col :span="14" align="right" style="padding-bottom:20px;">
          <el-input :maxlength="20" placeholder="请输入姓名" icon="search" v-model="searchObj.userName" :on-icon-click="search" style="width:300px;"></el-input>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
        <div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">
          <el-form-item label="姓名：">
            <el-input v-model="searchObj.userName"></el-input>
          </el-form-item>
          <el-form-item label="学校：">
            <el-input v-model="searchObj.schoolName"></el-input>
          </el-form-item>
          <!--<el-form-item label="年份：">-->
            <!--<el-date-picker v-model="searchObj.year" align="right" :editable="false" type="year" placeholder="选择年">-->
            <!--</el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item label="手机号：">
            <el-input v-model="searchObj.mobile"></el-input>
          </el-form-item>
          <!--<el-form-item label="民族：">-->
            <!--<el-select v-model="searchObj.nation" filterable clearable placeholder="请选择" style="width:175px;" class="nation">-->
              <!--<el-option v-for="(item,index) in nationOption" :key="index" :label="item.id" :value="item.name">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-button type="info" @click="search">搜索</el-button>
        </div>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData" tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="55" :selectable="canTodo"></el-table-column>
        <el-table-column label="序号" prop="index" width="100"></el-table-column>
        <el-table-column label="操作" width="180">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="danger" @click="examine(scope.row)" v-if="scope.row.state === 'NOT_AUDIT'">审核</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" width="200"></el-table-column>
        <el-table-column prop="schoolName" label="学校" show-overflow-tooltip></el-table-column>
        <el-table-column prop="major" label="专业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="state" label="状态" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.state | typeText }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
          :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :parent="self" :content="headerContent.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--审核弹窗-->
    <Modal :mask-closable="false" v-model="examineModal" height="200" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :parent="self" :content="headerContent.examineId"></modal-header>
      <examine v-if="examineModal" @cancel="cancel" @examine="subCallback" :operaility-data="operailityData"></examine>
      <div slot="footer"></div>
    </Modal>
    <!-- 上报 -->
    <Modal :mask-closable="false" v-model="allExamineModal" class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="headerContent.allExamineId"></modal-header>
      <div v-if="allExamineModal">
        <el-form>
          <el-form-item label="批量审核：">
            {{ getAllExamineName(multipleSelection) }}
          </el-form-item>
        </el-form>
        <div align="center">
          <el-button type="info" @click="allExamineCall('PASS')">通过</el-button>
          <el-button type="danger" @click="allExamineCall('REJECT')">驳回</el-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util;
  import api from './api';
  import dictionary from '../../../../libs/dictionary'; // 字典
  import show from '../usersManagement/usersManagement_view.vue'; // 查看
  import examine from './internAudit_examine'; // 审核
  export default {
    data() {
      return {
        nationOption: dictionary.nation,
        searchMore: false,
        searchObj: {
          userName: '', // 姓名
          schoolName: '', // 学校名称
          year: '', // 年份
          mobile: '', // 手机号
          idNumber: '', // 身份号
          nation: '', // 民族
        },
        loading:false,
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        allExamineIds:[],
        multipleSelection:"",
        operailityData: [],
        tableData: [],
        totalCount: 0,
        allExamineModal:false,
        examineModal: false,
        headerContent: {
          showId: {
            id: "showId",
            title: '查看'
          },
          examineId: {
            id: "examineId",
            title: '审核'
          },
          allExamineId:{
            id: "allExamineId",
            title: '批量审核'
          },
        }
      }
    },
    methods: {
      init: function () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.setTableData()
      },
      /********************************* 按钮事件 *****************************/
      canTodo(row){
        return row.state != 'AUDIT_SUCCESS'
      },
      // 搜索
      search() {
        this.setTableData()
      },
      // 筛选
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          if (this.searchMore) {
            this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight;
          } else {
            this.tabHeight = this.dynamicHt
          }
        })
      },
      // 查看
      show(row) {
        row.id = row.userId;
        this.operailityData = row;
        this.openModel('show')
      },
      // 审核
      examine(row) {
        row.id = row.userId;
        this.operailityData = row;
        this.openModel('examine')
      },
      // 批量审核
      allExamine(){
        if (this.isSelected()){
          this.openModel('allExamine')
        }
      },
      allExamineCall(spState){
        let opt = {
          ajaxSuccess: ()=>this.subCallback('allExamine','批量操作成功'),
          ajaxParams:{
            url:api.modifySpTrialSxUsers.path + this.allExamineIds.join(','),
            method:api.modifySpTrialSxUsers.method,
            data:{
              spState,
              deposit:"",
              zsCost:"",
            }
          }
        };
        this.ajax(opt)
      },
      getAllExamineName(arr){
        let names = [];
        let myArr = [];
        (arr || []).map(item=>{
          names.push(item.userName);
          myArr.push(item.userId);
        });
        this.allExamineIds = myArr;
        return names.join('、') + '。';
      },
      /********************************* 表格相关 *****************************/
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
        let params = this.queryQptions.params;
        params.year = this.conductDate(params.year, 'yyyy');
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = this.addIndex(res.data || []);
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.internAuditListMain.parentNode.offsetHeight;
        let tableData = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
        this.tabHeight = this.dynamicHt;
      },
      /********************************* 弹窗相关 *****************************/
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
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      // 弹窗回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
    },
    components: {
      show,
      examine
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
  }

</script>

<style lang="scss">
  .internAuditList {
    .nation .el-input {
      width: 100%;
    }
  }

</style>
