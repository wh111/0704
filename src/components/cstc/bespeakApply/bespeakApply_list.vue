<template>
  <!-- 预约申请 -->
  <div id="bespeakApply" ref="bespeakSetRoom">
    <el-row style="padding-bottom:20px;">
      <el-col :span="6">
        <!-- 操作按钮 -->
        <el-button type="success" @click="add">新建申请</el-button>
        <el-button type="danger" @click="remove">删除申请</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="18" align="right">
        <span>项目名称：</span>
        <el-input style="width: 60%;max-width: 180px;" placeholder="请输入" v-model="searchObj.reservePojectName">
        </el-input>
        <el-button @click="search" type="info" v-if="!showMoreSearch">查询</el-button>
        <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
      <el-form :inline="true">
        <!--<el-form-item label="项目名称:">-->
        <!--<el-input v-model="searchObj.reservePojectName"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="申请时间:">
          <date-group :dateGroup="{text:'',startDate:searchObj.applicantStarDate,endDate:searchObj.applicantEndDate}">
            <el-date-picker name="start" v-model="searchObj.applicantStarDate" :editable="false" type="date"
                            placeholder="选择日期" :picker-options="pickerOptions0"
                            @change="handleStartTime"></el-date-picker>
            <span>-</span>
            <el-date-picker name="end" v-model="searchObj.applicantEndDate" :editable="false" type="date"
                            placeholder="选择日期" :picker-options="pickerOptions1"
                            @change="handleEndTime"></el-date-picker>
          </date-group>
        </el-form-item>
        <el-form-item label="开放预约状态:">
          <el-select v-model="searchObj.status" placeholder="请选择">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right:0;" v-if="showMoreSearch">
          <el-button @click="search" type="info">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" :width="type=='project'?90:250">
          <template scope="scope">
            <div v-if="!type">
              <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
              <el-button size="small" type="primary" @click="edit(scope.row)" v-if="scope.row.applicantId==userId&&['UNREPORTED'].includes(scope.row.status)">修改</el-button>
              <el-button size="small" type="warning" @click="report(scope.row)" v-if="scope.row.applicantId==userId&&['UNREPORTED'].includes(scope.row.status)">上报</el-button>
              <el-button size="small" type="warning" @click="user(scope.row)" v-if="scope.row.applicantId==userId&&['START'].includes(scope.row.status)">已使用</el-button>
              <el-button size="small" type="warning" @click="evaluate(scope.row)" v-if="scope.row.applicantId==userId&&['UNEVALUATED'].includes(scope.row.status)">评价</el-button>
              <el-button size="small" type="primary" @click="video(scope.row)" v-if="scope.row.applicantId==userId&&['UNEVALUATED','END'].includes(scope.row.status)">下载视频
              </el-button>
            </div>
            <div v-else>
              <el-button size="small" type="info" @click="evaluate(scope.row,true)" v-if="['END'].includes(scope.row.status)">查看评价</el-button>
              <el-button size="small" v-else type="info" :disabled="true">查看评价</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="reservePojectName" show-overflow-tooltip></el-table-column>
        <el-table-column label="房间号" prop="roomNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请使用时间" prop="reserveDate" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.reserveDate | formatDate('yyyy-MM-dd') + ' ' + scope.row.startTime }}
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="applicantName" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请时间" prop="applicatDate" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.applicantDate }}
          </template>
        </el-table-column>
        <el-table-column label="预约状态" prop="status" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.status | typeText }}
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

    <!-- 增加 -->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.addId"></modal-header>
      <edit v-if="addModal" @cancel="cancel" @add="subCallback"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 编辑 -->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 上报 -->
    <Modal close-on-click-modal="false" height="200" v-model="reportModal" class-name="vertical-center-modal"
           :loading="loading" :width="500">
      <modal-header slot="header" :content="contentHeader.reportId"></modal-header>
      <div>
        <p class="remove">确定要上报么？</p>
        <div align="center">
          <el-button type="info" @click="reportCall('START')">确定</el-button>
          <el-button @click="cancel('report')">取消</el-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal close-on-click-modal="false" height="200" v-model="userModal" class-name="vertical-center-modal"
           :loading="loading" :width="500">
      <modal-header slot="header" :content="contentHeader.userId"></modal-header>
      <div>
        <p class="remove">确定已使用么？</p>
        <div align="center">
          <el-button type="info" @click="reportCall('UNEVALUATED')">确定</el-button>
          <el-button @click="cancel('user')">取消</el-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 删除 -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" class-name="vertical-center-modal"
           :loading="loading" :width="500">
      <modal-header slot="header" :content="contentHeader.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!-- 评价 -->
    <Modal close-on-click-modal="false" height="200" v-model="evaluateModal" class-name="vertical-center-modal" :loading="loading" :width="1000">
      <modal-header slot="header" :content="contentHeader.evaluateId"></modal-header>
      <myEvaluation v-if="evaluateModal" :noAppraiser="true" :type="evaluationType" :url="api.submit.path" :submitBeforeFun="submitBeforeFun" @add="evaluateCallback"
                    @cancel="evaluateModal=false" :operaility-data="operailityData"></myEvaluation>
      <div slot="footer"></div>
    </Modal>
    <!-- 下载视频 -->
    <Modal close-on-click-modal="false" height="200" v-model="videoModal" class-name="vertical-center-modal" :loading="loading" :width="600">
      <modal-header slot="header" :content="contentHeader.videoId"></modal-header>
      <download-video v-if="videoModal" :url="api.download.path" @operate="evaluateCallback" @cancel="cancel" :operaility-data="operailityData"></download-video>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  let Util = null;

  import api from './api'; // API
  import statusOption from './statusOption'; // 预约状态类型
  import downloadVideo from '../bespeakClass/bespeakClass_downloadVideo.vue'; // 评价
  import myEvaluation from '../../common/myEvaluation/myEvaluation.vue'; // 评价
  //  import add from './bespeakApply_add'; // 新建申请
  import show from './bespeakApply_view'; // 新建申请
  import edit from './bespeakApply_input.vue'; // 新建申请

  export default {
    props: ['type'],
    data () {
      return {
        api,
        totalCount: 0,
        self: this,
        statusOption,
        evaluationType: 'noScoreList',
        tableHeight: 0,
        dynamicHt: 100, // 表格高度
        loading: false,
        reportModal: false,
        showMoreSearch: false, // 更多筛选
        userModal: false,
        evaluateModal: false,
        videoModal: false,
        operailityData: [],
        multipleSelection: [], // 表格已选集
        searchObj: { // 搜索
          reservePojectName: '', //  名称
          applicantStarDate: '', // 开始时间
          applicantEndDate: '', // 结束时间
          status: '', // 状态
          // isOpen: '', // 是否开放预约
          // address: '', // 房间所在位置
          sortby: 'RESERVE_APPLICANTDATE', // 排序字段
          order: 'DESC' // 排序方式
        },
        tableData: [],
        // 模态框提示
        contentHeader: {
          addId: {
            id: 'addId',
            title: '新建预约申请'
          },
          showId: {
            id: 'showId',
            title: '查看预约申请'
          },
          editId: {
            id: 'editId',
            title: '编辑预约申请'
          },
          evaluateId: {
            id: 'evaluateId',
            title: '评价'
          },
          reportId: {
            id: 'reportId',
            title: '上报预约申请'
          },
          userId: {
            id: 'userId',
            title: '已使用'
          },
          removeId: {
            id: 'removeId',
            title: '删除预约申请'
          },
          videoId: {
            id: 'videoId',
            title: '下载视频'
          }
        },
        userId: ''
      };
    },
    methods: {
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.userId = this.$store.getters.getUserInfo.id;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        this.setTableData();
      },
      // 上报
      reportCall (type) {
        this.ajax({
          ajaxSuccess: res => {

            if (type == 'START') {
              this.successMess('上报成功');
              this.cancel('report');
            } else {
              this.successMess('已使用成功');
              this.cancel('user');
            }
            this.setTableData();
          },
          ajaxEorror: () => {
            if (type == 'START') {
              this.errorMess('上报失败');
            } else {
              this.errorMess('已使用失败');
            }
          },
          ajaxParams: {
            url: api.report.path + this.operailityData.id,
            method: api.report.method,
            data: {
              id: this.operailityData.id,
              status: type
            }
          }
        });
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
      },
      /************************* 表格逻辑 *********************************/
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        let searchObj = this.formDate(this.$util._.defaultsDeep({}, this.searchObj), ['applicantStarDate', 'applicantEndDate']);
        Object.assign(this.queryQptions.params, searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight (otherHeight = 0) {
        let contenHeight = this.$refs.bespeakSetRoom.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let rest = 0;
        if (!this.type) {
          rest = 50;
        }
        let paginationHt = rest + otherHeight;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择数据!');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!');
          flag = false;
        }
        return flag;
      },
      /************************************** 按钮相关 **************************************************/
      // 新建申请
      add () {
        this.openModel('add');
      },
      // 查看
      show (row) {
        this.operailityData = row;
        this.openModel('show');
      },
      // 编辑
      edit (row) {
        this.operailityData = row;
        this.openModel('edit');
      },
      // 上报
      report (row) {
        this.operailityData = row;
        this.openModel('report');
      },
      // 已使用
      user (row) {
        this.operailityData = row;
        this.openModel('user');
      },
      // 删除
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove');
        }
      },
      //评价
      evaluate (row, view) {
        row.activityId = row.evaluateActivityId;
        row.userId = row.reserveProjectId;
        this.operailityData = row;
        if (view) {
          this.evaluationType = 'haveScoreList';
        } else {
          this.evaluationType = 'noScoreList';
        }
        this.openModel('evaluate');
      },
      //下载视频
      video (row) {
        this.operailityData = row;
        this.openModel('video');
      },
      /************************************** 模态框处理 **************************************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },

      // 增加回调
      subCallback (target, title, updata) {
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
      openModel (options) {
        this[options + 'Modal'] = true;
      },

      //评价提交数据前回调
      submitBeforeFun (data) {
        data.reserveId = this.operailityData.id;
        return data;
      },
      //评分表回调
      evaluateCallback (target, title, updata) {
        this.cancel('evaluate');
        this.subCallback('', title, updata);
      }
    },
    components: {
//      add,
      edit,
      show,
      myEvaluation,
      downloadVideo
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
    created () {
      Util = this.$util;
      this.init();
    }
  };

</script>
<style lang="scss">


</style>
