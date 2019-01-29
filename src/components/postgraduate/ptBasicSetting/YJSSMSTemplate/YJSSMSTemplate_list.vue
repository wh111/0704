<!--
****--@file     YJSSMSTemplate_list
****--@date     2018/7/31 19:48
****--@author   YC
****--@describe 研究生短信模版设置
-->
<template>
  <div ref="content">
    <el-form :inline="true">
      <el-row>
        <el-col align="right">
          <el-form-item label="模板名称：">
            <el-input v-model.trim="searchObj.name"></el-input>
          </el-form-item>
          <el-button type="info" @click="search">搜索</el-button>
          <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
        </el-col>
        <div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">
        </div>
      </el-row>
    </el-form>
    <!-- 顶部按钮 -->
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData"
                tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column width="80">
          <template scope="scope">{{scope.row.index}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="success" @click="edit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="模板名称" width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" label="字典码" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="value" label="内容" show-overflow-tooltip></el-table-column>
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
    <Modal :mask-closable="false" v-model="showModal" class-name="vertical-center-modal" :width="600">
      <modal-header slot="header" :parent="self" :content="headerContent.showId"></modal-header>
      <show v-if="showModal" :url="api" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="editModal" class-name="vertical-center-modal" :width="600">
      <modal-header slot="header" :parent="self" :content="headerContent.editId"></modal-header>
      <edit v-if="editModal" :url="api" @edit="subCallback" @cancel="cancel" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api  from './api';
  import edit from './YJSSMSTemplate_input';
  import show from './YJSSMSTemplate_view';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'YJSSMSTemplateList',
    data () {
      return {
        api,
        deriveUrl: '',
        searchMore: false,
        searchObj: {
          name: '' // 姓名
        },
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        loading: false,
        shortNoteModal: false,
        deriveModal: false,
        operailityData: [],
        multipleSelection: [],
        tableData: [],
        totalCount: 0,
        headerContent: {
          editId: {
            id: 'edit',
            title: '修改'
          },
          showId: {
            id: 'show',
            title: '查看'
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            type: 'YJS',
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };

        this.setTableData();
      },
      /******************************** 按钮事件 *********************/
      // 修改
      edit (row) {
        this.operailityData = row;
        this.openModel('edit');
      },
      // 查看
      show (row) {
        this.operailityData = row;
        this.openModel('show');
      },
      // 搜索
      search () {
        this.setTableData();
      },
      // 筛选
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          if (this.searchMore) {
            this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight;
          } else {
            this.tabHeight = this.dynamicHt;
          }
        });
      },
      /********************************* 表格相关 *****************************/
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
        this.tableData = [];
        this.totalCount = res.totalCount || 0;
        if (res.data && res.data.length) {
          res.data.map(item => item.mobile = item.phone);
          this.tableData = res.data;
        }
      },
      //设置表格及分页的位置
      setTableDynHeight () {
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
      handleSelectionChange (val) {
        this.multipleSelection = val;
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
      // 允许选择的行
      canSelect (row) {
        return row.ysState == 'PASS';
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      // 弹窗回调
      subCallback (target, title, updata) {
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
      openModel (options) {
        this[options + 'Modal'] = true;
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
      edit, show
    }
  };

</script>
