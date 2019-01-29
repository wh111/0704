<!--
****--@file     ptplanAdmit_notice
****--@date     2018/7/31 14:18
****--@author   YC
****--@describe 拟录取-批次列表
-->
<template>
  <div ref="content" class="modal">
    <el-col align="right">
      <el-form :model="formValidate" :inline="true" ref="formValidate">
        <date-group :dateGroup="{text:'',startDate:formValidate.startDate,endDate:formValidate.endDate}"
                    style="display:inline-block;">
          <el-form-item label="通知时间：">
            <el-date-picker name="start" v-model="formValidate.startDate" :editable="false" type="datetime"
                            placeholder="选择起始时间"
                            :picker-options="pickerOptions0"
                            @change="handleStartTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="-">
            <el-date-picker name="end" v-model="formValidate.endDate" :editable="false" type="datetime"
                            placeholder="选择截止时间"
                            :picker-options="pickerOptions1"
                            @change="handleEndTime"></el-date-picker>
            <el-button type="info" @click="setTableData">{{ 'search' | sysLan }}</el-button>
          </el-form-item>
        </date-group>
      </el-form>
    </el-col>
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
        style="width: 100%;height: 100%">
        <!--<el-table-column-->
        <!--type="selection"-->
        <!--width="55">-->
        <!--</el-table-column>-->
        <el-table-column
          align="center"
          label="序号"
          prop="index"
          width="100">
        </el-table-column>
        <el-table-column
          label="操作"
          width="70" align="center">
          <template scope="scope">
            <el-button type="success" size="small" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="通知时间">
          <template scope="scope">
            {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm') }}
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--show-overflow-tooltip-->
          <!--prop="userNames"-->
          <!--label="研究生">-->
        <!--</el-table-column>-->
        <el-table-column
          show-overflow-tooltip
          prop="number"
          label="可录取人数">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="quasiadSize"
          label="已录取人数">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="quasiadNames"
          label="已录取人员">
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="remarks"
          label="备注"
        >
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
</template>
<script>
  /*当前组件必要引入*/
  import api from '../ptOrganizationReexamine_noticeInfo/api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'ptplanAdmitNotice',
    data () {
      return {
        self: this,
        dynamicHt: 0,
        tableData: [],
        totalCount: 0,
        formValidate: {
          startDate: '',
          endDate: ''
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
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        };
        this.setTableData();
      },
      // 获取列表
      setTableData () {
        let {startDate, endDate} = this.formValidate;
        startDate = this.conductDate(startDate, 'yyyy-MM-dd HH:mm:ss');
        endDate = this.conductDate(endDate, 'yyyy-MM-dd HH:mm:ss');
        let params = Object.assign({}, this.queryQptions, {startDate, endDate});
        let opt = {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.listPage.path,
            method: api.listPage.method,
            params
          }
        };
        this.ajax(opt);
      },
      //通过get请求列表数据
      updateListData (res) {
        this.tableData = res.data instanceof Array ? this.addIndex(res.data) : [];
        this.totalCount = res.totalCount || 0;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 90;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },
      // 查看此批次的通知
      show (obj) {
        this.$emit('show', 'info', obj);
      }
    },
    created () {
      this.init();
    },
    activated () {
      this.setTableData();
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
    components: {}
  };

</script>
