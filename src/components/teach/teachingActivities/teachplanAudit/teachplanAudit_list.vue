<!--
****--@file     teachplanAudit_list
****--@date     2018-12-07 15:45
****--@author   YC
****--@describe 教学活动审核
-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10">
          <el-button @click="batchAudit" :disabled="disabled.batchAudit"
                     type="primary">批量审核
          </el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14" align="right">
          <el-form-item label="计划年份:" prop="userType">
            <el-date-picker
              v-model="formValidate.activityPlanYear"
              align="right"
              type="year"
              :editable="false"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <el-button @click="searchEvent" icon="search"></el-button>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'"
                     @click="showSearchMore ">高级查询
          </el-button>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-show="searchMore" ref="searchMore">
        <el-form-item label="计划月份:" prop="userType">
          <el-date-picker
            v-model="formValidate.activityPlanMonth"
            align="right"
            format="MM"
            type="month"
            :editable="false"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="科室:" prop="userType">
          <el-select v-model="formValidate.activityPlanDepId" placeholder="科室">
            <select-option :type="'dep'"></select-option>
          </el-select>
        </el-form-item>
        <el-button type="info" @click="searchEvent">查询</el-button>

      </div>
    </el-form>
    <br/>
    <!--表格数据操作按钮-->
    <div>
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          stripe
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData1"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="75">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template scope="scope">
              <el-button size="small"
                         :disabled="!['NO_PASS'].includes(scope.row.activityPlanState)"
                         @click="audit(scope.row)">审核
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="activityPlanYear"
            show-overflow-tooltip
            label="计划对应年份">
          </el-table-column>
          <el-table-column
            v-if="podClass!=='ZYY'"
            prop="activityPlanMonth"
            label="计划对应月份"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="activityPlanDepName"
            label="计划科室名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="activityDetailCount"
            label="计划数量"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="activityPlanState"
            label="计划状态"
            show-overflow-tooltip>
            <template scope="scope">
              {{scope.row.activityPlanState | typeText}}
            </template>
          </el-table-column>

        </el-table>
      </div>
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
    </div>
    <!---->
    <!--审核-->
    <Modal
      :mask-closable="false"
      v-model="auditModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="true"
      :width="800">
      <modal-header slot="header" :parent="self"
                    :content="auditId"></modal-header>
      <audit v-if="auditModal" :podClass="podClass" @cancel="cancel" :url="api"
             @audit="subCallback"
             :operaility-data="operailityData"></audit>
      <div slot="footer"></div>
    </Modal>
    <!--批量审核-->
    <Modal
      :mask-closable="false"
      v-model="batchAuditModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="true"
      :width="800">
      <modal-header slot="header" :parent="self"
                    :content="batchAuditId"></modal-header>
      <audit type="batchAudit" v-if="batchAuditModal" @cancel="cancel"
             :url="api"
             @batchAudit="subCallback"
             :operaility-data="operailityData"></audit>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>

<script>
  /*当前组件必要引入*/
  //引入--微调--组件
  import audit from './teachplanAudit_audit'
  import api from './api.js'
  //当前组件引入全局的util
  let Util = null
  export default {
    props: ['podClass'],
    data () {
      return {
        searchMore: false, // 默认不展示高级选项
        api,
        //查询表单
        noRotationUrl: '',  // 无需安排轮转url
        //form表单bind数据
        formValidate: {
          activityPlanYear: '',
          activityPlanMonth: '',
          activityPlanDepId: '',
          sortby: '',
          order: '',
          activityPlanState: 'NO_PASS',
        },
        /*--按钮button--*/
        auditId: {
          id: 'auditId',
          title: '审核',
        },
        batchAuditId: {
          id: 'batchAuditId',
          title: '批量审核',
        },
        noRotationData: {
          data: {
            podIds: '',
          },
        },

        //安排轮转
        rotationModal: false,
        batchAuditModal: false,
        auditModal: false,
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [],
        loading: false,
        listTotal: 0,
        disabled: {
          noRotation: false,
          batchAudit: false,
        },
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.teachplanAudit.path,
            params: {},
          },
        },

      }

    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams

        this.queryQptions = {
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize},
        }

        this.setTableData()
      },

      //搜索监听回调
      searchEvent (isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate')
        if (isSubmit) {
          this.setTableData()
        }
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content
        let parHt = content.parentNode.offsetHeight
        let myTable = this.$refs.myTable
        let paginationHt = 50
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        let disabled = {
          noRotation: false,
          batchAudit: false,
        }
        val.map(item => {
          if (!['NO_PASS'].includes(item.activityPlanState)) {
            disabled.batchAudit = true
          }
        })
        this.disabled = disabled
        this.multipleSelection = val
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length
        let flag = true
        if (len == 0) {
          this.showMess('请选择数据!')
          flag = false
        }
        // else {
        //   var sltTs = this.multipleSelection[0].createTime;
        //   for (var i = 0, item; i < this.multipleSelection.length; i++) {
        //     item = this.multipleSelection[i];
        //     if (item.createTime != sltTs) {
        //       this.showMess("请选择相同时间范围的人员一起安排!");
        //       flag = false;
        //       break;
        //     }
        //   }
        // }
        return flag
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data
        this.tableData1 = []
        data = this.addIndex(data)
        this.tableData1 = data
        this.listTotal = responseData.totalCount || 0
      },

      setTableData () {
        let formValidate = this.$util._.defaultsDeep({}, this.formValidate)
        formValidate.activityPlanYear = this.conductDate(
          formValidate.activityPlanYear, 'yyyy')
        formValidate.activityPlanMonth = this.conductDate(
          formValidate.activityPlanMonth, 'MM')

        this.listMessTitle.ajaxParams.params = Object.assign(
          this.listMessTitle.ajaxParams.params, this.queryQptions.params,
          this.formValidate)
        this.ajax(this.listMessTitle)
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        let flag = false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
        return flag
      },

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },

      /*
       * 点击--审核--按钮
       * @param index string|number  当前行索引
       * */
      audit (rowData) {
        this.operailityData = rowData
        this.openModel('audit')
      },
      //批量审核
      batchAudit () {
        if (!this.isSelected()) return
        let id = this.multipleSelection.reduce((arr, item) => {
          arr.push(item.activityPlanId)
          return arr
        }, []).join(',')
        this.operailityData = {
          activityPlanId: id,
        }
        this.openModel('batchAudit')
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
        this[targer + 'Modal'] = false
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
        this.cancel(target)
        if (title) {
          this.successMess(title)
        }
        if (!updata) {
          //this.formValidate = this.setObjValEmpty(this.formValidate);
          this.setTableData()
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      },

    },
    created () {
      this.init()
    },

    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight()
        //为窗体绑定改变大小事件
        let Event = Util.events
        Event.addHandler(window, 'resize', this.setTableDynHeight)
      })
    },
    components: {
      //当前组件引入的子组件
      audit,
    },

  }
</script>
