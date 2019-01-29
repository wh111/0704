<!--档案审核-->
<template>
  <div id="content" ref="content" class="modal">
    <div class="listUpAreaBox">
      <div class="listUpArea-menus">
        <div class="add-remove">
          <el-button type="primary" @click="add">添加</el-button>
          <el-button type="danger" @click="remove">删除</el-button>
          <!--<el-button type="info" @click="editPay">修改支付时间</el-button>-->
          <!--<el-button type="primary">导入</el-button>-->
          <!--<el-button type="primary">导出</el-button>-->
          <el-button type="danger" @click="pay">支付</el-button>
        </div>
      </div>
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          <!--右侧查询-->
          <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px">
            <div class="listUpArea-searchLeft">
              <el-input placeholder="请输入内容" v-model="formValidate.userName">
                <div slot="prepend">姓名</div>
                <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
              </el-input>
            </div>
            <div class="listUpArea-moreSearch">
              <!--<el-button @click="showMoreSearch" type="text">高级查询</el-button>-->
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!--<div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox">-->

    <!--</div>-->
    <br />
    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div id="myTable" ref="myTable">
        <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" highlight-current-row
          style="width: 100%;height: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" :selectable="canTodo">
          </el-table-column>
          <el-table-column align="center" label="序号" prop="index">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" align="center">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
              <el-button size="small" @click="edit(scope.row)" :disabled="scope.row.payStatus == 1">修改</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="userName" label="姓名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="types" label="类型" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.types | laborUserType }}
            </template>
          </el-table-column>
          <el-table-column prop="jbrName" label="经办人" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="money" label="金额" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="payTime" label="支付时间"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="yt" label="用途" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="payStatus" label="状态" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.payStatus | laborPayStatus }}
            </template>
          </el-table-column>

        </el-table>
      </div>
      <!--分页-->
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
          </el-pagination>
        </div>
      </div>
    </div>

    <!--新建-->
    <Modal close-on-click-modal="false" width="1000" v-model="addModal"  class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!--修改-->
    <Modal close-on-click-modal="false" width="1000" v-model="editModal"  class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>

    <!--删除弹窗-->
    <Modal close-on-click-modal="false"  v-model="removeModal"  class-name="vertical-center-modal" :loading="loading"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="deleteUrl" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>

      <div slot="footer"></div>
    </Modal>
    <!--查看档案管理弹窗-->
    <Modal width="1000" v-model="showModal" title="查看档案管理弹窗" class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>


    <!--支付弹窗-->
    <Modal close-on-click-modal="false"  v-model="payModal"  class-name="vertical-center-modal" :loading="loading"
      :width="500">
      <modal-header slot="header" :content="payId"></modal-header>
      <operate v-if="payModal" :type="'pay'" methods="post" :operateUrl="payUrl" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--修改支付时间弹窗-->
    <Modal close-on-click-modal="false"  v-model="editPayModal"  class-name="vertical-center-modal"
      :loading="loading" :width="500">
      <modal-header slot="header" :content="editPayId"></modal-header>
      <edit-pay v-if="editPayModal" @editPay="subCallback" @cancel="cancel" :operaility-data="operailityData"></edit-pay>
      <div slot="footer"></div>
    </Modal>
    <!---->
  </div>
</template>
<script>
  import api from './api';
  /*当前组件必要引入*/
  //引入--新建--组件
  import editPay from "./laborManagement_editPay.vue";
  //引入--查看--组件
  import show from "./laborManagement_view.vue";
  //引入--查看--组件
  import add from "./laborManagement_add.vue";
  //引入--查看--组件
  import edit from "./laborManagement_edit.vue";

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        //查询表单
//        listUrl: '/role/list?name=&identify=&type=',
        deleteUrl: api.delete,
        payUrl:api.pay,
        formValidate: {
          userName: '',
        },

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        loading: false,
        listTotal: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
//          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.list.path,
            method:api.list.method,
            params:{},
          }
        },
        payModal: false,
        editPayModal: false,
        /*--按钮button--*/
        addId: {
          id: 'addId',
          title: '新建'
        },
        editId: {
          id: 'editId',
          title: '修改'
        },
        removeId: {
          id: 'removeId',
          title: '删除'
        },
        viewId: {
          id: 'viewId',
          title: '查看'
        },
        payId: {
          id: 'payId',
          title: '支付'
        },
        editPayId: {
          id: 'editPayId',
          title: '修改支付时间'
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
          //url:this.listUrl,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
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
          this.showMess("只能选择一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        this.tableData = this.addIndex(data);
        this.listTotal = responseData.totalCount;
      },
      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params,this.formValidate);
        this.ajax(this.listMessTitle);
      },
      // 已支付的不允许选择参与操作
      canTodo(row){
        return row.payStatus != 1
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        this.setTableData()
      },


      /*--点击--添加--按钮--*/
      add() {
        this.openModel("add");
      },

      /*--点击--修改支付--按钮--*/
      editPay(data) {
        if (!this.isSelected(true)) return;
        this.operailityData = this.multipleSelection[0];
        this.openModel("editPay");
      },


      /*--点击--删除--按钮--*/
      remove() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },


      /*--点击--修改--按钮--*/
      edit(data) {
        this.operailityData = data;
        this.openModel("edit");
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = data;
        this.openModel("show");
      },


      pay() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel("pay");
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
       *    }
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
    components: {
      //当前组件引入的子组件
      editPay,
      show,
      edit,
      add
    }
  }

</script>
