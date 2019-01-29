<!----------------------------------
****--@name     人员审核
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
---------------------------------->
<template>
  <div ref="conten">
    <el-form :model="searchObj" ref="searchObj" inline>
      <el-row>
        <el-col :span="4">
          <el-button type="info" @click="report('')">批量审核</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="20" align="right">
          <el-form-item prop="name" label="姓名：">
            <el-input  v-model="searchObj.name" placeholder="输入姓名搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="search">{{ 'query' | sysLan }}</el-button>
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

    <!-- 操作按钮 -->
    <!--<el-col style="padding-bottom: 20px">-->
    <!--<el-button type="primary" @click="derive" >导出</el-button>-->
    <!--</el-col>-->
    <!-- 表格 -->
    <div ref="table">
      <el-table align="center" :context="self" :height="dynamicHt" :data="tableData" tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canSelect"></el-table-column>
        <el-table-column label="序号" prop="index" width="70"></el-table-column>
        <el-table-column label="操作" align="center" width="70">
          <template scope="scope">
            <el-button size="small" type="success" @click="report(scope.row)"
                       :disabled="scope.row.accountStatus === 'AUDIT_SUCCESS'">审核
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="学号" prop="studentId" show-overflow-tooltip></el-table-column>
        <el-table-column label="姓名" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="性别" prop="sex">
          <template scope="scope">
            {{ scope.row.sex | typeText }}
          </template>
        </el-table-column>
        <!--<el-table-column label="年届" prop="boundary" show-overflow-tooltip></el-table-column>-->
        <el-table-column label="电话号码" prop="phone" show-overflow-tooltip></el-table-column>
        <el-table-column label="专业代码" prop="majorCode" show-overflow-tooltip></el-table-column>
        <el-table-column label="专业方向" prop="major" show-overflow-tooltip></el-table-column>
        <el-table-column label="学位类型" prop="degree" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.degree | typeText }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="accountStatus" show-overflow-tooltip>
          <template scope="scope">
            {{ (scope.row.accountStatus || '待审核') | typeText }}
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

    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal"
           class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="excelExportUrl">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click=" deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>

    <!--审核-->
    <Modal close-on-click-modal="false" height="200" v-model="reportModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="operailityData instanceof Array ? 500 : 1000">
      <modal-header slot="header" :content="reportId"></modal-header>
      <report v-if="reportModal" :operaility-data="operailityData" @report="subCallback"></report>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import major  from '../../common/major.vue';
  import api    from './api';
  import report from './ptApplyAudit_report.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        excelExportUrl: api.excelExport,
        deleteUrl: api.delete,

        boundaryOption: [{value: '', label: '全部'}], // 年级
        degreeOption: [{value: '', label: '全部'}, {value: 'MAJOR', label: '学术学位'}, {value: 'LEARNING', label: '专业学位'}], // 学位

        searchObj: { // 搜索对象
          boundary: '', //年级
          name: '', // 姓名
          major: '', // 专业
          degree: '', // 学位
          majorCode: '' //
        },

        //* 表格 *//
        self: this,
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        operailityData: '',
        multipleSelection: [],
        tableData: [], // 表格数据

        searchMore: false,
        reportModal: false,
        deriveModal: false,
        toChannelModal: false,
        shortNoteModal: false,
        porAddModal: false,

        /*--按钮button--*/
        reportId: {
          id: 'reportId',
          title: '审核'
        },
        deriveId: {
          id: 'deriveId',
          title: '导出'
        },

        majorData: []
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
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
        };
        this.getMajor();
        this.setTableData();
      },
      // 获取专业
      getMajor () {
        let opt = {
          ajaxSuccess: res => {
            if (res.data && res.data.child) {
              this.majorData = res.data.child;
            }
            this.majorData.unshift({code: '', value: ''});
          },
          ajaxError: () => this.errorMess('获取专业失败'),
          ajaxParams: {
            url: api.majorList
          }
        };
        this.ajax(opt);
      },
      // 选择年届
      selectBoundary (val) {
        this.searchObj.boundary = val;
      },
      /************************** 表格 ************************/
      // 允许选择的行
      canSelect(row) {
        return row.accountStatus !== 'AUDIT_SUCCESS'
      },
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
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = this.addIndex(res.data || []);
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let contenHeight = this.$refs.conten.parentNode.offsetHeight;
        let tableTop = this.$refs.table.offsetTop;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableTop - paginationHt;
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
          this.showMess('只能选择一条数据!');
          flag = false;
        }
        return flag;
      },
      /************************** 搜索 ************************/
      // 获取年级
      getBoundaryByYear () {
        let now = new Date().getFullYear();
        let lastYear = 2016;
        for (let i = 0; i <= now - lastYear; i++) {
          this.boundaryOption.push({value: now - i, label: now - i});
        }
      },
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight();
        });
      },
      //搜索监听回调
      searchEvent (isLoading) {
        // let isSubmit = this.handleSubmit('searchObj');
        // if (isSubmit) {
        this.setTableData();
        // }
      },
      /************************ 操作***************************/
      // 查看
      report (row) {
        if (!row) {
          if (!this.multipleSelection.length) {
            this.errorMess('请选择需要审核的数据！');
            return;
          }
          this.operailityData = this.multipleSelection;
        } else {
          this.operailityData = row;
        }
        this.openModel('report');
      },
      // 搜索
      search () {
        this.setTableData();
      },

      //导出
      derive () {
        this.openModel('derive');
      },

      //确定导出
      affirmDerive () {
        this.cancel('derive');
      },

      /********************** 模态窗操作 ************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 操作回调
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      }
    },
    created () {
      this.init();
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
    components: {
      report, major
    }
  };
</script>
