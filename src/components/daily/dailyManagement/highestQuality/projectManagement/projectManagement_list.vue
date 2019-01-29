<!--评优项目管理-->

<template>
  <div id="nosocomial" ref="nosocomial" class="modal">
    <el-row>
      <el-form :inline="true" ref="formValidate" label-width="100px" class="demo-ruleForm">
        <el-col :span="6">
          <el-button class="but-col" @click="add" type="success">添加</el-button>
          <el-button class="but-col" @click="remove" type="danger">删除</el-button>
        </el-col>
        <el-col :span="18" align="right">
          <el-form-item prop="title">
            <el-input v-model="formValidate.title" placeholder="输入标题搜索">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div id="nosocomialTable" ref="nosocomialTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canSelect">
        </el-table-column>
        <el-table-column label="序号" prop="index" width="70">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140" show-overflow-tooltip>
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看
            </el-button>
            <el-button size="small" type="warning" @click="edit(scope.row)">修改
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="roleName" label="对象 " show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="startDate" label="开始时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="endDate" label="结束时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.status | appraisingStatus }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
      <div>
        <!--修改弹窗-->
        <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal"
               :width="960">
          <!--<div slot="header"> -->
          <!--</div>-->
          <modal-header slot="header" :content="editId"></modal-header>
          <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
          <div slot="footer"></div>
        </Modal>
        <!---->
        <!--增加弹窗-->
        <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal"
               :width="960">
          <!--<div slot="header"> -->
          <!--</div>-->
          <modal-header slot="header" :content="addId"></modal-header>
          <edit v-if="addModal" @cancel="cancel" @add="subCallback"></edit>
          <div slot="footer"></div>
        </Modal>
        <!---->
        <!--查看弹窗-->
        <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
               :loading="true" :width="800">
          <modal-header slot="header" :content="showId"></modal-header>
          <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
          <div slot="footer"></div>
        </Modal>
        <!---->

        <!--删除弹窗-->
        <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题"
               class-name="vertical-center-modal" :loading="loading" :width="500">
          <modal-header slot="header" :content="removeId"></modal-header>
          <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel"
                  :operaility-data="operailityData"></remove>
          <div slot="footer"></div>
        </Modal>
        <!---->
      </div>
    </div>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  import api from './api';
  //引入--修改/增加--组件
  import edit from "./projectManagement_input.vue";
  //引入--查看--组件
  import show from "./projectManagement_view.vue";


  //当前组件引入全局的util
  let Util = null;
  let store = null;
  export default {

    data() {
      return {
        deleteUrl: api.delete,
        //查询表单
        formValidate: {
          title: '', //  标题
          roleId: '', //对象
          status: '', //项目状态
          startBeginDate: '', //自荐开始时间开始时间
          startEndDate: '', //自荐开始时间结束时间
        },

        searchData: {
          title: '提交',
          callParEvent: 'searchEvent'
        },
        addData: '',
        editData: '',
        showData: '',
        auditData: '',
        /*--按钮button--*/
        addId: {
          id: 'add',
          title: '添加'
        },
        removeId: {
          id: 'remove',
          title: '删除'
        },
        editId: {
          id: 'edit',
          title: '修改'
        },
        auditId: {
          id: 'auditId',
          title: '审核'
        },
        showId: {
          id: 'auditId',
          title: '查看'
        },

        publishModal: false,
        revocationModal: false,
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 0,
        self: this,
        tableData: [],
        loading: false,
        totalCount: 0,
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.list.path,
            params: {}
          }
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
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        }

        this.setTableData();
      },
        canSelect(row) {
            return row.status != 'ONGOING'
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
        this.totalCount = responseData.totalCount || 0;
        this.tableData = this.addIndex(responseData.data);
      },

      //请求数据
      setTableData() {
        let formValidate = this.formDate(this.getFormData(this.formValidate), ['startEndDate', 'startBeginDate'], this.yearMonthData);
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, formValidate);
        this.ajax(this.listMessTitle)
      },


      //搜索监听回调
      searchEvent(isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData()
        }
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        let flag = false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
        return flag
      },


      /*--点击--添加--按钮--
       * 只允许添加二级
       * */
      add() {
        //如果是一级节点则返回，只添加二级节点
        this.openModel('add');
      },


      /*--点击--删除--按钮--*/
      remove(index) {
        if (typeof index != 'number') {
          if (!this.isSelected()) return;
          this.operailityData = this.multipleSelection;
          this.openModel('remove')
        } else {
          this.operailityData = this.tableData[index];
          this.openModel('remove')
        }
      },


      publish() {
        if (!this.isSelected(true)) return;
        this.operailityData = this.multipleSelection;
        this.openModel('publish')
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = data;
        this.showModal = true;
      },


      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(data) {

        this.operailityData = data;
        this.openModel('edit')

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


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
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
      edit,
      show
    },
  }

</script>
<style>
  .add-remove {
    margin-bottom: 20px;
  }

  .header {
    height: 30px;
    font-size: 18px;
    color: #ffffff;
  }

</style>

