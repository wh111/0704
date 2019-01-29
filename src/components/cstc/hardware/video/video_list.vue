<template>
  <!-- 摄像机管理 -->
  <div>
    <!--列表操作按钮-->
    <div style="margin-bottom: 20px;">
      <el-button size="small" type="primary" @click="add">添加摄像设备</el-button>
      <el-button size="small" type="danger" @click="remove">删除摄像设备</el-button>
    </div>
    <!--表格数据-->
    <div id="myTable" ref="myTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%;height: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" label="序号" type="index" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="140">
          <template scope="scope">
            <el-button size="small" type="info" @click="edit(scope.row)">修改</el-button>
            <el-button size="small" type="success" @click="debugDevice(scope.row)">调试</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="brand" label="品牌" width="120">
          <template scope="scope">{{ scope.row.brand | typeText }}</template>
        </el-table-column>
        <el-table-column prop="modelNum" label="设备型号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ip" label="设备IP" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="isConsole" label="是否带有云台">
          <template scope="scope">{{ scope.row.isConsole | typeText }}</template>
        </el-table-column>
        <el-table-column prop="locationType" label="设备所在位置">
          <template scope="scope">{{ scope.row.locationType | typeText }}</template>
        </el-table-column>

      </el-table>
    </div>
    <!--分页-->
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
        </el-pagination>
      </div>
    </div>

    <!--新建-->
    <Modal :mask-closable="false" width="1000" v-model="addModal" class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback"></add>
      <div slot="footer"></div>
    </Modal>
    <!--修改-->
    <Modal :mask-closable="false" width="1000" v-model="editModal" class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--调试-->
    <Modal :mask-closable="false" width="1000" v-model="debugVideoModal" class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="debugId"></modal-header>
      <debug-video v-if="debugVideoModal" @cancel="cancel" @debugVideo="subCallback" :operaility-data="operailityData"></debug-video>
      <div slot="footer"></div>
    </Modal>
    <!--删除弹窗-->
    <Modal :mask-closable="false" height="200" v-model="removeModal" class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;

  import api from './api';

  import add from './video_add'; // 增加
  import edit from './video_edit'; // 编辑
  import debugVideo from './video_debug'; // 调试

  export default {
    props: ['contenHeight'],
    data() {
      return {
        api,
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        loading: false,
        debugVideoModal: false,
        listTotal: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.list.path,
            method: api.list.method
          }
        },
        /*--按钮button--*/
        addId: {
          id: 'addId',
          title: '添加'
        },
        editId: {
          id: 'editId',
          title: '修改'
        },
        debugId: {
          id: 'debugId',
          title: '调试'
        },
        removeId: {
          id: 'removeId',
          title: '删除'
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
//            sortby: 'VIDEO_BRAND', // 排序字段
//            order: '', // 排序方式
          }
        }

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let myTable = this.$refs.myTable;
        let paginationHt = 120;
        this.dynamicHt = this.contenHeight - myTable.offsetTop - paginationHt;
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
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

      //通过get请求列表数据
      updateListData(responseData) {
        let data = this.addIndex(responseData.data || []);
        this.tableData = data;
        this.listTotal = responseData.totalCount;
      },
      setTableData() {
        this.listMessTitle.ajaxParams = Object.assign(this.listMessTitle.ajaxParams, this.queryQptions);
        this.ajax(this.listMessTitle);
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        let formData = Util._.defaultsDeep({}, this.formValidate);
      },
      /*--点击--添加--按钮--*/
      add() {
        this.openModel("add");
      },
      /*--点击--修改--按钮--*/
      edit(row) {
        this.operailityData = row;
        this.openModel("edit");
      },
      /********* 调试 ***********/
      debugDevice(row) {
        this.operailityData = row;
        this.openModel("debugVideo");
      },
      /*--点击--删除--按钮--*/
      remove() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *addMessTitle:{
       *    type:'add',
       *    successTitle:'添加成功!',
       *    errorTitle:'添加失败!',
       *    ajaxSuccess:'ajaxSuccess',
       *    ajaxError:'ajaxError',
       *    ajaxParams:{
       *      url:'/role/add',
       *      method:'post'
       *    }
       *}
       * @param udata boolean 默认false  是否不需要刷新当前表格数据
       * */
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
    watch: {
      contenHeight(val) {
        this.setTableDynHeight()
      }
    },
    components: {
      add,
      edit,
      debugVideo
    }
  }

</script>

<style>


</style>
