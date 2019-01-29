<!----------------------------------
****--@name     资金明细-总账
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="content" class="financialDetails">
    <el-form :inline="true">
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="derive">导出</el-button>
        </el-col>
        <el-col :span="12" align="right">
          <el-form-item label="资金库名称：">
            <el-input v-model="searchObj.fundName"></el-input>
          </el-form-item>
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
          <el-form-item label="出账/入账：">
            <el-select @change="changeOutOrInner" placeholder="请选择" v-model="searchObj.outOrEnter" clearable>
              <el-option v-for="(item,index) in typeOption" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报销类型：" v-if="searchObj.outOrEnter!='ENTER'" >
            <el-select v-model="searchObj.accountingType" placeholder="请选择"  :disabled="searchObj.fundSource!=''">
              <el-option v-for="(item,index) in accountingType" :key="index" :label="item.value" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用来源：" v-if="searchObj.outOrEnter!='OUT'" >
            <el-select v-model="searchObj.fundSource" placeholder="请选择"  :disabled="searchObj.accountingType!=''">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in fundSource" :key="index" :label="item.value" :value="item.code">
              </el-option>
            </el-select>
            <!--<el-input v-model="searchObj.fundSource"></el-input>-->
          </el-form-item>
          <br/>
          <el-form-item label="项目名称：">
            <el-input v-model="searchObj.projectName"></el-input>
          </el-form-item>



          <el-form-item label="统计时间：">
            <el-form-item label="" prop="name">
              <el-date-picker
                v-model="searchObj.startTime"
                type="date"
                :editable="false"
                placeholder="选择日期"
                :clearable="false"
                :picker-options="pickerOptions0"
                @change="handleStartTime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="至" prop="name">
              <el-date-picker
                v-model="searchObj.endTime"
                align="right"
                type="date"
                :clearable="false"
                :editable="false"
                placeholder="选择日期"
                :picker-options="pickerOptions1"
                @change="handleEndTime">
              </el-date-picker>
            </el-form-item>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData"
                tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canSelect">
        </el-table-column>
        <el-table-column label="操作" align="center" width="70">
          <template scope="scope">
            <el-button v-if="scope.row.projectName" size="small" type="info" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userName" label="报销人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="expenseTime" label="报销/入账时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="fundName" label="资金库名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="recordType" label="记录类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="invoiceQuantity" label="单据数量" show-overflow-tooltip></el-table-column>
        <!--<el-table-column prop="fundSource" label="报销类型/经费来源" show-overflow-tooltip>-->
        <!--<template scope="scope">-->
        <!--{{scope.row.outOrEnter=='OUT'? scope.row.accountingType:scope.row.fundSource}}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!---->
        <!--<el-table-column prop="fundCode" label="经费代码" show-overflow-tooltip></el-table-column>-->

        <!--<el-table-column prop="outOrEnter" label="出账或入账" show-overflow-tooltip>-->
        <!--<template scope="scope">-->
        <!--{{ scope.row.outOrEnter | typeText }}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="right" prop="totalOccurrenceMoney" label="发生总额（元）" width="170" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.occurrenceMoney | money}}
          </template>
        </el-table-column>
        <el-table-column align="right" prop="accountingMoney" label="实际总额（元）" width="170" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.money | money}}
          </template>
        </el-table-column>
      </el-table>
      <div>
        <div class="total">
        <span>总计：</span>   <span>{{temp.occurrenceMoney | money}} </span> <span style="padding-right: 35px">{{temp.money | money}}</span>
        </div>
      </div>
    </div>

    <!--<div style="margin: 10px;">-->
    <!--<div style="float: right;">-->
    <!--<el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"-->
    <!--:page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"-->
    <!--layout="total, sizes, prev, pager, next, jumper" :total="totalCount">-->
    <!--</el-pagination>-->
    <!--</div>-->
    <!--</div>-->
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
    <!--选择资金库-->
    <Modal :mask-closable="false" v-model="selectFundModal" height="200" class-name="vertical-center-modal"
           :width="900">
      <modal-header slot="header" :parent="self" :content="headerContent.selectFundId"></modal-header>
      <select-fund v-if="selectFundModal" @cancel="cancel('selectFund')" @select="selectFundCall" :onlyOne="true"
                   :select="[searchObj.fundId]"></select-fund>
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
  import api from './api'
  import typeOption from '../revealingManagement/typeOption'
  import selectDepTree from '../../../common/selectTree'
  import selectFund from '../capitalLibraryManagement/capitalLibraryManagement_select.vue'
  import show from '../revealingManagement/revealingManagement_view.vue'
  import Item from '../../../cstc/device/deviceStorage/deviceStorageMoreInfo/deviceStorageMoreInfo_list.vue'
  //当前组件引入全局的util
  let Util = null
  export default {
    data () {
      return {
        fundSource: [],
        typeOption,
        deriveModal: false,
        searchMore: false,
        selectFundModal: false,
        accountingType: [], // 记录类型
        searchObj: {
          'projectName': '',           //项目名称
          'fundCode': '',              //经费代码
          'accountingType': '',        //报销类型
          'fundSource': '',            //经费来源
          'outOrEnter': '',            //出入账 OUT
          'expenseTime': '',           //报销时间 2017-10-16
          'userName': '',              //报销人
          'detailIds': '',         //出入账id
           'startTime':'',
          'endTime':'',
          'userId': '',                //当前登录人id
        },
        exportUrl: '',
        headerContent: {
          deriveId: {
            id: 'deriveId',
            title: '导出',
          },
          selectFundId: {id: 'selectFundId', title: '选择资金库'},
          showId: {id: 'show', title: '查看'},
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
        temp: {occurrenceMoney: 0, money: 0},
      }
    },
    methods: {
      changeOutOrInner(item){
        console.log(item)
        if(item=='OUT'){
          this.searchObj.fundSource=''
        }else if(item=='ENTER'){
          this.searchObj.accountingType=''
        }
      },
      // 获取经费经费来源
      getFundSource () {
        let opt = {
          ajaxSuccess: res => this.fundSource = res.data || [],
          ajaxError: () => this.errorMess('获取经费经费来源失败，请重试...'),
          ajaxParams: {
            url: api.getFundSource.path,
            method: api.getFundSource.method,
          },
        }
        this.ajax(opt)
      },
      //初始化请求列表数据
      init () {
        Util = this.$util
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams

        this.queryQptions = {
          url: api.partList.path,
          params: {
            curPage: 1,
            pageSize: 1000000,
          },
        }
        this.getAccountingType()
        this.getFundSource()
        this.setTableData()
      },
      // 获取经费记录类型
      getAccountingType () {
        let opt = {
          ajaxSuccess: res => {
            res.data.unshift({code: '', value: '全部'})
            this.accountingType = res.data
          },
          ajaxError: () => this.errorMess('获取经费记录类型失败，请重试...'),
          ajaxParams: {
            url: api.getAccountingType.path,
            method: api.getAccountingType.method,
          },
        }
        this.ajax(opt)
      },
      /******************************** 按钮事件 *********************/


      //导出
      derive () {
        this.getDeriveURL()
        this.openModel('derive')
      },

      // 获取导出URL
      getDeriveURL () {
        let ids = []
        if (this.multipleSelection.length) {
          this.multipleSelection.map(item => ids.push(item.detailId))
        }
        let sltData = '?'
        this.searchObj['detailIds'] = ids.join(',')
        this.searchObj['userId'] = this.userInfo.id
        sltData += Util.serializeParams(this.searchObj)

        this.exportUrl = '/api/' + api.partExcelExport.path + sltData
      },

      //确定导出
      affirmDerive () {
        this.cancel('derive')
      },

      // 选择资金库
      selectFund () {
        this.openModel('selectFund')
      },
      // 选择资金库
      selectFundCall (arr) {
        this.searchObj.fundId = arr[0].id
        this.searchObj.fundName = arr[0].fundName
        this.cancel('selectFund')
      },
      // 清除选择的资金库
      clearFundSelect () {
        this.searchObj.fundId = ''
        this.searchObj.fundName = ''
      },

      // 查看
      show (row) {
        this.operailityData = row
        this.openModel('show')
      },
      // 搜索
      search () {
        this.setTableData()
      },
      // 筛选
      showSearchMore () {
        this.searchMore = !this.searchMore
        this.$nextTick(function () {
          if (this.searchMore) {
            this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight
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
      setTableData (isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj)
        let params = this.queryQptions.params
        params.expenseTime = this.conductDate(params.expenseTime, 'yyyy-MM-dd')
        params.endTime = this.conductDate(params.endTime, 'yyyy-MM-dd');
        params.startTime = this.conductDate(params.startTime, 'yyyy-MM-dd');
        //params.endTime = this.conductDate(params.endTime, 'yyyy-MM-dd HH:mm:ss');
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions,
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0
        let temp = {occurrenceMoney: 0, money: 0, invoiceQuantity: '总计：'}
        if (res.data && res.data.length) {
          res.data.map((item) => {
            item.id = item.accountingId
            if (item.outOrEnter == 'OUT') {
              temp.occurrenceMoney -= item.occurrenceMoney
              temp.totalOccurrenceMoney -= item.totalOccurrenceMoney
            } else {
              temp.occurrenceMoney += item.occurrenceMoney
              temp.money += item.money
            }

          })
        }
        this.tableData = res.data || []
        this.temp = temp
        console.log(this.tableData, 360)
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let contenHeight = this.$refs.content.parentNode.offsetHeight
        let tableData = this.$refs.myTable
        let paginationHt = 50
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt
        this.tabHeight = this.dynamicHt
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length
        let flag = true
        if (len == 0) {
          this.showMess('请选择数据!')
          flag = false
        }
        if (len > 1 && isOnly) {
          this.showMess('只能选择一条数据!')
          flag = false
        }
        return flag
      },
      // 允许选择的行
      canSelect (row) {
        return true
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false
      },
      // 弹窗回调
      subCallback (target, title, updata) {
        this.cancel(target)
        if (title) {
          this.successMess(title)
        }
        if (!updata) {
          this.setTableData()
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      },
    },
    created () {
      this.init()
    },
    computed: {
      userInfo () {
        let info = this.$store.getters.getUserInfo || {}
        return info
      },
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight()
        //为窗体绑定改变大小事件
        let Event = Util.events
        Event.addHandler(window, 'resize', this.setTableDynHeight)
      })
    },
    components: {
      Item,
      selectDepTree,
      selectFund,
      show,
    },
  }
</script>
<style lang="scss">
  .financialDetails{

    .total{
      text-align: right;
      line-height: 40px;
      span{
        width: 170px;
        font-size: 14px;
        color: #1f2d3d;
        text-align: right;
        padding-right: 33px;
      }
    }
  }

</style>
