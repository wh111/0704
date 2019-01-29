<!-- 出科技能补考审核(dd) -->
<template>
  <div ref="givenSkillMakeUpAudit">
    <el-form :inline="true" align="right">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >
          &nbsp;
        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item label="姓名：">
            <el-input v-model="searchObj.userName">
              <el-button @click="search"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
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
        <el-button type="info" @click="search">查询</el-button>
      </div>
    </el-form>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
        style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" prop="index" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template scope="scope">
            <el-button :disabled="!['NO_AUDIT'].includes(scope.row.examState )"  size="small" type="success" @click="add(scope.row)">审核</el-button>
            <el-button  size="small" type="info" @click="show(scope.row)">查看</el-button>
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
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                       :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contenHeader.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 增加（add） -->
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
  import add from './givenSkillMakeUpAudit_add';
  import show from './givenSkillMakeUpAudit_view';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        searchObj: {
          userName: '', // 姓名
          schoolName: '', // 学校名称
        },
        dynamicHt: 100,
        self: this,
        searchMore: false,
        operailityData: [],
        multipleSelection: [],
        tableData: [],
        totalCount: 0,
        contenHeader: {
          addId: {
            id: "addId",
            title: "出科补考审核"
          },
          showId: {
            id: "showId",
            title: "出科补考查看"
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

        this.setTableData()
      },
      /*************************** 按钮事件 *************************/
      // 搜索
      search() {
        this.setTableData()
      },
      // 审核
      add(row) {
        this.operailityData = row;
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
