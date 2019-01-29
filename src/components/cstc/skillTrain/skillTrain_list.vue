<!--
****--@name     技能培训
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div ref="content">
    <el-row style="padding-bottom:20px;">
      <el-col :span="14">
        <!-- 操作按钮 -->
        <el-button size="small" type="info" @click="add">新建技能培训</el-button>
        <el-button size="small" type="success" @click="toChannel">Excel导入</el-button>
        <el-button size="small" type="danger" @click="remove">删除技能培训</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="10" align="right">
        <el-col :span="20">
          <el-input placeholder="请输入项目名称" v-model="searchObj.trainingName" style="max-width: 300px">
            <el-button slot="append" icon="search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">筛选</el-button>
        </el-col>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
      <el-form :inline="true">
        <el-form-item label="项目名称:">
          <el-input v-model="searchObj.trainingName"></el-input>
        </el-form-item>
        <el-form-item label="负责人:">
          <el-input v-model="searchObj.user"></el-input>
        </el-form-item>
        <el-form-item label="培训开始日期:">
          <date-group :dateGroup="{text:'',startDate:searchObj.startTime,endDate:searchObj.endTime}">
            <el-date-picker name="start" v-model="searchObj.startTime" :editable="false" type="date" placeholder="选择日期"
                            :picker-options="pickerOptions0" @change="handleStartTime"></el-date-picker>
            <span>-</span>
            <el-date-picker name="end" v-model="searchObj.endTime" :editable="false" type="date" placeholder="选择日期"
                            :picker-options="pickerOptions1" @change="handleEndTime"></el-date-picker>
          </date-group>
        </el-form-item>
        <el-form-item style="margin-right:0;">
          <el-button @click="search" type="info">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" width="70">
          <template scope="scope">
            <el-button size="small" type="primary" @click="show(scope.row)">查看</el-button>
            <!--<el-button size="small" type="primary" @click="edit(scope.row)">修改</el-button>-->
          </template>
        </el-table-column>
        <el-table-column label="技能培训名称" prop="trainingName" show-overflow-tooltip></el-table-column>
        <el-table-column label="负责人" prop="user" show-overflow-tooltip></el-table-column>
        <el-table-column label="手机号" prop="phone" show-overflow-tooltip></el-table-column>
        <el-table-column label="开始日期" prop="startTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.startTime | formatDate('yyyy-MM-dd') || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="总课时" prop="timeLong" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 查看 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 增加 -->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="contentHeader.addId"></modal-header>
      <edit v-if="addModal" @cancel="cancel" @add="subCallback"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 编辑 -->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 删除 -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" class-name="vertical-center-modal"
           :loading="loading" :width="500">
      <modal-header slot="header" :content="contentHeader.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--导入弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="toChannelModal"
           class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="contentHeader.toChannelId"></modal-header>
      <to-channel v-if="toChannelModal" @toChannel="subCallback" @cancel="cancel"
                  :operaility-data="operailityData"></to-channel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'; // API
  import show from './skillTrain_view.vue'; // 查看
  import edit from './skillTrain_input.vue'; // 编辑
  import toChannel from './skillTrain_toChannel.vue'; // 导入
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        totalCount: 0,
        self: this,
        tableHeight: 0,
        dynamicHt: 100, // 表格高度
        deleteUrl: api.delete,
        loading: false,
        reportModal: false,
        showMoreSearch: false, // 更多筛选
        toChannelModal: false,
        operailityData: [],
        multipleSelection: [], // 表格已选集
        searchObj: { // 搜索
          trainingName: '', //  名称
          user: '', // 负责人
          startTime: '', // 开始时间
          endTime: '' // 结束时间
        },
        tableData: [],
        // 模态框提示
        contentHeader: {
          addId: {
            id: 'addId',
            title: '新建技能培训'
          },
          showId: {
            id: 'showId',
            title: '查看技能培训'
          },
          editId: {
            id: 'editId',
            title: '编辑技能培训'
          },
          reportId: {
            id: 'reportId',
            title: '上报技能培训'
          },
          removeId: {
            id: 'removeId',
            title: '删除技能培训'
          },
          toChannelId: {
            id: 'toChannelId',
            title: '导入技能培训'
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
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        this.setTableData();
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
        let data = res.data;
        if (data instanceof Array) {
          data.map(item => item.id = item.trainingId);
        } else {
          data = [];
        }
        this.tableData = data;
      },
      //设置表格及分页的位置
      setTableDynHeight (otherHeight = 0) {
        let contenHeight = this.$refs.content.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 50 + otherHeight;
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
          this.showMess('只能选择一条数据!');
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
      //导入
      toChannel () {
        if (this.isSelected(true)) {
          this.operailityData = this.multipleSelection[0];
          this.openModel('toChannel');
        }
      },
      // 删除
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove');
        }
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
    components: {
      show, edit, toChannel
    }
  };

</script>
