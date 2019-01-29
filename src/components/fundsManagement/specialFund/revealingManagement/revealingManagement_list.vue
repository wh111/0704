<!----------------------------------
****--@name     出入账管理
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="content">
    <el-form :inline="true">
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="add">添加出/入账</el-button>
          <el-button type="danger" @click="remove">删除出/入账</el-button>
        </el-col>
        <el-col :span="12" align="right">
          <el-form-item label="资金库名称：">
            <el-input v-model="searchObj.fundName"></el-input>
          </el-form-item>
          <el-form-item label="经费代码：">
            <el-input v-model="searchObj.fundCode"></el-input>
          </el-form-item>

          <!--<el-form-item label="经费代码：">-->
            <!--<el-input v-model="searchObj.fundCode"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-button type="info" @click="search">搜索</el-button>
            <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>-->
          </el-form-item>
        </el-col>
        <!--<div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">-->
          <!--<el-form-item label="部门：">-->
            <!--<el-input v-model="searchObj.depName" @focus="selectDep" icon="circle-close"-->
                      <!--:on-icon-click="clearDepSelect"></el-input>-->
          <!--</el-form-item>-->

          <!--<el-form-item label="记录类型：">-->
            <!--<el-select v-model="searchObj.accountingType" placeholder="请选择">-->
              <!--<el-option v-for="(item,index) in accountingType" :key="index" :label="item.value" :value="item.code">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="出账/入账：">-->
            <!--<el-select placeholder="请选择" v-model="searchObj.outOrEnter" clearable>-->
              <!--<el-option v-for="(item,index) in typeOption" :key="index" :label="item.label"-->
                         <!--:value="item.value"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--&lt;!&ndash;<el-form-item label="报销人：">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-input v-model="searchObj.userName"></el-input>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
          <!--<el-form-item label="操作人：">-->
            <!--<el-input v-model="searchObj.createrName"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="统计时间：">-->
            <!--<date-group :dateGroup="{text:'',startDate:searchObj.startTime,endDate:searchObj.endTime}">-->
              <!--<el-date-picker name="start" v-model="searchObj.startTime" :editable="false" type="datetime"-->
                              <!--placeholder="选择开始时间" :picker-options="pickerOptions0"-->
                              <!--@change="handleStartTime"></el-date-picker>-->
              <!--<span>-</span>-->
              <!--<el-date-picker name="end" v-model="searchObj.endTime" :editable="false" type="datetime"-->
                              <!--placeholder="选择结束时间" :picker-options="pickerOptions1"-->
                              <!--@change="handleEndTime"></el-date-picker>-->
            <!--</date-group>-->
          <!--</el-form-item>-->
        <!--</div>-->
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData"
                tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canSelect"></el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="success" :disabled="scope.row.businessId!=null" @click="edit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="fundName" label="资金库名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fundCode" label="经费代码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="outOrEnter" label="出账/入账" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.outOrEnter | typeText }}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="经办人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="accountingName" label="经办时间" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.createTime| formatDate('yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="accountingMoney" label="发生金额（元）" show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalOccurrenceMoney" label="实际发生金额（元）" show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column prop="depName" label="部门名称" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column prop="outOrEnter" label="出账或入账" show-overflow-tooltip>-->
          <!--<template scope="scope">-->
            <!--{{ scope.row.outOrEnter | typeText }}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="explains" label="经费描述" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column prop="userName" label="报销人名称" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column prop="expenseTime" label="报销时间" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column prop="accountingMoney" label="报销总额" show-overflow-tooltip></el-table-column>-->
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>

    <!-- 选择部门 -->
    <select-dep-tree :getTreeUrl="depTree" @selectTree="selectDepCall" ref="selectDepTree"></select-dep-tree>

    <!--&lt;!&ndash;选择资金库&ndash;&gt;-->
    <!--<Modal :mask-closable="false" v-model="selectFundModal" height="200" class-name="vertical-center-modal"-->
           <!--:width="900">-->
      <!--<modal-header slot="header" :parent="self" :content="headerContent.selectFundId"></modal-header>-->
      <!--<select-fund v-if="selectFundModal" @cancel="cancel('selectFund')" @select="selectFundCall" :onlyOne="true"-->
                   <!--:select="[searchObj.fundId]"></select-fund>-->
      <!--<div slot="footer"></div>-->
    <!--</Modal>-->

    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" class-name="vertical-center-modal"
           :loading="loading"
           :width="500">
      <modal-header slot="header" :content="headerContent.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>

    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="headerContent.addId"></modal-header>
      <rm-input v-if="addModal" @cancel="cancel" @add="subCallback"></rm-input>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="headerContent.editId"></modal-header>
      <rm-input v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></rm-input>
      <div slot="footer"></div>
    </Modal>

    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :parent="self" :content="headerContent.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import typeOption from './typeOption';
  import selectDepTree from '../../../common/selectTree';
  import selectFund from '../capitalLibraryManagement/capitalLibraryManagement_select.vue';
  import show from './revealingManagement_view.vue';
  import rmInput from './revealingManagement_input.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        typeOption,
        deleteUrl: api.delete,
        depTree: api.depTree,
        searchMore: false,
        accountingType: [], // 记录类型
        searchObj: {
          accountingName: '', // 经费名称
          depId: '', // 部门id
          depName: '', // 部门名称
          outOrEnter: '', // 出账或者入账
          accountingType: '', // 记录类型
          startTime: '', // 开始时间
          endTime: '', // 结束时间
          userName: '', // 报销人
          createrName: '', // 操作人
          fundId: '', // 资金库id
          fundName: '', // 资金库
        },
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        loading: false,
        shortNoteModal: false,
        selectFundModal: false,
        operailityData: [],
        multipleSelection: [],
        tableData: [],
        totalCount: 0,
        headerContent: {
          addId: {id: 'addId', title: '添加'},
          editId: {id: 'edit', title: '修改'},
          showId: {id: 'show', title: '查看'},
          selectFundId: {id: 'selectFundId', title: '选择资金库'},
          removeId: {id: 'removeId', title: '删除'},
        }
      }
    },
    methods: {
      //初始化请求列表数据
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
        this.getAccountingType()
        this.setTableData()
      },
      // 获取经费记录类型
      getAccountingType() {
        let opt = {
          ajaxSuccess: res => {
            res.data.unshift({code: "", value: "全部"});
            this.accountingType = res.data;
          },
          ajaxError: () => this.errorMess('获取经费记录类型失败，请重试...'),
          ajaxParams: {
            url: api.getAccountingType.path,
            method: api.getAccountingType.method
          }
        };
        this.ajax(opt)
      },
      /******************************** 按钮事件 *********************/
      // 选择部门
      selectDep() {
        this.$refs.selectDepTree.openModal()
      },
      // 选择部门
      selectDepCall(depId, depName) {
        this.searchObj.depId = depId || '';
        this.searchObj.depName = depName || '';
      },
      // 清除选择的部门
      clearDepSelect() {
        this.searchObj.depId = '';
        this.searchObj.depName = '';
      },

      // 选择资金库
      selectFund() {
        this.openModel('selectFund')
      },
      // 选择资金库
      selectFundCall(arr) {
        this.searchObj.fundId = arr[0].id;
        this.searchObj.fundName = arr[0].fundName;
        this.cancel('selectFund')
      },
      // 清除选择的资金库
      clearFundSelect() {
        this.searchObj.fundId = '';
        this.searchObj.fundName = '';
      },

      // 删除
      remove() {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove')
        }
      },

      // 添加
      add() {
        this.openModel('add')
      },
      // 修改
      edit(row) {
        this.operailityData = row;
        this.openModel('edit')
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show')
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
      /********************************* 表格相关 *****************************/
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
        let params = this.queryQptions.params;
        params.startTime = this.conductDate(params.startTime, 'yyyy-MM-dd HH:mm:ss');
        params.endTime = this.conductDate(params.endTime, 'yyyy-MM-dd HH:mm:ss');
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        if (res.data && res.data.length) {
          res.data.map(item => item.id = item.accountingId);
        }
        this.tableData = res.data || [];
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.content.parentNode.offsetHeight;
        let tableData = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
        this.tabHeight = this.dynamicHt;
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
          this.showMess("只能选择一条数据!")
          flag = false;
        }
        return flag;
      },
      // 允许选择的行
      canSelect(row) {
        return true
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
    components: {
      selectDepTree,
      selectFund,
      show,
      rmInput,
    }
  }
</script>
