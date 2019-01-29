<!--师资管理-->
<template>
  <div id="content" ref="content" class="modal">
    <div class="listUpAreaBox">
      <div class="listUpArea-menus">
        <div class="add-remove" v-if="deptId">
          <el-button type="primary" @click="audit">审核</el-button>
        </div>
      </div>
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          <!--右侧查询-->
          <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin"
                   label-width="60px">
            <div class="listUpArea-searchLeft">
              <el-input placeholder="请输入内容" v-model="formValidate.name">
                <div slot="prepend">姓名</div>
                <el-button slot="append" @click="handleSubmit" icon="search"></el-button>
              </el-input>
            </div>
            <div class="listUpArea-moreSearch">
              <el-button @click="showSearchMore" type="text">高级查询</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="searchMore" class="listUpAreaMoreSearchBox" ref="searchMore">
      <el-form :inline="true" align="right">
        <el-form-item label="教学职称：">
          <el-input v-model="formValidate.teachTitle"></el-input>
        </el-form-item>
        <el-form-item label="专业名称：">
          <el-input v-model="formValidate.specialtyName"></el-input>
        </el-form-item>
        <el-form-item label="培养单位：">
          <el-input v-model="formValidate.trainCompany"></el-input>
        </el-form-item>
        <el-form-item label="是否获得教学职称：">
          <el-select v-model="formValidate.hasTeachTitle" placeholder="请选择">
            <el-option v-for="(item,index) in typeOption" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否承担理论授课：">
          <el-select v-model="formValidate.hasTheoryTeach" placeholder="请选择">
            <el-option v-for="(item,index) in typeOption" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否临床带教：">
          <el-select v-model="formValidate.hasClinic" placeholder="请选择">
            <el-option v-for="(item,index) in typeOption" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select v-model="formValidate.auditStatus" placeholder="请选择">
            <el-option value="" label="全部"></el-option>
            <el-option value="NOT_SUBMIT" label="未上报"></el-option>
            <el-option value="NOT_AUDIT" label="未审核"></el-option>
            <el-option value="AUDIT_FAILURE" label="不通过"></el-option>
            <el-option value="AUDIT_SUCCESS" label="通过"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="handleSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--列表数据-->
    <div id="myTable" ref="myTable" class="userDataTable">
      <el-table align="center" :height="tabHeight" :context="self" :data="tableData" tooltip-effect="dark"
                highlight-current-row style="width: 100%;height: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="selectable" width="55">
        </el-table-column>
        <el-table-column align="center" label="序号" prop="index" width="100">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template scope="scope">
            <el-button size="small" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="姓名" show-overflow-tooltip>
        </el-table-column>
        <!-- 导师显示列 -->
        <template v-if="deptId=='-102'">
          <el-table-column align="center" prop="tutorType" label="博导/硕导" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.tutorType | typeText}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="serveTutor" label="担任导师" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="researchDirection" label="主要研究方向" show-overflow-tooltip></el-table-column>
          <el-table-column prop="trainCompany" label="培养单位">
            <template scope="scope">
              {{ scope.row.trainCompany || '——' }}
            </template>
          </el-table-column>
        </template>
        <el-table-column prop="trainCompany" label="培养单位">
          <template scope="scope">
            {{ scope.row.trainCompany || '——' }}
          </template>
        </el-table-column>
        <el-table-column prop="specialtyName" label="专业">
          <template scope="scope">
            {{(scope.row.specialtyName || '——' ) | typeText}}
          </template>
        </el-table-column>
        <el-table-column prop="hasTeachTitle" label="是否获得教学职称" align="center">
          <template scope="scope">
            {{ (scope.row.hasTeachTitle === null ? '—' : scope.row.hasTeachTitle) | typeText}}
          </template>
        </el-table-column>
        <el-table-column prop="teachTitle" label="教学职称" align="center">
          <template scope="scope">
            {{(scope.row.teachTitle || '——' ) | typeText}}
          </template>
        </el-table-column>
        <el-table-column prop="hasClinic" label="是否临床带教" align="center">
          <template scope="scope">
            {{ (scope.row.hasClinic === null ? '—' : scope.row.hasClinic) | typeText}}
          </template>
        </el-table-column>
        <el-table-column prop="hasTheoryTeach" label="是否承担理论授课" align="center">
          <template scope="scope">
            {{ (scope.row.hasTheoryTeach === null ? '—' : scope.row.hasTheoryTeach) | typeText}}
          </template>
        </el-table-column>
        <el-table-column prop="hasTheoryTeach" label="审核状态" align="center">
          <template scope="scope">
            {{ (scope.row.auditStatus ) | typeText}}
          </template>
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
    <Modal :mask-closable="false" :width="1100" v-model="addModal" title="对话框标题" class-name="vertical-center-modal"
           :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :deptId="deptId"></add>
      <div slot="footer"></div>
    </Modal>
    <!--修改-->
    <Modal :mask-closable="false" :width="1100" v-model="editModal" title="对话框标题" class-name="vertical-center-modal"
           :loading="loading">
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--审核-->
    <Modal :mask-closable="false" :width="600" v-model="auditModal" title="对话框标题" class-name="vertical-center-modal"
           :loading="loading">
      <modal-header slot="header" :content="auditId"></modal-header>
      <audit v-if="auditModal" :treeObj="treeObj" @cancel="cancel" @audit="subCallback"
             :operaility-data="operailityData"></audit>
      <div slot="footer"></div>
    </Modal>
    <!--删除弹窗-->
    <Modal :mask-closable="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal"
           :loading="loading" :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="deleteUrl" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>

      <div slot="footer"></div>
    </Modal>
    <!--查看档案管理弹窗-->
    <Modal :mask-closable="false" :width="1100" v-model="showModal" title="查看档案管理弹窗" class-name="vertical-center-modal"
           :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import api from './api';
  import typeOption from './typeOption';
  /*当前组件必要引入*/
  //引入--新建--组件
  import add from './teachersManagement_add.vue';
  //引入--修改--组件
  import edit from './teachersManagement_edit.vue';
  //引入--修改--组件
  import audit from './teachersManagement_audit.vue';
  //引入--查看--组件
  //  import show from "./education _audit.vue";
  import show from '../../../teach/archivesManagement/archivesManagement/archivesManagement_view.vue';

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['deptId', 'treeObj'],
    data () {
      return {
        //查询表单
        typeOption,
        deleteUrl: api.delete,
        formValidate: {
          name: '',
          hasTeachTitle: '', // 是否获得教学职称 是Y/否N
          teachTitle: '', // 教学职称
          hasTheoryTeach: '', // 是否承担理论授课 是Y/否N
          hasClinic: '', // 是否临床带教 是Y/否N
          specialtyName: '', // 专业名称
          trainCompany: '', // 培养单位
          auditStatus: '' // 审核状态
        },

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        tableData: [],
        loading: false,
        searchMore: false,
        auditModal: false,
        listTotal: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.list.path,
            params: {}
          }
        },

        /**elemengt 表格 单元格是否可以选中
         * @params {Object} row 当行数据
         * @params {Number} index 当前行数
         * @return {boolean}
         * */
        selectable (row, index) {
          return ['NOT_SUBMIT', 'NOT_AUDIT'].includes(row.auditStatus) || !row.auditStatus;

        },
        /*--按钮button--*/
        addId: {
          id: 'addId',
          title: '新建'
        },
        auditId: {
          id: 'auditId',
          title: '审核'
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
          //url:this.listUrl,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };

        this.$nextTick(() => this.setTableData());
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
        this.tabHeight = parHt - myTable.offsetTop - paginationHt;
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
          this.showMess('只能修改一条数据!');
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data.splice(0, 150);
        this.tableData = [];
        data = this.addIndex(data);
        this.tableData = data;
        this.listTotal = responseData.totalCount || 0;
      },
      setTableData () {
        if (!this.deptId) {
          return;
        }
        Object.assign(this.queryQptions.params, this.formValidate, {typeId: this.deptId});
        this.listMessTitle.ajaxParams = Object.assign(this.listMessTitle.ajaxParams, this.queryQptions);
        this.ajax(this.listMessTitle);
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit () {
        this.setTableData();
      },
      /*--点击--添加--按钮--*/
      add () {
        this.openModel('add');
      },
      /*--点击--修改--按钮--*/
      edit (row) {
        this.operailityData = {
          id: row.archivesId
        };
        this.openModel('edit');
      },
      /*--点击--审核--按钮--*/
      audit (row) {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('audit');
      },
      /*--点击--删除--按钮--*/
      remove () {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show (row) {
        this.operailityData = {
          id: row.archivesId
        };
        this.openModel('show');
      },
      // 高级搜索按钮
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
      // 清除多选的值
      clearSearchVal () {
        for (let key in this.formValidate) {
          this.formValidate[key] = '';
        }
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
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
    watch: {
      deptId (val) {
        if (val) {
          this.$nextTick(() => {
            this.clearSearchVal();
            this.setTableData();
          });
        } else {
          this.tableData = [];
        }
      }
    },
    components: {
      //当前组件引入的子组件
      add,
      edit,
      show,
      audit
    }
  };

</script>
