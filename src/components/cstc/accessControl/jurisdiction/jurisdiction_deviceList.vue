<template>
  <!-- 门禁设备管理 -->
  <div ref="content">
    <el-row style="padding-bottom:20px;">
      <el-col :span="6">
        <el-button type="danger" @click="add">授权</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="18" align="right">
        <el-input placeholder="门禁名称" v-model="searchObj.doorName" style="width:300px;" :maxlength="20">
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-input>
        <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
      <el-form :inline="true">
        <el-form-item label="所在位置：">
          <el-input v-model="searchObj.orther"></el-input>
        </el-form-item>
        <el-form-item label="房间号：">
          <el-select v-model="searchObj.roomId" clearable placeholder="请选择">
            <el-option v-for="item in roomList" :key="item.id" :label="item.roomNum" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门禁IP：">
          <el-input v-model="searchObj.accessIp"></el-input>
        </el-form-item>
        <el-form-item label="门禁SN：">
          <el-input v-model="searchObj.accessSn"></el-input>
        </el-form-item>
        <el-form-item style="margin-right:0;">
          <el-button @click="search" type="info">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据表格 -->
    <div ref="tableView">
      <el-table align="center" :context="self" :height="tableHeight" :data="tableData" @selection-change="handleSelectionChange" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template scope="scope">
            <el-button size="small" type="primary" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="门禁名称" prop="doorName" show-overflow-tooltip></el-table-column>
        <el-table-column label="门禁编号" prop="doorNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备所在位置" prop="location" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.location || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="门禁IP" prop="accessIp" show-overflow-tooltip></el-table-column>
        <el-table-column label="门禁SN" prop="accessSn" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="isOnline" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.isOnline | isOnline }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="headerContent.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback"></add>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;
  import api from '../device/api';
  import add from './jurisdiction_deviceAdd';
  export default {
    data() {
      return {
        api,
        totalCount: 0,
        self: this,
        dynamicHt: 0,
        tableHeight: 0,
        loading: false,
        showMoreSearch: false, // 更多筛选
        searchObj: { // 搜索
          doorName: '', // 门禁名称
          orther: '', // 设备所在位置
          roomId: '', // roomId
          accessIp: '', // 门禁IP
          accessSn: '', // 门禁SN
        },
        tableData: [],
        multipleSelection: [],
        operailityData: [],
        roomList: [],
        headerContent: {
          addId: {
            id: "addId",
            title: "门禁授权"
          },
        }
      }
    },
    methods: {
      init() {
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

        this.getSelectRoom();
        this.setTableData();
      },
      // 获取选择房间
      getSelectRoom() {
        this.ajax({
          ajaxSuccess: res => this.roomList = res.data,
          ajaxParams: {
            url: api.roomList.path
          }
        })
      },
      /************************* 按钮事件 *********************************/
      // 添加
      add() {
        this.openModel('add')
      },
      // 修改
      show(row) {
        this.$emit('show', 'user', row.id)
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
      setTableData() {
        Object.assign(this.queryQptions.params, this.searchObj);

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
      setTableDynHeight() {
        let contenHeight = this.$refs.content.parentNode.parentNode.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 40;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
      },
      /************************* 弹窗相关 *********************************/
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
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
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      /*
       * 列表数据选择
       */
      isSelected() {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess("请选择需要删除的门禁设备!");
          flag = false;
        }
        return flag;
      },
    },
    components: {
      add,
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    created() {
      this.init()
    },
  }

</script>

<style>
  /* 门禁设备管理 */

</style>
