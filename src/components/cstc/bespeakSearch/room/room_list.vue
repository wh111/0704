<!--
****--@file     room_list
****--@date     2018/6/7 17:54
****--@author   YC
****--@describe 预约上课
-->
<template>
  <div ref="bespeakSearchRoom">
    <el-row>
      <el-col :span="8">
        <!-- 操作按钮 -->
        <el-button type="info" @click="derive">{{ 'export' | sysLan }}</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="16" align="right">
        <el-form :inline="true" label-width="20px" onsubmit="return false">
          <el-form-item>
            <el-input placeholder="请输入房间号" v-model="searchObj.roomNum">
              <el-button slot="append" icon="search" @click="search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
      <el-form :inline="true" label-width="74px">
        <el-form-item label="课程名称:">
          <el-input v-model="searchObj.name"></el-input>
        </el-form-item>
        <el-form-item label="授课人:">
          <el-input v-model="searchObj.lecturer"></el-input>
        </el-form-item>
        <el-form-item label="申请人:">
          <el-input v-model="searchObj.creater"></el-input>
        </el-form-item>
        <el-form-item label="授课对象:">
          <el-select v-model="searchObj.userType" placeholder="请选择">
            <el-option v-for="item in userType" :key="item.value" :label="item.label == '所有' ? '所有人员' : item.label" :value="item.label == '所有' ? 'all' : item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchObj.status" placeholder="请选择">
            <el-option v-for="item in selectType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <date-group style="display: inline-block;font-weight:400;"
                    :dateGroup="{text:'',startDate:searchObj.createStartTime,endDate:searchObj.createEndTime}" class="el-form--inline">
          <el-form-item label-width="120px" name="start" label="申请时间:" class="feildFontweight pmStartDateBox" prop="startDate">
            <el-date-picker v-model="searchObj.createStartTime" type="date" :editable="false" placeholder="选择日期"
                            :picker-options="pickerOptions0" @change="handleStartTime">
            </el-date-picker>
            <span>-</span>
            <el-date-picker v-model="searchObj.createEndTime" align="right" type="date" :editable="false"
                            placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
          <!--<el-form-item label="申请结束时间:" label-width="120px" name="end" prop="endDate" class="pmEndDateBox">-->
          <!--<el-date-picker v-model="searchObj.createEndTime" align="right" type="date" :editable="false"-->
          <!--placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime">-->
          <!--</el-date-picker>-->
          <!--</el-form-item>-->
        </date-group>
        <el-form-item>
          <el-button @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

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
        <el-table-column label="房间号" prop="roomList" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.roomList | getArrText('roomNum') }}
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
            {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="预约人数" prop="applicantsNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="预约状态" prop="status" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.status | bespeakType }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 增加 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 增加 -->
    <Modal :mask-closable="false" v-model="infoModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="contentHeader.infoId"></modal-header>
      <info v-if="infoModal" :operaility-data="operailityData"></info>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal"
           class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="contentHeader.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="excelExportUrl">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click=" deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api';
  import selectType from '../../bespeakSetting/selectType';
  import userType from '../../bespeakSetting/project/activityUserType';
  import show from './room_view';
  import info from './room_info';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'roomList',
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
        userType,
        tableHeight: 0,
        dynamicHt: 100, // 表格高度
        loading: false,
        showMoreSearch: false, // 更多筛选
        showModal: false, // 查看
        infoModal: false, // 考勤
        deriveModal: false, // 导出
        excelExportUrl: '', // 导出URL

        operailityData: '',
        multipleSelection: '', // 表格已选集
        searchObj: { // 搜索
          name: '', //  课程名称
          roomNum: '', // 房间号
          lecturer: '', // 	授课人
          userType: '', // 授课对象
          creater: '', // 申请人
          status: '', // 预约项目状态
          createStartTime: '', // 申请开始时间
          createEndTime: '' // 申请结束时间
        },
        tableData: [],
        // 模态框提示
        contentHeader: {
          infoId: {
            id: 'infoId',
            title: '查看预约上课考勤'
          },
          showId: {
            id: 'showId',
            title: '查看预约上课详情'
          },
          deriveId: {
            id: 'deriveId',
            title: '导出'
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
          url: api.roomList.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        this.setTableData();
      },
      //导出
      derive () {
        this.getDeriveURL();
        this.openModel('derive');
      },
      // 获取导出URL
      getDeriveURL () {
        let urlPar = [];
        let data = Util._.defaultsDeep({}, this.searchObj, this.queryQptions.params);
        data.createStartTime = this.conductDate(data.createStartTime, 'yyyy-MM-dd');
        data.createEndTime = this.conductDate(data.createEndTime, 'yyyy-MM-dd');
        for (let item in data) {
          urlPar.push(item + '=' + data[item]);
        }
        this.excelExportUrl = '/api/' + api.exportExcel.path + '?' + urlPar.join('&');
      },
      //确定导出
      affirmDerive () {
        this.cancel('derive');
      },
      /************************* 搜索逻辑 *********************************/
      search () {
        let params = Util._.defaultsDeep({}, this.searchObj);
        params.createStartTime = this.conductDate(params.createStartTime, 'yyyy-MM-dd');
        params.createEndTime = this.conductDate(params.createEndTime, 'yyyy-MM-dd');
        Object.assign(this.queryQptions.params, params);
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
