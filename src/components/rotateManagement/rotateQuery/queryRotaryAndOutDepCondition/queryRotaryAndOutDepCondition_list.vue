<!----------------------------------
****--@name    轮转统计情况
****--@role     ${*}
****--@date     2018/11/20
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" :model="formValidate" inline label-width="90px">
      <el-row style="margin-bottom:0">
        <!--<el-col :span="10">-->
        <!--<el-button @click="exportExcel">{{ 'export' | sysLan}}</el-button>-->
        <!--</el-col>-->
        <!--搜索项-->
        <el-col :span="24" align="right">
          <el-form-item label="生源类型:">
            <el-select v-model="formValidate.podClass" placeholder="请选择生源类型">
              <selectOption type="getByCode" isCode="true" id="code" codeType="SYS_USER_TYPE"></selectOption>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="beginTime">
            <el-date-picker
              v-model="formValidate.beginTime"
              type="month"
              :editable="false"
              :clearable="false"
              style="width:130px"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              @change="handleStartTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="formValidate.endTime"
              align="right"
              type="month"
              style="width:130px"
              :editable="false"
              :clearable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions1"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="编号：">
            <el-input placeholder="请输入编号" v-model="formValidate.codeNumber"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input placeholder="请输入姓名" v-model="formValidate.userName"></el-input>
          </el-form-item>
          <el-button type="info" @click="searchEvent">{{ 'query' | sysLan}}</el-button>
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
          border
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
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
            label="编号"
            prop="codeNumber"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="姓名"
            prop="userName"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="轮转科室"
            prop="depName"
            align="center">
          </el-table-column>

          <el-table-column
            label="入科时间"
            prop="beginTime"
            align="center"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="入科状态"
            prop="isRegister"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            label="报道时间"
            prop="registerTime"
            align="center"
            width="140"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="轮转周期（月）"
            prop="ts"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            label="轮转记录完成情况"
            prop="totalActually"
            align="center"
            width="100"
            show-overflow-tooltip>
            <template scope="scope">
              <el-button size="small" type="info" @click="show(scope.row)">{{ scope.row.totalActually || 0}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="出科时间"
            prop="endTime"
            align="center"
            width="140">
          </el-table-column>
          <el-table-column
            label="出科状态"
            prop="graduateAppraisalState"
            align="center"
            width="100"
            show-overflow-tooltip>
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
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" :url="url" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>

    <!-- <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal"
            class-name="duty-fee-modal"
            :width="500">
       <modal-header slot="header" :content="exportExcelId"></modal-header>
       &lt;!&ndash;<derive v-if="deriveModal" type="excel" @excel="deriveModal=false" :url="exportExcelUrl"&ndash;&gt;
       &lt;!&ndash;@cancel="deriveModal = false"></derive>&ndash;&gt;
       <ajaxDerive type="excel" @cancel="deriveModal = false" @excel="deriveModal=false"
                   :url="url.rotationProcessexport.path "
                   :params="hanleFormValidate()"
                   messTitle="确定要导出吗？"
                   @derive="subCallback"></ajaxDerive>
       <div slot="footer"></div>
     </Modal>-->
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../api'
  //引入--查看--组件
  import ajaxDerive from '../../../common/ajax-derive.vue'
  import show from './queryRotaryAndOutDepCondition_view.vue'
  //引入--查看--组件
  //当前组件引入全局的util
  let Util = null
  export default {
    props: ['type'],
    data () {
      return {
        url: url,
        treeBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        exportExcelUrl: '',
        //查询表单
        listUrl: '/role/list?name=&identify=&type=',
        deleteUrl: '/role/remove',
        formValidate: {
          podClass: '',//生源
          beginTime: new Date(),//开始时间
          endTime: new Date(),//结束时间
          codeNumber: '',//编号
          userName: '',//姓名
        },

        defaultDepId: [],
        depOptions: [],
        passData: {
          data: {diseaseIds: ''},
        },

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        loading: false,
        deriveModal: false,
        typeId: {
          id: 'typeId',
          title: '选择部门',
        },
        depObj: {},
        typeModal: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.queryRotaryAndOutDepConditionDtoList.path,
            params: {},
          },
        },
        searchMore: false,
        /*--按钮button--*/
        viewId: {id: 'viewId', title: '查看'},
        exportExcelId: {id: 'exportExcelId', title: '导出'},

      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams
        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize,
        }
        this.setTableData()
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
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!')
          flag = false
        }
        return flag
      },

      //通过get请求列表数据
      updateListData (responseData) {
        if (!responseData.data) return
        this.tableData = this.addIndex(responseData.data)
        this.totalCount = responseData.totalCount
      },

      setTableData () {
        let formValidate = this.formDate(this.$util._.defaultsDeep(this.formValidate), ['beginTime', 'endTime'], 'yyyy-MM')
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions,
          formValidate)
        this.ajax(this.listMessTitle)
      },

      //搜索监听回调
      searchEvent (isLoading) {
        this.setTableData()
        //        isLoading(true);
        // let isSubmit = this.handleSubmit('formValidate');
        // if (isSubmit) {
        //   this.setTableData()
        // }
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        this.init()
        // let flag = false;
        // this.$refs[name].validate((valid) => {
        //   if (valid) {
        //     flag = true;
        //   }
        //   else {
        //     this.$Message.error('表单验证失败!');
        //   }
        // });
        // return flag
      },

      hanleFormValidate () {
        return this.formValidate
        //         this.formDate(this.$util._.defaultsDeep(this.formValidate),
        //          ['teachingBeginTime', 'teachingEndTime'], 'yyyy-MM-dd');
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show (data) {
        this.operailityData = data
        this.openModel('show')
      },

      //导出表
      exportExcel () {
        // this.exportExcelUrl = url.rotationProcessexport.path + '?' +
        //   this.$util.serializeParams(this.hanleFormValidate());
        this.deriveModal = true
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      },

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },

      subCallback (target, title, updata) {
        this.cancel(target)
        if (title) {
          this.successMess(title)
        }
        if (!updata) {
          this.setTableData()
        }
      },

    },

    created () {

    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        this.init()
        //初始表格高度及分页位置
        this.setTableDynHeight()
        //为窗体绑定改变大小事件
        let Event = Util.events
        Event.addHandler(window, 'resize', this.setTableDynHeight)
      })
    },
    components: {
      //当前组件引入的子组件
      show, ajaxDerive
    },
  }
</script>
