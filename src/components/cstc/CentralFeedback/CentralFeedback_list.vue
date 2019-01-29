<template>
  <div id="CentralFeedback" ref="CentralFeedback">
    <el-row>
      <el-col align="right">
        <el-form :inline="true" onsubmit="return false">
          <el-form-item label="反馈者姓名:">
            <el-input placeholder="请输入姓名" v-model="searchObj.createrName" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <!--<el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">筛选</el-button>-->
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo" style="width: 100%;" >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column label="操作" :width="90">
          <template scope="scope">
              <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <!--<el-table-column label="反馈名称" prop="feedbackName" show-overflow-tooltip>-->
        <!--<template scope="scope">-->
        <!--{{scope.row.feedbackName || '-'}}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="反馈内容" prop="feedbackContent" show-overflow-tooltip></el-table-column>
        <el-table-column label="反馈时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="反馈者姓名" prop="createrName" show-overflow-tooltip></el-table-column>
        <!--<el-table-column label="回复数量" prop="replyNum" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column label="缩略图地址" prop="thumbnailPath" show-overflow-tooltip>-->
        <!--<template scope="scope">-->
        <!--{{scope.row.thumbnailPath || '-&#45;&#45;'}}-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 查看 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  let Util = null;

  import api from './api'; // API
  import show from './CentralFeedback_view'; // 查看中心反馈

  export default {
    data() {
      return {
        api,
        totalCount: 0,
        self: this,
        tableHeight: 0,
        dynamicHt: 100, // 表格高度
        loading: false,
        operailityData: [],
        multipleSelection: [], // 表格已选集
        tableData: [],
        searchObj: {
          createrName: ''
        },
        // 模态框提示
        contentHeader: {
          showId: {
            id: 'showId',
            title: '查看中心反馈详情'
          },
        },
        userId:'',
      }
    },
    methods: {
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.userId = this.$store.getters.getUserInfo.id;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          }
        }
        this.setTableData();
      },
      show(item){
        this.operailityData = item;
        this.openModel('show');
      },
      search() {
        this.setTableData();
      },
      /************************* 表格逻辑 *********************************/
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
        // let searchObj = this.formDate(this.$util._.defaultsDeep({}, this.searchObj), ['applicantStarDate', 'applicantEndDate']);
        Object.assign(this.queryQptions.params, this.$util._.defaultsDeep({}, this.searchObj));
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.CentralFeedback.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        this.dynamicHt = contenHeight - tableView.offsetTop;
        this.tableHeight = contenHeight - 120;
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
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },
      /************************************** 模态框处理 **************************************************/
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },

      // 增加回调
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
    components: {
      show,
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
    created() {
      Util = this.$util;
      this.init()
    }
  }

</script>
<style lang="scss">


</style>
