<!----------------------------------
****--@name     我的考核
****--@role     ${*}
****--@date     2018/3/19
****--@author   gx
----------------------------------->
<template>
  <!-- 考核场次 -->
  <div id="nosocomial" ref="nosocomial">
    <el-row style="padding-bottom:20px;">
      <el-col :span="14">&nbsp;</el-col>
      <!-- 搜索框 -->
      <el-col :span="10" align="right">
        <el-input placeholder="请输入考核名称" v-model="searchObj.sceneName" style="max-width:250px">
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-input>
        <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div ref="showMoreSearch" align="right" style="overflow:hidden;" v-show="showMoreSearch">
      <el-form :inline="true" label-width="74px">
        <el-row>
          <el-form-item label="考核名称:">
            <el-input v-model="searchObj.sceneName"></el-input>
          </el-form-item>
          <el-form-item label="考核类型:">
            <el-select v-model="searchObj.sceneType" placeholder="请选择">
              <el-option v-for="item in examineTypeOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考核状态:">
            <el-select v-model="searchObj.status" placeholder="请选择">
              <el-option v-for="item in examineStatuOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button @click="search" type="info">查询</el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 表格数据 -->
    <div id="nosocomialTable" ref="nosocomialTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo"
                style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template scope="scope">
            <el-button size="small" type="info" @click="downloadATi(scope.row)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="80" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="考核名称" prop="sceneName" show-overflow-tooltip></el-table-column>
        <el-table-column label="开始时间" prop="statrTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="站数" prop="stationNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="参考人数" width="120" prop="examineeNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="考核类型" prop="sceneType" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.sceneType | typeText }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.status | typeText }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount"></el-pagination>
    </div>
    <!--下载准考证-->
    <Modal width="500" v-model="downloadATiModal" title="对话框标题" class-name="vertical-center-modal" @on-cancel="cancel">
      <modal-header slot="header" :content="contentHeader.downloadATiId"></modal-header>
      <derive v-if="downloadATiModal" @cancel="downloadATiModal=false" messTitle="确定下载准考证吗？" :url="downloadUrl"></derive>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  let Util = null;
  import api from './api'; // API
  import examineTypeOption from '../examineInterval/examineTypeOption'; // 类型选择
  import examineStatuOption from '../examineInterval/examineStatuOption'; // 状态选择

  export default {
    data() {
      return {
        api,
        downloadUrl: '',//下载准考证url
        examineTypeOption, // 类型选择
        examineStatuOption, // 状态选择
        totalCount: 0,
        self: this,
        tableHeight: 100,
        dynamicHt: 100, // 表格高度
        loading: false,
        showMoreSearch: false, // 更多筛选
        selectModal: false, // 选择新增的考核类型模态窗
        downloadATiModal: false, // 选择新增的考核类型模态窗
        operailityData: '',
        contenHeight: 0,
        multipleSelection: '', // 表格已选集
        searchObj: { // 搜索
          sceneName: '', // 场次名称
          sceneType: '', // 类型
          status: '' // 状态
        },
        tableData: [],
        // 模态框提示
        contentHeader: {
          downloadATiId: {
            id: 'downloadATiId',
            title: '下载准考证'
          },
        }
      }
    },
    methods: {
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init() {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          }
        }
        if (this.skillType == 'skillOutdepExam') {  //是技能出科试卷设置
          this.queryQptions.url = this.url.assessmentList.path;
        }
        this.setTableData();
      },
      /************************* 搜索逻辑 *********************************/
      search() {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.setTableData();
      },
      // 获取筛选按钮图标
      getSearchBtnIcon() {
        return this.showMoreSearch ? 'arrow-up' : 'arrow-down'
      },
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      openMoreSearch() {
        this.showMoreSearch = !this.showMoreSearch;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
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
        Object.assign(this.queryQptions.params, this.tree);
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
        let nosocomial = this.$refs.nosocomial;
        let parHt = nosocomial.parentNode.offsetHeight;
        let nosocomialTable = this.$refs.nosocomialTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - nosocomialTable.offsetTop - paginationHt;
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

      //下载准考证
      downloadATi(row) {
        let params = {
          sceneId: row.id,
          userId: this.$store.getters.getUserInfo.id,
        }
        this.downloadUrl = this.api.importWord.path + this.$util.serializeParams(params);
        this.openModel('downloadATi');

      },
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
    components: {},
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
    watch: {},
    created() {
      Util = this.$util;
      this.init()
    }
  }

</script>
<style lang="scss">
  @import '../../../assets/ambuf/css/manage_v1.0/editForm';

  .noMarginBottom {
    .el-form-item {
      margin-bottom: 0;
    }
  }

</style>
