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
        <el-col :span="24" align="right">
          <el-form-item label="审核状态：">
            <el-select v-model="formValidate.courseArrangeState" placeholder="科室">
              <el-option label="全部" value=""></el-option>
              <el-option label="待审核" value="NO_PASS"></el-option>
              <el-option label="驳回" value="REJECT"></el-option>
              <el-option label="通过" value="PASS"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
          <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
        </el-col>
      </el-row>
    </el-form>
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          align="center"
          :height="500"
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
            show-overflow-tooltip
            align="center"
            prop="courseDep"
            label="科室">
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
            label="课程时间"
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
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--查看--组件
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'url'],
    data() {
      return {
        deriveUrl: '',
        //查询表单
        formValidate: {
          weekSetId: this.operailityData.weekSetId, //周历id
          courseTeachingResearchRoom: this.operailityData.courseTeachingResearchRoom, //科室id
          courseArrangeState: '',
        },
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        loading: false,
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
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //通过get请求列表数据
      updateListData(responseData) {
        this.tableData = this.addIndex(responseData.data || []);
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.getFormValidate());
        this.ajax(this.listMessTitle);
      },

      getFormValidate() {
        return this.formValidate;
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

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      //当前组件引入的子组件
    }
  }
</script>
