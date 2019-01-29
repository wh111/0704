<!-- 打印交费单 -->
<template>
  <div ref="internAuditListMain">
    <el-form :inline="true" class="internAuditList">
      <el-row>
        <el-col :span="16">
          <el-button type="info" @click="printData('school')">按学校打印</el-button>
          <el-button type="primary" @click="printData('major')">按专业打印</el-button>
          <el-button type="warning" @click="printData('batch')">批量打印</el-button>
          <el-button type="danger" @click="printData('merge')">合并打印</el-button>
          <el-button type="success" @click="printData('dorm')">住宿费打印</el-button>
        </el-col>
        <el-col :span="8" align="right" style="padding-bottom:20px;">
          <el-input :maxlength="20" placeholder="请输入姓名" icon="search" v-model="searchObj.userName" :on-icon-click="search" style="width:200px;"></el-input>
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
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template scope="scope">
            <el-button size="small" :plain="true" type="primary" @click="printData('user',scope.row)">实习费打印</el-button>
            <el-button size="small" :plain="true" type="success" @click="printData('zsf',scope.row)">住宿费打印</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" width="200"></el-table-column>
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
        <el-table-column prop="isPrint" label="状态" show-overflow-tooltip>
          <template scope="scope">
            {{ (scope.row.isPrint || 0) | print }}
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
    <!--打印弹窗-->
    <Modal :mask-closable="false" v-model="printDataModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :parent="self" :content="headerContent.printDataId"></modal-header>
      <print-data v-if="printDataModal" @cancel="cancel" @print="printDone">
        <div class="printBPMain" v-for="(item,index) in printDatas" :key="index">
          <div class="printBPItem">
            <div class="printMain">
              <p>财务处：</p>
              <div class="printCon">
                请收
                <div>{{ item.schoolName }}</div>学校
                <div>{{ item.majors || item.major }}</div>专业
                <template v-if="['user','zsf','batch','dorm'].indexOf(printType) > -1">
                  <!-- 个人/批量 -->
                  <div>{{ item.userName }}</div>同学{{ ['zsf','dorm'].indexOf(printType) > -1 ? '住宿费' : '实习费' }}
                </template>
                <template v-else>
                  <!-- 学校/专业 -->
                  <div>{{ (item.userNames || item.userName).split(',').slice(0,3).join('，') }}</div>等{{ (item.userNames || item.userName).split(',').length }}人{{ ['zsf','dorm'].indexOf(printType) > -1 ? '住宿费' : '实习费' }}
                </template>
                <template v-if="['zsf','dorm'].indexOf(printType) > -1">
                  <div>{{ item.totalCost || item.totalZsCost }}</div>元及押金
                  <div>{{ item.deposit }}</div>
                </template>
                <div v-else>{{ item.totalCost || item.totalZsCost }}</div>元。
              </div>
              <div class="signature">
                <p>教育处</p>
                <p>日期：</p>
              </div>
            </div>
          </div>
          <div class="printBPItem">
            <div class="printMain">
              <p>教育处：</p>
              <div class="printCon">
                已收
                <div>{{ item.schoolName }}</div>学校
                <div>{{ item.majors || item.major }}</div>专业
                <template  v-if="['user','zsf','batch','dorm'].indexOf(printType) > -1">
                  <!-- 个人/批量 -->
                  <div>{{ item.userName }}</div>同学{{ ['zsf','dorm'].indexOf(printType) > -1 ? '住宿费' : '实习费' }}
                </template>
                <template v-else>
                  <!-- 学校/专业 -->
                  <div>{{ (item.userNames || item.userName).split(',').slice(0,3).join('，') }}</div>等{{ (item.userNames || item.userName).split(',').length }}人{{ ['zsf','dorm'].indexOf(printType) > -1 ? '住宿费' : '实习费' }}
                </template>
                <!--<div>{{ item.totalCost || item.totalZsCost }}</div>元。-->
                <template v-if="['zsf','dorm'].indexOf(printType) > -1">
                  <div>{{ item.totalCost || item.totalZsCost }}</div>元及押金
                  <div>{{ item.deposit }}</div>
                </template>
                <div v-else>{{ item.totalCost || item.totalZsCost }}</div>元。
              </div>
              <div class="signature">
                <p>财务处</p>
                <p>日期：</p>
              </div>
            </div>
          </div>
        </div>
      </print-data>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util;
  import api from './api';
  import dictionary from '../../../../libs/dictionary'; // 字典
  import printData from './printBillPayment_print'; // 打印
  export default {
    data() {
      return {
        nationOption: dictionary.nation,
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
        printDatas: [],
        operailityData: [],
        multipleSelection: [],
        tableData: [],
        totalCount: 0,
        printType: '',

        printDataModal: false,
        headerContent: {
          printDataId: {
            id: "printDataId",
            title: '打印'
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

        this.setTableData();
        // this.getDeposit();
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
      /********************************* 打印 ***********************************/
      // 分类打印
      printData(type, row) {
        let get = {
          user: 'paymentSliplistByUsers', // 单人实习
          school: 'paymentSliplistBySchool', // 学校
          major: 'paymentSliplistByMajor', // 专业
          batch: 'paymentSliplistByUsers', // 批量
          merge: 'paymentMergeByUserIds', // 合并
          dorm: 'paymentZslistByUsers', // 住宿
          zsf: 'paymentZslistByUsers', // 住宿（单人）
        };
        let params;
        this.printType = type;
        if (['user', 'zsf', 'dorm', 'batch', 'merge'].indexOf(type) > -1) { // 批量或者单人打印
          this.userIds.length = 0;
          if (['dorm', 'batch', 'merge'].indexOf(type) > -1) { // 批量\合并\住宿打印
            if (this.multipleSelection.length < 1) {
              this.errorMess('至少选择一人才能打印！');
              return;
            }
            for (let i = 0, schoolName, d = this.multipleSelection, l = d.length; i < l; i++) {
              this.userIds.push(d[i].userId);
              // 合并打印（按学校）
              if (['merge'].indexOf(type) > -1) {
                if (!schoolName) {
                  schoolName = d[0].schoolName
                }
                if (schoolName !== d[i].schoolName) {
                  this.errorMess(`选择的人员必须是同一所学校才能打印！`);
                  return
                }
              }
            }
          } else { // 单人打印
            this.userIds = [row.userId];
          }

          params = {
            userIds: this.userIds.join(','),
          }
        } else { // 专业或者学习
          if (!this.searchObj.year) { // year必须有值
            this.errorMess('请打开筛选并且选择对应的年份！');
            return;
          }
          this.searchObj.year = this.conductDate(this.searchObj.year, 'yyyy');
          params = this.searchObj;
        }
        this.ajax({
          ajaxSuccess: res => { // 获取到数据并打开打印模态窗
            if (res.data.length) {
              this.printDatas = res.data;
              this.getPrintUser(res.data);
              this.openModel('printData')
            } else if (res.data.userIds) { // 合并打印
              this.printDatas = [res.data];
              this.userIds = res.data.userIds.split(',');
              this.openModel('printData')
            } else {
              this.showMess('暂无可打印的数据')
            }
          },
          ajaxParams: {
            url: api[get[type]].path,
            method: api[get[type]].method,
            params
          }
        })
      },
      // 获取押金
      getDeposit() {
        let opt = {
          ajaxSuccess: res => this.deposit = res.data.configValue,
          ajaxParams: {
            url: api.getByKey.path + 'rotary_deposit-SXS',
            method: api.getByKey.method,
          }
        };
        this.ajax(opt)
      },
      // 获取打印的人
      getPrintUser(data) {
        this.userIds.length = 0;
        data.map(item => {
          this.userIds = this.userIds.concat((item.userIds || item.userId).split(','))
        })
      },
      // 打印完成
      printDone() {
        this.ajax({
          ajaxSuccess: res => this.setTableData(),
          ajaxParams: {
            url: api.modifyPrint.path + this.userIds.join(','),
            method: api.modifyPrint.method,
            data:{
              type: ['user','school','major','batch'].indexOf(this.printType) > -1 ? 'sx' : 'zs', // sx 实习费用 | zs 住宿费用
            }
          }
        })
      },
    },
    components: {
      printData
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
  @import "../../../../assets/ambuf/css/common/print_charge";
  .internAuditList {
    .nation .el-input {
      width: 100%;
    }
  }
</style>
