<!--
****--@file     givenSkillMakeUpWrite_list
****--@date     2018/2/6 15:01
****--@author   YC
****--@describe 出科技能补考填写列表
-->
<template>
  <div ref="givenSkillMakeUpAudit">
    <el-form :inline="true" align="right">
      <el-row>
        <!--列表操作按钮-->
        <el-col :span="10" align="left">
          <el-button type="info" @click="add">添加</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14" align="right">
          <el-form-item label="姓名：">
            <el-input v-model="searchObj.userName">
              <el-button @click="search" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore" align="right">
        <el-form-item label="学校：">
          <el-input v-model="searchObj.schoolName"></el-input>
        </el-form-item>
        <!--<el-form-item label="排序字段：">-->
        <!--<el-select v-model="otherParams.sortby" placeholder="请选择">-->
        <!--<el-option v-for="item in sortbyOption" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="排序方式：">-->
        <!--<el-select v-model="otherParams.order" placeholder="请选择">-->
        <!--<el-option v-for="item in orderOption" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="科室：">
          <el-select v-model="searchObj.depId" placeholder="请选择">
            <el-option v-for="item in podIdOption" :key="item.id" :label="item.depName" :value="item.depId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="info" @click="search">查询</el-button>
      </div>
    </el-form>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="dynamicHt" :context="self" :data="tableData"
                tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" prop="index" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" width="200"></el-table-column>
        <el-table-column prop="schoolName" label="学校" show-overflow-tooltip></el-table-column>
        <el-table-column prop="depName" label="科室" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rotaryBeginTime" label="入科时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rotaryEndTime" label="出科时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="NO_AUDIT" label="状态" show-overflow-tooltip>
          <template scope="scope">{{scope.row.examState | givenSkillMakeUpAudit}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes"
                       :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contenHeader.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contenHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import add from './givenSkillMakeUpWrite_add';
  import show from '../../rotateRecordAudit/givenSkillMakeUpAudit/givenSkillMakeUpAudit_view';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        searchObj: {
          depId: '',
          userName: '', // 姓名
          schoolName: '', // 学校名称
        },
        userId: this.$store.state.userInfo.id || '',
        userType: this.$store.state.userInfo.studentTypes || '',
        dynamicHt: 100,
        self: this,
        searchMore: false,
        podIdOption: [],
        operailityData: [],
        multipleSelection: [],
        tableData: [],
        totalCount: 0,
        contenHeader: {
          addId: {
            id: "addId",
            title: "添加出科技能补考"
          },
          showId: {
            id: "showId",
            title: "出科技能补考查看"
          }
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
          method: api.list.method,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.getPodIdOption();
        this.setTableData()
      },
      getPodIdOption() {
        let opt = {
          ajaxSuccess: res => {
            res.data.unshift({
              id: 0,
              depId: '',
              depName: '全部',
            })
            this.podIdOption = res.data
          },
          ajaxParams: {
            url: api.getPodId.path + `${this.userType}-${this.userId}`,
            method: api.getPodId.method
          }
        }
        this.ajax(opt)
      },
      /*************************** 按钮事件 *************************/
      // 搜索
      search() {
        this.setTableData()
      },
      // 审核
      add() {
        this.openModel('add')
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      /********************************* 表格相关 *****************************/
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
        let contenHeight = this.$refs.givenSkillMakeUpAudit.parentNode.offsetHeight;
        let tableData = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
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

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },

    },
    created() {
      this.init();
    },
    mounted() { //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {
      add,
      show
    }
  }

</script>
