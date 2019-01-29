<!----------------------------------
****--@name     进修考核汇总
****--@role     进修生、教学秘书、教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="content">
    <!-- 数据表格 -->
    <div ref="table">
      <el-table border align="center" :context="self" :height="dynamicHt" :data="tableData" tooltip-effect="dark"
                style="width: 100%">
        <!--因为获取的详情数据有问题，先隐藏掉-->
        <!--<el-table-column label="操作" align="center" width="140">-->
          <!--<template scope="scope">-->
            <!--<el-button size="small" type="success" @click="show(scope.row)">查看</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="姓名" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="进修科目" prop="courseNames" show-overflow-tooltip></el-table-column>
        <el-table-column label="进修科室" prop="courseDepName" show-overflow-tooltip></el-table-column>
        <el-table-column label="收红包" show-overflow-tooltip align="center">
          <el-table-column prop="redEnvelopeCount" label="次数" align="center">
            <template scope="scope">
              {{ scope.row.redEnvelopeCount || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="redEnvelopeAmount" label="金额" align="center">
            <template scope="scope">
              {{ scope.row.redEnvelopeAmount || '-' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="收受医药回扣" show-overflow-tooltip align="center">
          <el-table-column prop="rebateCount" label="次数" align="center">
            <template scope="scope">
              {{ scope.row.rebateCount || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="rebateAmount" label="金额" align="center">
            <template scope="scope">
              {{ scope.row.rebateAmount || '-' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="对待病人态度" show-overflow-tooltip align="center">
          <el-table-column prop="attitudeTowardPatientGood" label="好" align="center">
            <template scope="scope">
              {{ scope.row.attitudeTowardPatientGood || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="attitudeTowardPatientIn" label="中" align="center">
            <template scope="scope">
              {{ scope.row.attitudeTowardPatientIn || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="attitudeTowardPatientBad" label="差" align="center">
            <template scope="scope">
              {{ scope.row.attitudeTowardPatientBad || '-' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="考核等级" show-overflow-tooltip align="center">
          <el-table-column prop="inspectionLevelOptimal" label="优" align="center">
            <template scope="scope">
              {{ scope.row.inspectionLevelOptimal || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="inspectionLevelGood" label="良" align="center">
            <template scope="scope">
              {{ scope.row.inspectionLevelGood || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="inspectionLevelDiff" label="差" align="center">
            <template scope="scope">
              {{ scope.row.inspectionLevelDiff || '-' }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount"></el-pagination>
    </div>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :loading="true"
           :width="800">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import show from '../educationEvaluationQuery/educationEvaluationQuery_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        //* 表格 *//
        self: this,
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        tableData: [], // 表格数据
        operailityData:'',
        //* 按钮 *//
        button: {
          showId: {
            id: 'showId',
            title: '查看月度工作考核'
          },
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
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.setTableData()
      },

      //*----------- 表格 ------------*//
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.content.parentNode.offsetHeight;
        let table = this.$refs.table.offsetTop;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - table - paginationHt;
      },
      /*----------- 模态框 -------------*/
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show');
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },

      // 搜索
      search() {
        this.setTableData();
      }
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
      show
    }
  }
</script>
