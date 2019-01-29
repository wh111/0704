<template>
  <!-- 预约申请 -->
  <div id="bespeakClass" ref="bespeakSetRoom">
    <el-row style="padding-bottom:20px;">
      <el-col :span="14">
        <!-- 操作按钮 -->
        <el-button size="small" type="success" @click="add">新建申请</el-button>
        <el-button size="small" type="danger" @click="remove">删除申请</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="10" align="right">
        <el-col :span="20">
          <el-input placeholder="请输入课程名称" v-model="searchObj.name">
            <el-button slot="append" icon="search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
        </el-col>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
      <el-form :inline="true">
        <el-form-item label="课程名称:">
          <el-input v-model="searchObj.name"></el-input>
        </el-form-item>
        <el-form-item label="申请时间:">
          <date-group :dateGroup="{text:'',startDate:searchObj.createStartTime,endDate:searchObj.createEndTime}">
            <el-date-picker name="start" v-model="searchObj.createStartTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0" @change="handleStartTime"></el-date-picker>
            <span>-</span>
            <el-date-picker name="end" v-model="searchObj.createEndTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime"></el-date-picker>
          </date-group>
        </el-form-item>
        <el-form-item label="开放预约状态:">
          <el-select v-model="searchObj.status" placeholder="请选择">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right:0;">
          <el-button @click="search" type="info">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" width="200">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
            <!--<template v-if="scope.row.status === 'UNREPORTED' || scope.row.status === 'REJECT'">-->
              <el-button size="small" type="primary" v-if="['UNREPORTED','REJECT'].includes(scope.row.status)" @click="edit(scope.row)">修改</el-button>
              <el-button size="small" type="warning" v-if="['UNREPORTED','REJECT'].includes(scope.row.status)" @click="changStatus(scope.row,'PENDING')">上报</el-button>
              <el-button size="small" type="warning" v-if="['ADOPT'].includes(scope.row.status)" @click="changStatus(scope.row,'START')">开课</el-button>
              <el-button size="small" type="warning" v-if="['START'].includes(scope.row.status)" @click="changStatus(scope.row,'INCLASS')">上课</el-button>
              <el-button size="small" type="warning" v-if="['INCLASS'].includes(scope.row.status)" @click="changStatus(scope.row,'UNEVALUATED')">下课</el-button>
              <el-button size="small" type="warning" v-if="['UNEVALUATED'].includes(scope.row.status)" @click="evaluate(scope.row)">评价</el-button>
              <el-button size="small" type="warning" v-if="['END'].includes(scope.row.status)" @click="video(scope.row)">下载视频</el-button>
              <el-button size="small" type="warning"  @click="signIn(scope.row)">签到</el-button>
            <!--</template>-->
          </template>
        </el-table-column>
        <el-table-column label="课程名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="授课人" prop="lecturer" show-overflow-tooltip></el-table-column>
        <el-table-column label="授课对象" prop="userType" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.userType | userType }}
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="creater" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请时间" prop="createTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.createTime | formatDate('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column label="预约状态" prop="status" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.status | bespeakType }}
          </template>
        </el-table-column>
        <el-table-column label="最低开课人数" prop="minNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="已申请人数" prop="applicantsNum" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 增加 -->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.addId"></modal-header>
      <edit v-if="addModal" @cancel="cancel" @add="subCallback"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1000">
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
    <Modal close-on-click-modal="false" height="200" v-model="reportModal" class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="contentHeader.reportId"></modal-header>
      <operate v-if="reportModal"  type="report" @operate="subCallback" @cancel="cancel" :messTitle="messTitle" :operateData="operateData" :operailityData="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!-- 删除 -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="contentHeader.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!-- 评价 -->
    <Modal close-on-click-modal="false" height="200" v-model="evaluateModal" class-name="vertical-center-modal" :loading="loading" :width="1000">
      <modal-header slot="header" :content="contentHeader.evaluateId"></modal-header>
      <myEvaluation v-if="evaluateModal" :noAppraiser="true" :type="'noScoreList'" :url="api.submit.path" :submitBeforeFun="submitBeforeFun"  @add="evaluateCallback" @cancel="evaluateModal=false" :operaility-data="operailityData"></myEvaluation>
      <div slot="footer"></div>
    </Modal>
    <!-- 下载视频 -->
    <Modal close-on-click-modal="false" height="200" v-model="videoModal" class-name="vertical-center-modal" :loading="loading" :width="600">
      <modal-header slot="header" :content="contentHeader.videoId"></modal-header>
      <download-video v-if="videoModal"  :url="api.download.path"  @operate="evaluateCallback" @cancel="cancel" :operaility-data="operailityData"></download-video>
      <div slot="footer"></div>
    </Modal>
    <!--签到弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="signInModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="900">
      <modal-header slot="header" :content="signInId"></modal-header>
      <signIn v-if="signInModal" @cancel="cancel" :operaility-data="operailityData"></signIn>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  let Util = null;
  import api from './api'; // API
  import statusOption from './statusOption'; // 预约状态类型
  import myEvaluation  from '../../common/myEvaluation/myEvaluation.vue' // 评价
  import downloadVideo  from './bespeakClass_downloadVideo.vue' // 评价
//  import add from './bespeakClass_add'; // 新建申请
  import show from './bespeakClass_view'; // 新建申请
  import edit from './bespeakClass_input.vue'; // 新建申请
  import signIn from './bespeakClass_signIn.vue'
  export default {
    data() {
      return {
        signInId: {id: 'signInId', title: '签到'},
        api,
        signInModal:false,
        totalCount: 0,
        self: this,
        statusOption,
        tableHeight: 0,
        dynamicHt: 100, // 表格高度
        loading: false,
        reportModal: false,
        showMoreSearch: false, // 更多筛选
        evaluateModal: false,
        videoModal: false,
        operailityData: [],
        multipleSelection: [], // 表格已选集
        searchObj: { // 搜索
          name: '', //  名称
          createStartTime: '', // 开始时间
          createEndTime: '', // 结束时间
          status: '', // 状态
          // isOpen: '', // 是否开放预约
          // address: '', // 房间所在位置
//          sortby: 'RESERVE_PROJECT_ROOM_CREATETIME', // 排序字段
//          order: 'DESC', // 排序方式
        },

        //改变状态
        messTitle : {
          title: '确定要上报吗？',
          access: '上报成功',
          error: '上报失败'
        },
        operateData:{
          url:api.report.path,
          data:{
            status:'PENDING'
          },
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
          evaluateId: {
            id: 'evaluateId',
            title: '评价'
          },
          editId: {
            id: 'editId',
            title: '编辑预约申请'
          },
          reportId: {
            id: 'reportId',
            title: '上报预约申请'
          },
          removeId: {
            id: 'removeId',
            title: '删除预约申请'
          },
          videoId: {
            id: 'videoId',
            title: '下载视频'
          },
        }
      }
    },
    methods: {
      //签到
      signIn (rowData) {
        this.operailityData = rowData
        this.openModel('signIn')
      },
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init() {
        Util = this.$util;

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
      // 上报
      reportCall() {
        this.ajax({
          ajaxSuccess: res => {
            this.successMess('上报成功');
            this.cancel('report');
            this.setTableData();
          },
          ajaxEorror: () => this.errorMess('上报失败'),
          ajaxParams: {
            url: api.report.path + this.operailityData.id,
            method: api.report.method,
            data: {
              id: this.operailityData.id
            }
          }
        })
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
        this.showMoreSearch = !this.showMoreSearch;
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
        let searchObj = this.formDate(this.$util._.defaultsDeep({}, this.searchObj), ['createStartTime', 'createEndTime']);
        Object.assign(this.queryQptions.params, searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.bespeakSetRoom.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess("请选择数据!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //评价提交数据前回调
      submitBeforeFun( data){
        data.projectId=this.operailityData.id;
        console.log(data);
        return data;
      },
      /************************************** 按钮相关 **************************************************/
      // 新建申请
      add() {
        this.openModel('add')
      },


      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      // 编辑
      edit(row) {
        this.operailityData = row;
        this.openModel('edit')
      },
      //上报 开课 下课 上课
      changStatus(row,type){
          let todoType = {
            "PENDING": "上报",
            "START": "开课",
            "UNEVALUATED": "下课",
            "INCLASS": "上课",
          }
          let title = todoType[type] ||'';
          //弹窗内部消息
          let messTitle = {
            title:`确定要${title}吗？`,
            access: `${title}成功`,
            error: `${title}失败`
          }
        this.contentHeader.reportId.title = `${title}`;
          this.messTitle = messTitle;
          this.operateData.data.status = type;
          this.operailityData = row;
          this.openModel('report');
      },
      //评价
      evaluate(row){
        row.activityId= row.evaluateActivityId;
        row.userId = row.room&&row.room[0];
        this.operailityData = row;
        this.openModel('evaluate');
      },
      //下载视频
      video(row){
        this.operailityData = row;
        this.openModel('video');
      },
      // 删除
      remove() {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove')
        }
      },
      /************************************** 模态框处理 **************************************************/
      //评分表回调
      evaluateCallback(target, title, updata){
        this.cancel('evaluate');
        this.subCallback('',title, updata);
      },

      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },

      // 增加回调
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
//      add,
      edit,
      show,
      myEvaluation,
      downloadVideo,
      signIn
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


</style>
