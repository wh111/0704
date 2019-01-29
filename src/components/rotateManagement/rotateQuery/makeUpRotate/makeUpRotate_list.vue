<template>
  <!-- 中心事务 -->
  <div ref="affairs">
    <el-form :inline="true">
      <el-row>
        <!--<el-col :span="10">-->
          <!--<el-button type="primary" @click="add">新建事项</el-button>-->
          <!--<el-button type="success" @click="edit">修改事项</el-button>-->
          <!--<el-button type="danger" @click="remove">删除事项</el-button>-->
          <!--&lt;!&ndash; <el-button type="info">导出Excel</el-button> &ndash;&gt;-->
        <!--</el-col>-->
        <el-col align="right">
          <!-- <el-input :maxlength="20" placeholder="请输入姓名" icon="search" v-model="searchObj.userName" :on-icon-click="search" style="width:200px;"></el-input> -->
          <el-form-item label="姓名：">
            <el-input v-model="searchObj.userName" style="width: 200px;"></el-input>
            <el-button type="info" @click="search">搜索</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>
        <div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">
          <date-group :dateGroup="{text:'',startDate:searchObj.beginTime,endDate:searchObj.endTime}" style="display:inline-block;">
            <el-form-item label="日期：">
              <el-date-picker name="start" v-model="searchObj.beginTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0" @change="handleStartTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="-">
              <el-date-picker name="end" v-model="searchObj.endTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime"></el-date-picker>
            </el-form-item>
          </date-group>
         <!-- <el-form-item label="排序字段：">
            <el-select v-model="searchObj.sortby" placeholder="请选择">
              <el-option v-for="item in sortbyOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序方式：">
            <el-select v-model="searchObj.order" placeholder="请选择">
              <el-option v-for="item in orderOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>-->
          <!-- <el-button type="info" @click="search">搜索</el-button> -->
        </div>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="操作" align="center" :width="140">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
            <el-button v-if="canSetTs()" :disabled="scope.row.state === 'SUBMIT'" size="small" type="info"
                       @click="add(scope.row)">设置
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="depName" label="科室" show-overflow-tooltip></el-table-column>
        <el-table-column prop="beginTime" label="入科时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endTime" label="出科时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="repairTs" label="补轮转时长" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.repairTs == 'null' ? '——' : (scope.row.repairTs + (scope.row.podClass == 'SXS' ? '周' : '月')) }}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.state | makeUpRotateState }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!--增加弹窗-->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="headerContent.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>

    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="headerContent.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :viewByPodId="true" :userType="operailityData.podClass"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  let Util = null;
  import api from './api';
  import orderOption from './orderOption'; // 排序方式
  import sortbyOption from './sortbyOption'; // 排序字段

  // 引入操作模态组件
  import add from './makeUpRotate_add.vue'; // 设置补轮转时长
  import show from '../../rotateRecordWrite/givenTheApplication/givenTheApplication_look.vue'; // 查看

  export default {
    data() {
      return {
        orderOption,
        sortbyOption,
        searchMore: false,
        searchObj: {
          beginTime: '', // 开始日期
          endTime: '', // 结束日期
//          order: 'DESC',
//          sortby: 'podId',
          userName: '',
        },
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        loading: false,
        operailityData: {},
        tableData: [],
        totalCount: 0,
        headerContent: {
          addId: {
            id: 'add',
            title: '设置补轮转时长'
          },
          showId: {
            id: 'show',
            title: '查看'
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
      // 设置补轮转时长
      add(row) {
        this.operailityData = row;
        this.openModel('add')
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      // 是否可设置
      canSetTs(){
        let can = false;
        let canDoUser = ['SXSGL', 'YJSGL', 'ZYYGL', 'JXSGL', 'JYC'];// 分管教育处
        let userInfo = this.$store.getters.getUserInfo;
        for (let index in userInfo.roleList) {
          if (canDoUser.indexOf(userInfo.roleList[index].identify) > -1) {
            can = true;
            break;
          }
        }
        return can
      },
      /********************************* 表格相关 *****************************/
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
        let params = this.queryQptions.params;
        params.beginTime = this.conductDate(params.beginTime, 'yyyy-MM-dd');
        params.endTime = this.conductDate(params.endTime, 'yyyy-MM-dd');
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.affairs.parentNode.offsetHeight;
        let tableData = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
        this.tabHeight = this.dynamicHt;
      },
      /********************************* 弹窗相关 *****************************/
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
      add,
      show
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
