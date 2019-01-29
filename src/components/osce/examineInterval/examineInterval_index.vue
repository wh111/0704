<template>
  <!-- 考核场次 -->
  <div ref="interval">
    <el-row style="padding-bottom:20px;">
      <el-col :span="14">
        <!-- 操作按钮 -->
        <el-button type="success" @click="add">新建考核</el-button>
        <el-button type="danger" @click="remove">删除考核</el-button>
      </el-col>
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
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo"
                style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
            <el-button size="small" @click="copy(scope.row)">复制</el-button>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="80" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="考核名称" prop="sceneName" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="skillType=='skillOutdepExam'" label="科室" prop="deptName" show-overflow-tooltip></el-table-column>
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
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 模态框 增加（add） -->
    <Modal v-model="selectModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="skillType=='skillOutdepExam'?550:320">
      <modal-header slot="header" :content="contentHeader.selectId"></modal-header>
      <select-type :url="url" v-if="selectModal" @cancel="cancel" @select="selectSceneType" :operaility-data="operailityData"></select-type>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 复制类型选择（selectCopyType） -->
    <Modal v-model="selectCopyTypeModal" height="200" title="对话框标题" class-name="vertical-center-modal" width="320">
      <modal-header slot="header" :content="contentHeader.selectCopyTypeId"></modal-header>
      <select-copy-type v-if="selectCopyTypeModal" @cancel="cancel" @select="selectCopyType"></select-copy-type>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal :mask-closable="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading"
           :width="500">
      <modal-header slot="header" :content="contentHeader.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 复制场次（copyScene） -->
    <Modal :mask-closable="false" height="200" v-model="copySceneModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading"
           :width="800">
      <modal-header slot="header" :content="contentHeader.copySceneId"></modal-header>
      <copy-scene v-if="copySceneModal" @copy="subCallback" @cancel="subCallback('copyScene')" :copySceneData="copySceneObj"></copy-scene>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
  let Util = null;

  import api from './api'; // API

  import examineTypeOption from './examineTypeOption'; // 类型选择
  import examineStatuOption from './examineStatuOption'; // 状态选择

  import selectType from './examineInterval_selectType'; // 选择新增考核类型
  import selectCopyType from './examineInterval_selectCopyType'; // 场次复制类型
  import copyScene from './examineInterval_copyScene'; // 场次复制
  import add from './examineInterval_add'; // 新增考核类型

  export default {
    props: {
      contenHeight: {
        type: Number,
        default: 100
      },
      update: { // 是否更新表格数据
        type: Boolean,
        default: false
      },
      url: { // 是否更新表格数据
        type: Object,
        default: null
      },
      skillType: { // 是否更新表格数据
        type: String,
        default: ''
      }
    },
    data () {
      return {
        api,
        examineTypeOption, // 类型选择
        examineStatuOption, // 状态选择
        totalCount: 0,
        self: this,
        tableHeight: 100,
        dynamicHt: 100, // 表格高度
        loading: false,
        showMoreSearch: false, // 更多筛选
        selectModal: false, // 选择新增的考核类型模态窗
        selectCopyTypeModal: false, // 选择复制的类型模态窗
        copySceneModal: false, // 复制场次弹窗
        operailityData: '',
        multipleSelection: '', // 表格已选集
        searchObj: { // 搜索
          sceneName: '', // 场次名称
          sceneType: '', // 类型
          status: '' // 状态
        },
        timer: '',
        tableData: [],
        copySceneObj: null, // 被复制场次的
        // 模态框提示
        contentHeader: {
          removeId: {
            id: 'removeId',
            title: '删除考核类型'
          },
          selectId: {
            id: 'selectId',
            title: '选择考核类型'
          },
          selectCopyTypeId: {
            id: 'selectCopyTypeId',
            title: '选择场次复制类型'
          },
          copySceneId: {
            id: 'copySceneId',
            title: '场次复制'
          }
        }
      };
    },
    methods: {
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init () {
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
        if (this.skillType == 'skillOutdepExam') {  //是技能出科试卷设置
          this.queryQptions.url = this.url.assessmentList.path;
        }
        this.setTableData();
      },
      /************************* 搜索逻辑 *********************************/
      search () {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.setTableData();
      },
      // 获取筛选按钮图标
      getSearchBtnIcon () {
        return this.showMoreSearch ? 'arrow-up' : 'arrow-down';
      },
      // 显示更多筛选
      openMoreSearch () {
        this.showMoreSearch = !this.showMoreSearch;
        this.$nextTick(() => {
          if (this.showMoreSearch) {
            this.tableHeight = this.dynamicHt - this.$refs.showMoreSearch.offsetHeight;
          } else {
            this.tableHeight = this.dynamicHt;
          }
        });
      },
      /************************* 表格逻辑 *********************************/
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
        Object.assign(this.queryQptions.params, this.tree);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight (otherHeight = 0) {
        let tableView = this.$refs.tableView;
        let paginationHt = 50 + otherHeight;
        this.dynamicHt = this.contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
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
          this.showMess('只能修改一条数据!');
          flag = false;
        }
        return flag;
      },
      /************************************** 模态框处理 **************************************************/
      // 增加，选择考核类型
      add () {
        this.openModel('select');
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove');
        }
      },
      // 增加回调
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
      },
      /************************** 其他逻辑 ******************************/
      // 新建场次选择场次类型
      selectSceneType (type, dept) {
        this.cancel('select');
        this.$emit('show', { // 打开增加（add）视图并传参type
          look: 'add',
          type,
          dept,
          id: '',
          sceneType: '',
          name: ''
        });
      },
      // 复制场次选择复制类型
      selectCopyType (type) {
        this.cancel('selectCopyType');
        if (type === 'one') { // 单个复制
          this.$emit('show', { // 打开添加（add）视图并传参id
            look: 'add',
            id: this.copySceneObj.id,
            type: this.copySceneObj.sceneType,
            sceneType: '',
            name: ''
          });
        } else { // 多个复制
          this.openModel('copyScene');
        }
      },
      // 查看
      show (row) {
        this.$emit('show', { // 打开查看（view）视图并传参id
          look: 'view',
          id: row.id,
          name: row.sceneName,
          sceneType: row.sceneType,
          type: ''
        });
      },
      // 复制
      copy (row) {
        this.copySceneObj = row;
        this.openModel('selectCopyType');
      }
    },
    components: {
      add,
      selectType,
      selectCopyType,
      copyScene
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
    watch: {
      contenHeight (val) {
        this.setTableDynHeight();
      },
      update (val) {
        val && this.setTableData();
      }
    },
    created () {
      Util = this.$util;
      this.init();
    },
    activated () {
      this.setTableData();
    },
    destroyed () {
    }
  };

</script>
<style lang="scss">
  @import '../../../assets/ambuf/css/manage_v1.0/editForm';

  .noMarginBottom {
    .el-form-item {
      margin-bottom: 0;
    }
  }

</style>
