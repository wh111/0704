<!--
****--@file     midtermExaminationNotice_list
****--@date     2018/8/9 20:14
****--@author   YC
****--@describe 中期考核通知
-->
<template>
  <div id="content" ref="content">
    <!--搜索form-->
    <el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="9">
          <el-button type="info" @click="add">{{ 'new' | sysLan }}</el-button>
          <el-button type="success" :disabled="!canPublish" @click="publish">{{ 'publish' | sysLan }}</el-button>
          <el-button type="danger" @click="remove">{{ 'delete' | sysLan }}</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="15" align="right">
          <el-form-item label="研究生姓名" prop="userNames">
            <el-input v-model="formInline.userNames" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="search">{{ 'query' | sysLan }}</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore" align="right">
        <el-form-item label="导师姓名">
          <el-input v-model="formInline.teacherNames" placeholder="请输入"></el-input>
        </el-form-item>
        <date-group style="display: inline-block;" :dateGroup="{text:'',startDate:formInline.publishDateBegin,endDate:formInline.publishDateEnd}">
          <el-form-item label="发布日期" style="margin-left: 8px;" prop="publishDateBegin">
            <el-date-picker name="start" v-model="formInline.publishDateBegin" :editable="false" type="date"
                            placeholder="选择起始日期"
                            :picker-options="pickerOptions0"
                            @change="handleStartTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="-" prop="publishDateEnd" class="disabledRequired">
            <el-date-picker name="end" v-model="formInline.publishDateEnd" :editable="false" type="date"
                            placeholder="选择截止日期"
                            :picker-options="pickerOptions1"
                            @change="handleEndTime"></el-date-picker>
          </el-form-item>
        </date-group>
        <!--<el-form-item label="专业方向">-->
          <!--<el-select v-model="formInline.majorCode" clearable placeholder="请选择">-->
            <!--<major></major>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="发布状态">
          <el-select v-model="formInline.publishStatus" clearable placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="已发布" value="PUBLISH"></el-option>
            <el-option label="未发布" value="UNPUBLISH"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="search">{{ 'query' | sysLan }}</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!--- 中期培养列表 --->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          @selection-change="handleSelectionChange"
          style="width: 100%;height: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            label="序号"
            prop="index"
            width="100">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150">
            <template scope="scope">
              <el-button size="small" type="warning" :disabled="scope.row.publishStatus==='PUBLISH'" @click="edit(scope.row)">{{ 'edit' | sysLan }}</el-button>
              <el-button size="small" type="info" @click="show(scope.row)">{{ 'view' | sysLan }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="teacherNames"
            label="导师姓名"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="userNames"
            label="研究生姓名"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="publishDate"
            show-overflow-tooltip
            label="发布时间"
          >
            <template scope="scope">
              {{scope.row.publishDate || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="publishStatus"
            label="发布状态"
            show-overflow-tooltip
          >
            <template scope="scope">
              {{(scope.row.publishStatus || 'UNPUBLISH') | typeText}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="myPages.currentPage"
            :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
      <!--增加弹窗-->
      <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="800">
        <modal-header slot="header" :content="headerContent.addId"></modal-header>
        <edit v-if="addModal" @cancel="cancel" @add="subCallback"></edit>
        <div slot="footer"></div>
      </Modal>

      <!--编辑弹窗-->
      <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="800">
        <modal-header slot="header" :content="headerContent.editId"></modal-header>
        <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
        <div slot="footer"></div>
      </Modal>

      <!--查看弹窗-->
      <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="800">
        <modal-header slot="header" :content="headerContent.showId"></modal-header>
        <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>

      <!--删除弹窗-->
      <Modal :mask-closable="false" height="200" v-model="removeModal" class-name="vertical-center-modal" :loading="loading" :width="500">
        <modal-header slot="header" :content="headerContent.removeId"></modal-header>
        <remove v-if="removeModal" :delete-url="deleteUrl" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
        <div slot="footer"></div>
      </Modal>
      <!--发布周历-->
      <Modal :mask-closable="false" height="200" v-model="publishModal" class-name="vertical-center-modal" :loading="loading" :width="500">
        <modal-header slot="header" :content="headerContent.publishId"></modal-header>
        <operate v-if="publishModal" type="publish" :operateUrl="publishData.path" :postData="{publishStatus:'PUBLISH'}" @operate="subCallback" @cancel="cancel"
                 :operaility-data="operailityData"></operate>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api   from './api';
  import major from '../../common/major.vue';
  import show  from './midtermExaminationNotice_view';
  import edit  from './midtermExaminationNotice_input';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'midtermExaminationNoticeList',
    data () {
      return {
        rules: {},
        formInline: {
          publishDateBegin: '',
          publishDateEnd: '',
          teacherNames: '',
          userNames: '',
          majorCode: '',
          publishStatus: ''
        },
        deleteUrl: api.remove.path,
        publishModal: false,
        searchMore: false,
        operailityData: {},
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        loading: false,
        listTotal: 0,
        tableData: [],
        headerContent: {
          addId: {id: 'add', title: '新增'},
          editId: {id: 'edit', title: '修改'},
          showId: {id: 'show', title: '查看'},
          removeId: {id: 'remove', title: '删除'},
          publishId: {id: 'publishId', title: '发布'}
        },
        publishData: api.editStatus
      };
    },
    computed: {
      canPublish () {
        return this.multipleSelection.length ? this.multipleSelection.every(item => item.publishStatus !== 'PUBLISH') : true;
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        };
        this.setTableData();
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      setTableData () {
        let params = Object.assign({}, this.queryQptions.params, this.formInline);
        params.publishDateBegin = this.conductDate(params.publishDateBegin, 'yyyy-MM-dd');
        params.publishDateEnd = this.conductDate(params.publishDateEnd, 'yyyy-MM-dd');
        if (!params.publishDateBegin) {
          delete params.publishDateBegin;
        }
        if (!params.publishDateEnd) {
          delete params.publishDateEnd;
        }
        let opt = {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.list.path,
            params
          }
        };
        this.ajax(opt);
      },
      successGetList (res) {
        this.tableData = this.addIndex(res.data);
        this.listTotal = res.totalCount;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
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

      /**
       * 页面列表查询
       */
      search () {
        this.setTableData();
      },
      // 增加
      add () {
        this.openModel('add');
      },
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
      // 删除
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          if (!this.canPublish) {
            this.errorMess('含有已发布的通知，删除后不可恢复！');
          }
          this.openModel('remove');
        }
      },

      //发布周历
      publish () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('publish');
        }
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
        this[targer + 'Modal'] = false;
        this.showModal = false;
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
          this.showModal = false;
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight();
        });
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
    components: {show, major, edit}
  };

</script>
