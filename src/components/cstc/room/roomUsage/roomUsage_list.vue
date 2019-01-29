<!--房间使用情况-->
<template>
  <div id="roomUsage" ref="roomUsage">
    <!-- 操作按钮 -->
    <div class="roomButtonList" ref="buttonList">
      <el-button size="small" type="info" @click="add">{{ 'new' | sysLan }}</el-button>
      <el-button size="small" type="danger" @click="remove">{{ 'delete' | sysLan }}</el-button>
      <el-button size="small" type="primary" @click="derive">{{ 'export' | sysLan }}</el-button>
    </div>
    <!-- 数据搜索 -->
    <el-form :inline="true" :model="searchObj" ref="searchForm" class="el-form-item-search" align="right">
      <el-form-item label="房间号：">
        <el-input v-model="searchObj.roomNum" :maxlength="8"></el-input>
      </el-form-item>
      <el-form-item label="使用类型：">
        <el-select v-model="searchObj.employType" clearable placeholder="请选择">
          <!--<el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item,index) in typeOption" :key="index" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用时间：">
        <date-group :dateGroup="{text:'',startDate:searchObj.startBeginTime,endDate:searchObj.startEndTime}">
          <el-date-picker name="start" v-model="searchObj.startBeginTime" :editable="false" type="datetime" placeholder="选择日期"
                          :picker-options="pickerOptions0"
                          @change="handleStartTime"></el-date-picker>
          <span>-</span>
          <el-date-picker name="end" v-model="searchObj.startEndTime" :editable="false" type="datetime" placeholder="选择日期"
                          :picker-options="pickerOptions1"
                          @change="handleEndTime"></el-date-picker>
        </date-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <div id="roomUsageTable" ref="roomUsageTable">
      <el-table align="center" :context="self" :height="dynamicHt" :data="roomUsageTableData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="warning" @click="edit(scope.$index,scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="房间号" prop="roomNums" show-overflow-tooltip>
          <template scope="scope">
            {{ (scope.row.roomNums||'-').replace(/,/g,'、') }}
          </template>
        </el-table-column>
        <el-table-column label="使用类型" prop="employType" show-overflow-tooltip>
          <template scope="scope">
            <el-tag close-transition :type="scope.row.employType == 'PRACTISE' ? 'primary' : (scope.row.employType == 'EXAM' ? 'success' : '')">
              {{scope.row.employType | affairType(self)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="使用开始时间" prop="startTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.startTime | formatDate('yyyy-MM-dd HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="使用结束时间" prop="endTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.endTime | formatDate('yyyy-MM-dd HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="使用时长" prop="timeLength" show-overflow-tooltip></el-table-column>
        <el-table-column label="用途" prop="purpose" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建人" prop="createrName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm') }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :url-params="api.add"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :id="todoId"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true"
           :width="800">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :id="todoId"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading"
           :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>

    <!--导出弹窗-->
    <Modal :mask-closable="false" v-model="deriveModal" class-name="vertical-center-modal" :width="450">
      <modal-header slot="header" :content="button.deriveId"></modal-header>
      <derive v-if="deriveModal" type="derive" :url="deriveUrl" messTitle="确定要导出到excel吗？" @derive="subCallback"
              @cancel="cancel"></derive>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;
  let store = null;

  //* API *//
  import api from './api.js';

  // 使用类型
  //  import typeOption from './typeOption.js';

  // 模态框
  import add  from './roomUsage_add'; // 增加
  import edit from './roomUsage_edit'; // 编辑
  import show from './roomUsage_view'; // 查看

  export default {
    props: {
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860
      }
    },
    data () {
      return {
        //* API URL *//
        api,
        //* 搜索 *//
        typeOption: {},
        searchObj: {
          roomNum: '', // 房间号
          employType: '', // 类型
          startBeginTime: '', // 开始时间
          startEndTime: '' // 结束时间
        },
        //* 表格 *//
        self: this,
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        multipleSelection: '', // 选项
        roomUsageTableData: [], // 表格数据
        deriveModal: false,
        deriveUrl: '',

        //* 按钮 *//
        button: {
          addId: {
            id: 'addId',
            title: '新建房间使用记录'
          },
          showId: {
            id: 'showId',
            title: '查看房间使用记录'
          },
          editId: {
            id: 'editId',
            title: '修改房间使用记录'
          },
          removeId: {
            id: 'removeId',
            title: '删除房间使用记录'
          },
          deriveId: {
            id: 'deriveId',
            title: '导出房间使用记录'
          }
        },
        //* 增加数据 *//
        operailityData: '',
        // 操作标识
        todoId: 0 // id
      };
    },
    methods: {
      init: function () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: this.api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        this.getTypeOption();
        this.setTableData();
      },
      getTypeOption () {
        let opt = {
          ajaxSuccess: res => {
            if (!res.data.length) {
              return;
            }
            res.data.map(item => {
              this.typeOption[item.code] = item;
            });
            this.setTableData();
          },
          ajaxParams: {
            url: api.getAffairType.path,
            method: api.getAffairType.method
          }
        };
        this.ajax(opt);
      },

      //*----------- 表格 ------------*//
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
        Object.assign(this.queryQptions.params, this.searchObj);
        let params = this.queryQptions.params;
        params.startBeginTime = this.conductDate(params.startBeginTime, 'yyyy-MM-dd HH:mm');
        params.startEndTime = this.conductDate(params.startEndTime, 'yyyy-MM-dd HH:mm');
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.roomUsageTableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let tableData = this.$refs.roomUsageTable;
        let paginationHt = 50 * 2 + 40;
        this.dynamicHt = this.contenHeight - tableData.offsetTop - paginationHt;
      },
      /*----------- 模态框 -------------*/
      // 增加
      add () {
        this.openModel('add');
      },
      // 编辑
      edit (index, row) {
        this.todoId = row.id;
        this.openModel('edit');
      },
      // 查看
      show (row) {
        this.todoId = row.id;
        this.openModel('show');
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
      // 导出
      derive () {
        let searchObj = Object.assign({}, this.searchObj);
        let ids = [];
        (this.multipleSelection || []).map(item => ids.push(item.id));
        searchObj.startBeginTime = this.conductDate(searchObj.startBeginTime, 'yyyy-MM-dd HH:mm');
        searchObj.startEndTime = this.conductDate(searchObj.startEndTime, 'yyyy-MM-dd HH:mm');
        searchObj.ids = ids.join(',');
        this.deriveUrl = api.exportExcel.path + '?' + Util.serializeParams(searchObj);
        this.openModel('derive');
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

      /*
       * 列表数据选择
       */
      isSelected () {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess('请选择数据!');
          flag = false;
        }
        return flag;
      },
      // 搜索
      search () {
        this.setTableData();
      }
    },
    components: {
      add,
      edit,
      show
    },
    created () {
      this.init();
      // console.log(this.api.test)
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
    }
  };

</script>

<style>
  .buttonList {
    margin-bottom: 10px;
  }

  .roomUsageTagItem {
    margin-right: 16px;
  }
</style>
