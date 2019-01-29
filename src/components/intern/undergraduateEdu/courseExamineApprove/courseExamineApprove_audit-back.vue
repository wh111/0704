<!----------------------------------
****--@name     课程审核
****--@role     ${*}
****--@date     2018/5/25
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10">
          <el-button type="primary" :disabled="disabled.batchAudit" @click="batchAudit">批量审核</el-button>
        </el-col>
        <el-col :span="14" align="right">
          <el-form-item label="审核状态：">
            <el-select v-model="formValidate.courseArrangeState" placeholder="科室">
              <el-option label="全部" value=""></el-option>
              <el-option v-if="type=='jys'" label="教研室待审核" value="NO_PASS"></el-option>
              <el-option v-if="type=='jyc'" label="教育处待审核" value="JYC_NO_PASS"></el-option>
              <el-option label="驳回" value="REJECT"></el-option>
              <el-option label="通过" value="PASS"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
          <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
        </el-col>
      </el-row>
      <!--高级搜索项-->
    </el-form>
    <!--列表数据-->
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
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            prop="index"
            width="80">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="80">
            <template scope="scope">
              <el-button v-if="type==='jys'" :disabled="!['NO_PASS'].includes(scope.row.courseArrangeState)"
                         size="small"
                         @click="audit(scope.row)">审核
              </el-button>
              <el-button v-if="type==='jyc'" :disabled="!['JYC_NO_PASS'].includes(scope.row.courseArrangeState)"
                         size="small"
                         @click="audit(scope.row)">审核
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="courseDep"
            label="教研室">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="courseContent"
            label="课程内容">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="courseTimeCount"
            label="授课课时"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="timeInfo"
            width="120"
            label="时间段">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="courseAddress"
            label="授课地点">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="teacherUserNames"
            label="授课老师">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="courseArrangeState"
            label="状态">
            <template scope="scope">
              {{scope.row.courseArrangeState | courseArrangeState}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div style="margin: 10px;height: 45px">
        <div style="float: right;">
          <el-pagination
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="myPages.currentPage"
            :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--批量审核-->
    <Modal
      :mask-closable="false"
      width="500"
      v-model="batchAuditModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="batchAuditId"></modal-header>
      <batch v-if="batchAuditModal" :url="url" @cancel="cancel" @batchAudit="subCallback"
             :type="type" :operaility-data="auditData"></batch>
      <div slot="footer"></div>
    </Modal>
    <!--可编辑的审核-->
    <Modal
      :mask-closable="false"
      width="800"
      v-model="auditModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="auditId"></modal-header>
      <audit v-if="auditModal" :url="url" @cancel="cancel" @audit="subCallback"
             :type="type" :operaility-data="auditData"></audit>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--查看--组件
  import batch from './audit_batch.vue';
  import audit from './audit_editableAudit.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['url', 'operailityData', 'type'],
    data () {
      return {
        //查询表单
        formValidate: {
          weekSetId: this.operailityData.weekSetId, //周历id
          courseTeachingResearchRoom: this.operailityData.courseTeachingResearchRoom, //科室id
          courseArrangeState: '',
        },
        disabled: {
          batchAudit: false,
        },
        auditData: '',
        multipleSelection: [],
        dynamicHt: 400,
        self: this,
        tableData: [],
        searchMore: false,
        loading: false,
        auditModal: false,
        batchAuditModal: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.courseReviewList.path,
            params: {}
          }
        },
        /*--按钮button--*/
        batchAuditId: {id: 'auditId', title: '审核'},
        auditId: {id: 'auditId', title: '审核'},
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        console.log(this.type);
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        }
        this.setTableData();
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        let disabled = {batchAudit: false,};
        val.map(item => {
          if (this.type === 'jys' && !['NO_PASS'].includes(item.courseArrangeState)) {
            disabled.batchAudit = true;
          } else if (this.type === 'jyc' && !['JYC_NO_PASS'].includes(item.courseArrangeState)) {
            disabled.batchAudit = true;
          }
        })
        this.disabled = disabled;
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
          this.showMess('只能修改一条数据!')
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        this.tableData = this.addIndex(responseData.data || []);
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.getFormValidate());
        this.ajax(this.listMessTitle);
      },

      getFormValidate () {
        return this.formDate(this.$util._.defaultsDeep({}, this.formValidate), ['courseBeginTime', 'courseEndTime'], 'yyyy-MM-dd');
      },

      //搜索监听回调
      searchEvent (isLoading) {
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
      handleSubmit (name) {
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

      /*--点击--批量审核--按钮--*/
      batchAudit () {
        if (!this.isSelected()) return;
        let multipleSelection = this.multipleSelection;
        let ids = multipleSelection.reduce((arr, item) => {
          arr.push(item.arrangeId)
          return arr
        }, [])
        this.auditData = {ids: ids.join(',')};
        this.openModel('batchAudit');
      },

      /*--点击--审核--按钮--*/
      audit (rowData) {
        this.auditData = rowData;
        this.openModel('audit');
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
        this.refresh()
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },

      //刷新父级列表页面
      refresh () {
        this.$emit('audit');
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
          this.setTableDynHeight()
        })
      },

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      //当前组件引入的子组件
      batch, audit
    }
  }
</script>
