<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <!--列表操作按钮-->
    <div style="margin-bottom: 20px;">
      <el-button size="small" type="info" @click="add">添加读卡器</el-button>
      <el-button size="small" type="danger" @click="remove">删除读卡器</el-button>
    </div>
    <!--表格数据-->
    <div id="myTable" ref="myTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                highlight-current-row style="width: 100%;height: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" label="序号" prop="index" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="140">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="warning" @click="edit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="roomNum" label="房间号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="readerIp" label="读卡器IP" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
        </el-pagination>
      </div>
    </div>

    <!--新建-->
    <Modal :mask-closable="false" width="600" v-model="addModal" class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <reader-input v-if="addModal" @cancel="cancel" @add="subCallback"></reader-input>
      <div slot="footer"></div>
    </Modal>
    <!--修改-->
    <Modal :mask-closable="false" width="600" v-model="editModal" class-name="vertical-center-modal"
           :loading="loading">
      <modal-header slot="header" :content="editId"></modal-header>
      <reader-input v-if="editModal" @cancel="cancel" @edit="subCallback"
                    :operailityData="operailityData"></reader-input>
      <div slot="footer"></div>
    </Modal>
    <!--查看-->
    <Modal :mask-closable="false" width="600" v-model="showModal" class-name="vertical-center-modal"
           :loading="loading">
      <modal-header slot="header" :content="showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operailityData="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--删除弹窗-->
    <Modal :mask-closable="false" height="200" v-model="removeModal" class-name="vertical-center-modal"
           :loading="loading" :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="deleteUrl" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import readerInput from './reader_input.vue';
  import show from './reader_view.vue';

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['contenHeight'],
    data() {
      return {
        deleteUrl: api.delete,
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        loading: false,
        debugAudioModal: false,
        listTotal: 0,

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
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
        showId: {
          id: 'showId',
          title: '查看'
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
          }
        };

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
          this.showMess("只能操作一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData) {
        let data = this.addIndex(responseData.data || []);
        if (data instanceof Array) {
          data.map(item => item.id = item.readerId)
        }
        this.tableData = data;
        this.listTotal = responseData.totalCount;
      },
      setTableData() {
        Object.assign(this.listMessTitle.ajaxParams, this.queryQptions);
        this.ajax(this.listMessTitle);
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
      /********* 查看 ***********/
      show(row) {
        this.operailityData = row;
        this.openModel("show");
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
      readerInput, show
    }
  }

</script>
