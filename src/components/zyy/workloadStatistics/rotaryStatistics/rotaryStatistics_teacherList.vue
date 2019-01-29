<!----------------------------------
****--轮转统计（科室查询）
****--@date     2017/7/21
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form :model="formValidate" ref="formValidate" inline label-width="100px"
             class="demo-ruleForm">
      <el-row>
        <!--搜索项-->
        <el-col :span="24" align="right">
          <el-form-item label="科室:">
            <el-select filterable v-model="formValidate.depId"
                       placeholder="请选择">
              <select-option type="byUserType"></select-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年份:" prop="rotaryYear">
            <el-date-picker
              v-model="formValidate.year"
              align="right"
              type="year"
              :clearable="false"
              :editable="false"
              placeholder="选择年份">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="月份:" prop="rotaryYear">
            <el-date-picker
              v-model="formValidate.month"
              align="right"
              type="month"
              format="MM月"
              :clearable="false"
              :editable="false"
              placeholder="选择月份">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="上下半月:" prop="state">
            <el-select filterable v-model="formValidate.monthPart"
                       placeholder="请选择">
              <el-option label="上半月" value="0"></el-option>
              <el-option label="下半月" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
        </el-col>
      </el-row>
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
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%">
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
            align="center"
            prop="teacherUserName"
            label="老师姓名"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="depName"
            label="科室"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="zyyUserNum"
            label="带教住院医人数"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="yjsUserNum"
            label="带教研究生人数"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="sxsUserNum"
            label="带教实习生人数"
            show-overflow-tooltip>
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="allUserNum"-->
          <!--show-overflow-tooltip-->
          <!--label="总带教人数"-->
          <!--align="center">-->
          <!--</el-table-column>-->
          <el-table-column
            prop="nowUserNum"
            show-overflow-tooltip
            label="当前带教人数"
            align="center">
          </el-table-column>
          <el-table-column
            prop="maxScore"
            show-overflow-tooltip
            label="最高评分"
            align="center">
          </el-table-column>
          <el-table-column
            prop="minScore"
            show-overflow-tooltip
            label="最低评分"
            align="center">
          </el-table-column>
          <el-table-column
            prop="averageScore"
            show-overflow-tooltip
            label="平均评分"
            align="center">
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="isMentor"-->
          <!--show-overflow-tooltip-->
          <!--label="是否是导师"-->
          <!--align="center">-->
          <!--<template scope="scope">-->
          <!--{{scope.row.isMentor != null ? scope.row.isMentor ? '是' : '否' :-->
          <!--''}}-->
          <!--</template>-->
          <!--</el-table-column>-->
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
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../api'
  //引入--新建--组件
  //当前组件引入全局的util
  let Util = null
  export default {
    data () {
      return {
        url: url,
        //搜索项
        searchMore: false,
        disEnableModal: false,
        enableModal: false,
        toChannelModal: false,
        //查询表单
        formValidate: {
          depId: '',//科室ID
          year: new Date(),  //年
          month: new Date(), //月
          monthPart: '0', //上下半月
        },
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        tableData: [],
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.rotaryTeachStatistics.path,
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

      //通过get请求列表数据
      updateListData (responseData) {
        if (!responseData.data) return
        this.tableData = this.addIndex(responseData.data)
        this.totalCount = responseData.totalCount || 0
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(
          this.listMessTitle.ajaxParams.params, this.queryQptions,
          this.getFormValidate())
        this.ajax(this.listMessTitle)
      },
      getFormValidate () {
        let formValidate = this.formDate(
          this.$util._.defaultsDeep({}, this.formValidate), ['year'], 'yyyy')
        return this.formDate(formValidate, ['month'], 'MM')
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
    components: {},
  }
</script>

