<!----------------------------------
****--@name     大病历查询
****--@role     ${*}
****--@date     2018/11/21
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" :model="formValidate" :rules="largeCaseWriteList" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <!--搜索项-->
        <el-col :span="24" align="right">
          <el-form-item label="学员姓名:" prop="ccreateUserName">
            <el-input v-model="formValidate.ccreateUserName" placeholder="输入学员姓名搜索">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>

      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore" align="right">
        <el-form-item label="生源类型:">
          <el-select v-model="formValidate.podClass" placeholder="请选择生源类型">
            <selectOption type="getByCode" isCode="true" id="code" codeType="SYS_USER_TYPE"></selectOption>
          </el-select>
        </el-form-item>
        <!--UE上未体现-->
        <el-form-item label="创建时间:" prop="cCreateBegin">
          <el-date-picker
            v-model="formValidate.cCreateBegin"
            type="month"
            :editable="false"
            :clearable="false"
            style="width:130px"
            placeholder="选择日期"
            :picker-options="pickerOptions0"
            @change="handleStartTime">
          </el-date-picker>
          -
          <el-date-picker
            v-model="formValidate.cCreateEnd"
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
        <el-form-item label="科室：">
          <el-select v-model="formValidate.depId" clearable filterable placeholder="请选择">
            <select-option :url="url.getByDepth.path+'?depth=3'" type="userRotaryDeptlist"></select-option>
          </el-select>
        </el-form-item>
        <el-button type="info" @click="searchEvent">查询</el-button>
      </div>
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
            width="100">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="createUserName"
            label="学员姓名">
          </el-table-column>
          <el-table-column
            align="center"
            prop="cname"
            label="病人姓名">
          </el-table-column>
          <el-table-column
            align="center"
            prop="depName"
            label="科室">
          </el-table-column>

          <el-table-column
            prop="czyNo"
            label="住院号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="cbedNo"
            label="床号">
          </el-table-column>
          <el-table-column
            prop="cstate"
            label="审核状态">
            <template scope="scope">
              {{scope.row.cstate | typeText}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
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
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>

    <!--查看弹窗-->
    <Modal
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
  import { largeCaseWriteList } from '../../rotateRecordAudit/rules'
  /*当前组件必要引入*/
  import url from '../../rotateRecordAudit/api'
  //引入--查看--组件
  import show from '../../rotateRecordWrite/largeCaseWrite/largeCaseWrite_view.vue'  //引入的是大病历填写的查看
  //当前组件引入全局的util
  let Util = null
  export default {
    data () {
      return {
        largeCaseWriteList,
        url: url,
        //查询表单
        listUrl: '/role/list?name=&identify=&type=',
        deleteUrl: '/role/remove',
        formValidate: {
          ccreateUserName: '',       //学员姓名
          podClass: '',       //姓名
          cCreateBegin: new Date(),      //开始时间
          cCreateEnd: new Date(),      //结束时间
          czyNo: '',      //住院号
          depId: '',       //科室ID(下拉选择)
        },

        passData: {
          data: {diseaseIds: ''}
        },

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [
//          {
//            "cid":12,
//            "cname":"111",
//            "depName":"科室",
//            "createUserName":"创建人",
//            "czyNo":"123123",
//            "cbedNo":"111",
//            "createTime":"2017-05-08",
//            "cstate":"NO_SUBMIT",
//            "ctype":"类型"
//          }
        ],
        loading: false,
        auditModal: false,
        passModal: false,
        reportedModal: false,
        rejectModal: false,
        postilModal: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.caseRecordManagePagelist,
            params: {}
          }
        },
        searchMore: false,
        /*--按钮button--*/
        addId: {id: 'addId', title: '新建'},
        editId: {id: 'editId', title: '修改'},
        auditId: {id: 'auditId', title: '审核'},
        viewId: {id: 'viewId', title: '查看'},
        passId: {id: 'passId', title: '通过'},
        reportedId: {id: 'reportedId', title: '上报'},
        rejectId: {id: 'rejectId', title: '驳回'},
        postilId: {id: 'postilId', title: '大病历批注'},
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams
        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
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
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.getFormValidate())
        this.ajax(this.listMessTitle)
      },
      //获取格式化的数据
      getFormValidate () {
        return this.formDate(this.$util._.defaultsDeep({}, this.formValidate), ['cCreateBegin', 'cCreateEnd'], 'yyyy-MM')
      },

      //搜索监听回调
      searchEvent (isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate')
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
            flag = true
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
        return flag
      },

      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show (data) {
        this.operailityData = data
        this.openModel('show')
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

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
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
      show,
    }
  }
</script>
