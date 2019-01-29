<!-- 缴费登记 -->
<template>
  <div ref="internAuditListMain">
    <el-form :inline="true" class="internAuditList">
      <el-row>
        <el-col :span="6">
          <el-button type="success" :disabled="disabled.paymentConfirmation" @click="paymentConfirmation">缴费确认</el-button>
          <el-button type="info" @click="derive">导出Excel</el-button>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="'已选：' + multipleSelection.length + '人，'"></el-form-item>
          <el-form-item :label="'合计：' + selSum + '元'"></el-form-item>
        </el-col>
        <el-col :span="10" align="right" style="padding-bottom:20px;">
          <el-input :maxlength="20" placeholder="请输入姓名" icon="search" v-model="searchObj.userName"
                    :on-icon-click="search" style="width:300px;"></el-input>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
        <div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">
          <el-form-item label="姓名：">
            <el-input v-model="searchObj.userName"></el-input>
          </el-form-item>
          <el-form-item label="学校：">
            <el-input v-model="searchObj.schoolName"></el-input>
          </el-form-item>
          <!--<el-form-item label="年份：">-->
          <!--<el-date-picker v-model="searchObj.year" align="right" :editable="false" type="year" placeholder="选择年">-->
          <!--</el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item label="手机号：">
            <el-input v-model="searchObj.mobile"></el-input>
          </el-form-item>
          <!--<el-form-item label="民族：">-->
          <!--<el-select v-model="searchObj.nation" filterable clearable placeholder="请选择" style="width:175px;" class="nation">-->
          <!--<el-option v-for="(item,index) in nationOption" :key="index" :label="item.id" :value="item.name">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-button type="info" @click="search">搜索</el-button>
        </div>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData"
                tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" prop="index" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="schoolName" label="学校" show-overflow-tooltip></el-table-column>
        <el-table-column prop="major" label="专业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalCost" label="实习总费用" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.totalCost ? scope.row.totalCost + '元' : '——'}}
          </template>
        </el-table-column>
        <el-table-column prop="totalZsCost" label="住宿总费用" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.totalZsCost ? scope.row.totalZsCost + '元' : '——'}}
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.operator || '——' }}
          </template>
        </el-table-column>
        <el-table-column prop="payTime" label="操作时间" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.payTime || '——' }}
          </template>
        </el-table-column>
        <el-table-column prop="isPay" label="缴费状态" show-overflow-tooltip>
          <template scope="scope">
            {{ (scope.row.isPay || 0) | isPay }}
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
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :parent="self" :content="headerContent.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal"
           class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="headerContent.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="'/api/signupRecruit/trialSxUser/payCostExportExcel?'+deriveURL">
              <el-button @click="deriveModal=false" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!--确认缴费弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="payCnfModal"
           class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="headerContent.payCnfId"></modal-header>
      <div>
        <div class="modalTips">确认“{{ payCnfTips.userNames.join('、') }}”
          {{ payCnfTips.userNames.length > 3 ? '等' : '' }}
          {{ payCnfTips.userNames.length > 1 ? payCnfTips.userNames.length + '人' : '' }}
          已经缴费吗？
        </div>
        <el-row>
          <el-col :span="10" :offset="14">
            <el-button @click="payCnfSub" type="primary">确定</el-button>
            <el-button class="but-col" @click="payCnfModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util;
  import api from './api';
  import dictionary from '../../../../libs/dictionary'; // 字典
  import show from './paymentRegistration_view'; // 审核
  export default {
    data() {
      return {
        selSum: 0, // 合计多少元
        deriveURL: '',
        disabled: {
          paymentConfirmation: false,
        },
        nationOption: dictionary.nation,
        payCnfModal: false,
        deriveModal: false,
        searchMore: false,
        searchObj: {
          userName: '', // 姓名
          schoolName: '', // 学校名称
          year: new Date().getFullYear().toString(), // 年份
          mobile: '', // 手机号
          idNumber: '', // 身份号
          nation: '', // 民族
        },
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        userIds: [],
        operailityData: [],
        multipleSelection: [],
        tableData: [],
        totalCount: 0,
        headerContent: {
          showId: {
            id: "showId",
            title: '查看'
          },
          deriveId: {
            id: "deriveId",
            title: '导出Excel'
          },
          payCnfId: {
            id: 'payCnfId',
            title: '缴费确认'
          }
        },
        payCnfTips: {
          userIds: [],
          userNames: []
        },
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

        this.setTableData();
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
      //导出
      derive() {
        this.getDeriveURL();
        this.openModel('derive')
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      // 缴费确认
      paymentConfirmation() {
        if (this.isSelected()) {
          this.payCnfTips.userIds.length = 0;
          this.payCnfTips.userNames.length = 0;
          this.multipleSelection.map(item => {
            this.payCnfTips.userIds.push(item.userId);
            this.payCnfTips.userNames.push(item.userName);
          })
          this.openModel('payCnf');
        }
      },
      // 缴费确认提交
      payCnfSub() {
        this.ajax({
          ajaxSuccess: () => {
            this.setTableData();
            this.successMess('缴费确认成功');
            this.cancel('payCnf');
          },
          ajaxParams: {
            url: api.payConfirm.path,
            method: api.payConfirm.method,
            data: {
              userIds: this.payCnfTips.userIds.join(',')
            }
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
        params.year = this.conductDate(params.year, 'yyyy');
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = this.addIndex(res.data || []);
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.internAuditListMain.parentNode.offsetHeight;
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
        let disabled = {
          paymentConfirmation: false,
        };
        this.selSum = 0;
        val.map(item => {
          this.selSum = this.selSum + (item.totalCost || 0) + (item.totalZsCost || 0);
          if(item.isPay=='1'){
            disabled.paymentConfirmation = true;
          }
        })
        this.disabled = disabled;
      },
      /*
       * 列表数据选择
       */
      isSelected() {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess("请选择需要确认缴费的选项!");
          flag = false;
        }
        return flag;
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
      // 获取导出URL
      getDeriveURL() {
        let urlPar = [];
        for (let item in this.searchObj) {
          urlPar.push(item + '=' + this.searchObj[item])
        }
        this.deriveURL = urlPar.join('&')
      }
    },
    components: {
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

<style lang="scss">
  .internAuditList {
    .nation .el-input {
      width: 100%;
    }
  }

  .modalTips {
    font-size: 16px;
    min-height: 100px;
    text-indent: 2em;
    line-height: 32px;
    margin-bottom: 10px;
  }

</style>
