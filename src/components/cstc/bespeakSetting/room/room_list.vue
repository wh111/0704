<template>
  <!-- 房间预约管理 -->
  <div id="bespeakSetRoom" ref="bespeakSetRoom">
    <el-row style="padding-bottom:20px;">
      <el-col :span="6">
        <!-- 操作按钮 -->
        <el-button type="success" @click="set(false)">预约设置</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="18" align="right">
          <span>房间名称：</span>
          <el-input placeholder="请输入" style="max-width: 180px;width: 80%;" v-model="searchObj.roomName">
            <!--<el-button slot="append" icon="search" @click="search"></el-button>-->
          </el-input>
          <el-button @click="search" v-if="!showMoreSearch">查询</el-button>
          <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
      <el-form :inline="true" label-width="74px">
        <!--<el-form-item label="房间名称:">-->
          <!--<el-input v-model="searchObj.roomName"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="房间号:">
          <el-input v-model="searchObj.roomNum"></el-input>
        </el-form-item>
        <el-form-item label="房间位置:">
          <el-input v-model="searchObj.address"></el-input>
        </el-form-item>
        <el-form-item label="是否开放:">
          <el-select v-model="searchObj.isOpen" placeholder="请选择">
            <el-option v-for="item in selectType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showMoreSearch">
          <el-button @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo"
                style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="success" @click="set(scope.row)">设置</el-button>
          </template>
        </el-table-column>
        <el-table-column label="房间号" prop="roomNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="房间名称" prop="roomName" show-overflow-tooltip></el-table-column>
        <el-table-column label="房间所在位置" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="isOpen" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.isOpen | bespeakSetRoomStatus }}
          </template>
        </el-table-column>
        <el-table-column label="开放时间" prop="timeModel" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.timeModel | typeText }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 模态框 设置（set） -->
    <Modal :mask-closable="false" v-model="setModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.setId"></modal-header>
      <room-set v-if="setModal" @cancel="cancel" @set="subCallback" :op-data="operailityData"></room-set>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（show） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <room-view v-if="showModal" @cancel="cancel" :op-data="operailityData"></room-view>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
  let Util = null;

  import api from './api'; // API

  import roomSet from './room_set'; // 设置
  import roomView from './room_view'; // 查看

  import selectType from './selectType'; // 预约状态类型

  export default {
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
        setModal: false, // 设置

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
          setId: {
            id: 'setId',
            title: '房间预约设置'
          },
          showId: {
            id: 'showId',
            title: '查看房间预约设置'
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
          url: api.setList.path,
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
      set (row) {
        this.operailityData = row && [row] || this.multipleSelection;
        if (!this.operailityData.length) {
          this.errorMess('请选择需要设置的房间');
          return;
        }
        this.openModel('set');
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
    components: {
      roomSet,
      roomView
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
    created () {
      Util = this.$util;
      this.init();
    }
  };

</script>
<style lang="scss">
  @import '../../../../assets/ambuf/css/manage_v1.0/editForm';

  .noMarginBottom {
    .el-form-item {
      margin-bottom: 0;
    }
  }

</style>
