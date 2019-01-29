<!--
****--@file     project_list
****--@date     2018/6/7 17:54
****--@author   YC
****--@describe 自主训练
-->
<template>
  <div ref="bespeakSearchProject">
    <!--<el-row>-->
    <!--&lt;!&ndash;<el-col :span="14">&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash; 操作按钮 &ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;<el-button type="success" @click="set(false)">预约设置</el-button>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
    <!--&lt;!&ndash; 搜索框 &ndash;&gt;-->
    <!--<el-col align="right">-->
    <!--<el-form :inline="true" label-width="20px">-->
    <!--<el-form-item>-->
    <!--<el-input placeholder="请输入房间名称" v-model="searchObj.roomName">-->
    <!--<el-button slot="append" icon="search" @click="search"></el-button>-->
    <!--</el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item>-->
    <!--<el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!-- 多条件 -->
    <!--<div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">-->
    <!--<el-form :inline="true" label-width="74px">-->
    <!--<el-form-item label="房间名称:">-->
    <!--<el-input v-model="searchObj.roomName"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="房间号:">-->
    <!--<el-input v-model="searchObj.roomNum"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="房间位置:">-->
    <!--<el-input v-model="searchObj.address"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="是否开放:">-->
    <!--<el-select v-model="searchObj.isOpen" placeholder="请选择">-->
    <!--<el-option v-for="item in selectType" :key="item.value" :label="item.label" :value="item.value">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--</el-form-item>-->
    <!--<el-form-item>-->
    <!--<el-button @click="search">查询</el-button>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--</div>-->

    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo"
                style="width: 100%;" @selection-change="handleSelectionChange">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column label="操作" width="140" align="center">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="success" @click="info(scope.row)">考勤</el-button>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="房间号" prop="roomNum" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.roomList | getArrText('roomNum') }}
          </template>
        </el-table-column>
        <!--<el-table-column label="授课人" prop="lecturer" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column label="授课对象" prop="userType" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column label="申请人" prop="creater" show-overflow-tooltip></el-table-column>-->
        <el-table-column label="开放日期" prop="timeModel" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.timeModel | typeText }}
          </template>
        </el-table-column>
        <el-table-column label="预约人数" prop="applicantsNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="预约对象" prop="userType" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.userType | showUserType }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 查看 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" :opData="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 考勤 -->
    <Modal :mask-closable="false" v-model="infoModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.infoId"></modal-header>
      <info v-if="infoModal" :operaility-data="operailityData"></info>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  /*当前组件必要引入*/
  import api from '../api';
  import selectType from '../../bespeakSetting/room/selectType';
  //  import show from './project_view';
  import show from '../../bespeakSetting/project/project_view';
  import info from '../room/room_info';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'projectList',
    props: {
      contenHeight: {
        type: Number,
        default: 100
      },
      update: { // 是否更新表格数据
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        totalCount: 0,
        self: this,
        selectType,
        tableHeight: 0,
        dynamicHt: 100, // 表格高度
        loading: false,
        showMoreSearch: false, // 更多筛选
        showModal: false, // 查看
        infoModal: false, // 考勤

        operailityData: '',
        multipleSelection: '', // 表格已选集
        searchObj: { // 搜索
          roomName: '', //  房间名称
          roomNum: '', // 房间号
          isOpen: '', // 是否开放预约
          address: '', // 房间所在位置
          sortby: '', // 排序字段
          order: '' // 排序方式
        },
        tableData: [],
        // 模态框提示
        contentHeader: {
          infoId: {
            id: 'infoId',
            title: '查看自主训练考勤'
          },
          showId: {
            id: 'showId',
            title: '查看自主训练详情'
          }
        }
      };
    },
    methods: {
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init () {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.projectList.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        this.setTableData();
      },
      /************************* 搜索逻辑 *********************************/
      search () {
        Object.assign(this.queryQptions.params, this.searchObj);
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
        Object.assign(this.queryQptions.params, this.tree);
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
      setTableDynHeight () {
        let tableView = this.$refs.tableView;
        let paginationHt = 40;
        this.dynamicHt = this.contenHeight - tableView.offsetTop - paginationHt;
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
      /************************************** 模态框处理 **************************************************/
      // 增加，选择考核类型
      show (row) {
        this.operailityData = row;
        this.openModel('show');
      },
      // 设置
      info (row) {
        this.operailityData = row;
        this.openModel('info');
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove');
        }
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
    watch: {
      contenHeight (val) {
        this.setTableDynHeight();
      }
    },
    components: {
      show, info
    }
  };

</script>
