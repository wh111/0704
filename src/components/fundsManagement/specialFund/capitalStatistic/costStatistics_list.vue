<!--
* @TODO
* @pageName cost-statistics_list
* @description 经费统计
* @Author zyc 332533011@qq.com
* @Created by zyc on 2018-06-13 14:48
-->
<template>
  <div ref="content">
    <el-form :inline="true">
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="derive">导出</el-button>
        </el-col>
        <el-col :span="12" align="right">
          <el-form-item label="经费代码：">
            <el-input v-model="searchObj.fundCode"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">搜索</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>
        <div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">
          <!--<el-form-item label="资金库：">
            <el-input v-model="searchObj.fundName" @focus="selectFund" icon="circle-close"
                      :on-icon-click="clearFundSelect"></el-input>
          </el-form-item>-->
          <!--<el-form-item label="项目名称：">
            <el-input v-model="searchObj.projectName"></el-input>
          </el-form-item>-->
          <!--<el-form-item label="报销类型：">-->
            <!--<el-select v-model="searchObj.accountingType" placeholder="请选择">-->
              <!--<el-option v-for="(item,index) in accountingType" :key="index" :label="item.value" :value="item.code">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="经费来源：">-->
            <!--<el-select v-model="searchObj.fundSource" placeholder="请选择">-->
              <!--<el-option v-for="(item,index) in fundSource" :key="index" :label="item.value" :value="item.code">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="出账或者入账：">-->
            <!--<el-select placeholder="请选择" v-model="searchObj.outOrEnter" clearable>-->
              <!--<el-option v-for="(item,index) in typeOption" :key="index" :label="item.label"-->
                         <!--:value="item.value"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="实报或发生：">
            <el-select placeholder="请选择" v-model="searchObj.costType" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="报销时间：">
            <date-group :dateGroup="{text:'',startDate:searchObj.startTime,endDate:searchObj.endTime}">
              <el-date-picker name="start" v-model="searchObj.startTime" :editable="false" type="date"
                              placeholder="选择开始时间" :picker-options="pickerOptions0"
                              @change="handleStartTime"></el-date-picker>
              <span>-</span>
              <el-date-picker name="end" v-model="searchObj.endTime" :editable="false" type="date"
                              placeholder="选择结束时间" :picker-options="pickerOptions1"
                              @change="handleEndTime"></el-date-picker>
            </date-group>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
    <!-- echarts -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData"
                tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canSelect"></el-table-column>
        <el-table-column label="操作" align="center" width="70">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <!--<el-table-column prop="projectName" label="项目名称" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="userName" label="报销人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fundCode" label="经费代码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="accountingType" label="报销类型" show-overflow-tooltip></el-table-column>
        <!--<el-table-column prop="recordType" label="记录类型" show-overflow-tooltip></el-table-column>-->

        <el-table-column prop="outOrEnter" label="出账/入账" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.outOrEnter | typeText }}
          </template>
        </el-table-column>
        <el-table-column prop="fundName" label="资金库" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fundSource" label="经费来源" show-overflow-tooltip></el-table-column>
        <el-table-column prop="expenseTime" label="报销时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="right" prop="accountingMoney" label="实报总额（元）" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.accountingMoney | money}}
          </template>
        </el-table-column>
        <el-table-column align="right" prop="totalOccurrenceMoney" label="发生总额（元）" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.totalOccurrenceMoney | money}}
          </template>
        </el-table-column>

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
    <!--导出弹窗-->
    <Modal :mask-closable="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="headerContent.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="exportUrl">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="cancel('derive')">取消</el-button>
          </el-col>
        </el-row>
      </div>
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
  import typeOption from '../revealingManagement/typeOption';
  import selectDepTree from '../../../common/selectTree';
  import selectFund from '../capitalLibraryManagement/capitalLibraryManagement_select.vue';
  import show from '../revealingManagement/revealingManagement_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        typeOption,
        deriveModal:false,
        searchMore: false,
        accountingType: [], // 报销类型
        fundSource: [],  // 经费来源
        recordType:[],  //记录类型
        searchObj: {
          "fundCode":"",              //经费代码
          "accountingType":"",        //报销类型
          "fundSource":"",            //经费来源
          "outOrEnter":"",            //出入账 OUT
          "startTime": '',              // 开始时间
          "endTime": '',                // 结束时间
          "accountingIds":"",         //出入账id
          "userId":"",                //当前登录人id
        },
        exportUrl:"",
        headerContent: {
          deriveId:{
            id: 'deriveId',
            title: '导出'
          },
          showId: {id: 'show', title: '查看'},
        },
        operailityData: [],
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        loading: false,
        multipleSelection: [],
        tableData: [],
        totalCount: 0,
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.statisticalList.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.getAccountingType();
        this.getFundSource();
        this.getRecordType();

        this.setTableData()
      },
      // 获取经费报销类型
      getAccountingType() {
        let opt = {
          ajaxSuccess: res => {
            res.data.unshift({code: "", value: "全部"});
            this.accountingType = res.data || []
          },
          ajaxError: () => this.errorMess('获取经费报销类型失败，请重试...'),
          ajaxParams: {
            url: api.getAccountingType.path,
            method: api.getAccountingType.method
          }
        };
        this.ajax(opt)
      },
      // 获取经费经费来源
      getFundSource() {
        let opt = {
          ajaxSuccess: res => {
            res.data.unshift({code: "", value: "全部"});
            this.fundSource = res.data || []
          },
          ajaxError: () => this.errorMess('获取经费经费来源失败，请重试...'),
          ajaxParams: {
            url: api.getFundSource.path,
            method: api.getFundSource.method
          }
        };
        this.ajax(opt)
      },
      // 获取经费记录类型
      getRecordType() {
        let opt = {
          ajaxSuccess: res => {
            res.data.unshift({code: "", value: "全部"});
            this.recordType = res.data || []
          },
          ajaxError: () => this.errorMess('获取经费经费记录失败，请重试...'),
          ajaxParams: {
            url: api.getRecordType.path,
            method: api.getRecordType.method
          }
        };
        this.ajax(opt)
      },
      /******************************** 按钮事件 *********************/


      //导出
      derive() {
        this.getDeriveURL();
        this.openModel('derive');
      },

      // 获取导出URL
      getDeriveURL() {
        let ids = [];
        if(this.multipleSelection.length){
          this.multipleSelection.map(item=>ids.push(item.accountingId))
        }
        let sltData = "?";
        this.searchObj['accountingIds'] = ids.join(',')
        this.searchObj['userId'] = this.userInfo.id
        sltData += Util.serializeParams(this.searchObj)

        this.exportUrl = '/api/'+api.ststExcelExport.path+sltData
      },

      //确定导出
      affirmDerive() {
        this.cancel('derive');
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
        params.expenseTime = this.conductDate(params.startTime, 'yyyy-MM-dd');
        params.endTime = this.conductDate(params.endTime, 'yyyy-MM-dd');
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
    computed: {
      userInfo() {
        let info = this.$store.getters.getUserInfo || {};
        return info;
      }
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
    }
  }
</script>
