<!----------------------------------
****--@name     打印缴费单
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
---------------------------------->
<template>
  <div ref="conten">
    <el-form :model="searchObj" ref="searchObj" :inline="true">
      <el-row>
        <!--列表操作按钮-->
        <el-col :span="7">
          <el-button type="primary" @click="report" :disabled="disabled.report">学员报到</el-button>
          <el-button type="danger" @click="print" :disabled="disabled.print">打印</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="17" align="right">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="searchObj.name" placeholder="输入姓名搜索">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="searchEvent">{{ 'query' | sysLan }}</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>
        <!--高级搜索项-->
        <el-col v-show="searchMore" ref="searchMore" align="right">
          <!--<el-form-item label="年届:" prop="boundary">-->
          <!--<el-date-picker v-model="searchObj.boundary" type="year" placeholder="选择年份" :editable="false"-->
          <!--@change="selectBoundary"></el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item label="专业方向：">
            <el-select v-model="searchObj.majorCode" clearable placeholder="请选择">
              <major></major>
            </el-select>
          </el-form-item>
          <el-form-item label="学位：">
            <el-select v-model="searchObj.degree" clearable placeholder="请选择">
              <el-option v-for="(item,index) in degreeOption" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">{{ 'query' | sysLan }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格 -->
    <div ref="table">
      <el-table align="center" :context="self" :height="dynamicHt" :data="tableData" tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" prop="index" width="70"></el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="学号" prop="studentId" show-overflow-tooltip></el-table-column>
        <el-table-column label="姓名" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="性别" prop="sex">
          <template scope="scope">
            {{ scope.row.sex | typeText }}
          </template>
        </el-table-column>
        <el-table-column label="电话号码" prop="phone" show-overflow-tooltip></el-table-column>
        <!--<el-table-column label="年届" prop="boundary" show-overflow-tooltip></el-table-column>-->
        <el-table-column label="专业代码" prop="majorCode" show-overflow-tooltip></el-table-column>
        <el-table-column label="专业方向" prop="major" show-overflow-tooltip></el-table-column>
        <el-table-column label="学位类型" prop="degree" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.degree | typeText }}
          </template>
        </el-table-column>
        <!--<el-table-column label="应缴金额" prop="initialScore" show-overflow-tooltip></el-table-column>-->
        <el-table-column label="备注" prop="remarks" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="reportStatus" show-overflow-tooltip>
          <template scope="scope">
            {{ (scope.row.reportStatus || '未报到') | reportStatus }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!--查看-->
    <Modal :mask-closable="false" width="900" v-model="showModal" class-name="vertical-center-modal"
           :loading="loading">
      <modal-header slot="header" :content="showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--打印-->
    <Modal :mask-closable="false" width="900" v-model="printModal" class-name="vertical-center-modal"
           :loading="loading">
      <modal-header slot="header" :content="printId"></modal-header>
      <print-data v-if="printModal" :operaility-data="operailityData"></print-data>
      <div slot="footer"></div>
    </Modal>

    <!--报到-->
    <Modal close-on-click-modal="false" height="200" v-model="reportModal" class-name="vertical-center-modal"
           :loading="loading" :width="500">
      <modal-header slot="header" :content="reportId"></modal-header>
      <div v-if="reportModal">
        <p style="line-height: 30px;padding: 20px;font-size: 16px;">学员：{{ userNames.join('、') }}已报到？</p>
        <div align="center">
          <el-button type="info" @click="reportCall">确定</el-button>
          <el-button @click="cancel('report')">取消</el-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import major from '../../common/major.vue'
  import api from './api';
  import show from './ptPrintReceipts_view.vue';
  import printData from './ptPrintReceipts_print.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        excelExportUrl: api.excelExport,
        deleteUrl: api.delete,

        boundaryOption: [{value: "", label: "全部"},], // 年级
        degreeOption: [{value: "", label: "全部"}, {value: "MAJOR", label: "学术学位"}, {value: "LEARNING", label: "专业学位"},], // 学位

        disabled: {
          report: false,
          print: false,
        },

        searchObj: { // 搜索对象
          boundary: '', //年级
          name: '', // 姓名
          majorCode: '', // 专业
          degree: '', // 学位
          enterStrtus: 'ENROLL', // 已录取
        },

        //* 表格 *//
        self: this,
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        operailityData: '',
        multipleSelection: '', // 选项
        tableData: [], // 表格数据
        majorData: [],

        searchMore: false,
        reportModal: false,
        printModal: false,
        toChannelModal: false,
        shortNoteModal: false,
        porAddModal: false,

        /*--按钮button--*/
        reportId: {
          id: 'reportId',
          title: '报到'
        },
        showId: {
          id: 'showId',
          title: '查看'
        },
        printId: {
          id: 'printId',
          title: '打印'
        },

        // 报到使用
        userNames: [],
        userIds: [],
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getBoundaryByYear();

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
        this.getMajor();
        this.setTableData();
      },
      // 选择年届
      selectBoundary(val) {
        this.searchObj.boundary = val
      },
      // 获取专业
      getMajor() {
        let opt = {
          ajaxSuccess: res => {
            if (res.data && res.data.child) {
              this.majorData = res.data.child;
            }
            this.majorData.unshift({code: '', value: ""})
          },
          ajaxError: () => this.errorMess('获取专业失败'),
          ajaxParams: {
            url: api.majorList
          }
        };
        this.ajax(opt)
      },
      /************************** 表格 ************************/
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        let disabled = {
          print: false,
          report: false,
        };
        if (val.length) {
          disabled = {
            // 只允许打印一条已报到的数据
            print: !((val.length === 1) && (val[0].reportStatus === 'REPORT')),
            // 只允许未报到的人进行报到
            report: !val.every(item => item.reportStatus === null),
          };
        }
        this.disabled = disabled;
        this.multipleSelection = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
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
        let contenHeight = this.$refs.conten.parentNode.offsetHeight;
        let tableTop = this.$refs.table.offsetTop;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableTop - paginationHt;
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
      searchEvent(isLoading) {
        // let isSubmit = this.handleSubmit('searchObj');
        // if (isSubmit) {
        this.setTableData()
        // }
      },
      /************************** 搜索 ************************/
      // 年级
      getBoundaryByYear() {
        let now = new Date().getFullYear();
        let lastYear = 2016;
        for (let i = 0; i <= now - lastYear; i++) {
          this.boundaryOption.push({value: now - i, label: now - i})
        }
      },
      /************************ 操作***************************/
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },
      // 报到
      report() {
        if (this.isSelected()) {
          let name = [];
          let id = [];
          this.multipleSelection.map(item => {
            name.push(item.name);
            id.push(item.id);
          });
          this.userNames = name;
          this.userIds = id;
          this.openModel('report')
        }
      },
      // 报到回调
      reportCall() {
        let ids = this.userIds.join(',');
        let opt = {
          ajaxSuccess: res => this.subCallback('report', '学员报到'),
          ajaxError: () => this.errorMess('学员报到失败'),
          ajaxParams: {
            url: api.report.path + ids,
            method: api.report.method,
            data: {
              ids,
              reportStatus: "REPORT"
            },
          }
        };
        this.ajax(opt)
      },
      // 打印
      print() {
        if (this.isSelected(true)) {
          this.operailityData = this.multipleSelection[0];
          this.openModel('print')
        }
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      // 搜索
      search() {
        this.setTableData();
      },
      /********************** 模态窗操作 ************************/
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      /*
     * 打开指定的模态窗体
     * @param options string 当前指定的模态:"add"、"edit"
     * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      // 操作回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
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
      show, printData, major
    }
  }
</script>
