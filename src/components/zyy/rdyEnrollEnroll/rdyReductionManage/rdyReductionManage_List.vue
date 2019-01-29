<!--
****--@file     rdyReductionManageList
****--@date     2018/8/28 10:24
****--@author   ${王恒}
****--@describe   住院医审核
-->
<template>
  <div ref="content">
    <el-form :inline="true">
      <el-row>
        <el-col align="right">
          <el-form-item label="姓名：">
            <el-input v-model="searchObj.userName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="setTableData()">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 顶部按钮 -->
    <!--<div>-->
    <!--<el-button type="primary" @click="add">短信通知</el-button>-->
    <!--</div>-->
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center"  :height="tabHeight" :context="self" :data="tableData"
                tooltip-effect="dark" style="width: 100%">
        <el-table-column label="操作" align="center" width="140">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row,'show')">查看</el-button>
            <el-button size="small" type="success" @click="show(scope.row,'break')"
                       :disabled="scope.row.state == 'PASS'">
              审核
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="school" label="学校" show-overflow-tooltip></el-table-column>
        <el-table-column prop="birth" label="出生年月" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="trainingBase" label="培训基地" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="underGraduateSchool" label="拟进入培训专业" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="state" label="状态" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.state | rdyReductionManageState}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :parent="self" :content="headerContent.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :info="info" :type="type" showType="MANAGE"></show>
      <div slot="footer"></div>
    </Modal>

    <!--&lt;!&ndash;查看弹窗&ndash;&gt;-->
    <!--<Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="1000">-->
    <!--<modal-header slot="header" :parent="self" :content="headerContent.editId"></modal-header>-->
    <!--<edit v-if="editModal" @edit="subCallback" @cancel="cancel" :operaility-data="operailityData"></edit>-->
    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <!--&lt;!&ndash;短信通知弹窗&ndash;&gt;-->
    <!--<Modal :mask-closable="false" height="200" v-model="shortNoteModal" class-name="vertical-center-modal" :width="800">-->
    <!--<modal-header slot="header" :content="headerContent.shortNoteId"></modal-header>-->
    <!--<short-note v-if="shortNoteModal" @shortNote="subCallback" @cancel="cancel"-->
    <!--:operaility-data="operailityData" :content="shortNoteContent"></short-note>-->
    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
  </div>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null
  import api from './api'
  import show from '../rdyReductionApply/rdyReductionApply_edit.vue'

  export default {
    data () {
      return {
        api,
        searchObj: {
          userName: '',
        },
        totalCount:0,
        tableData: [],
        info: {},
        type: '',
        tabHeight: 0,
        self:this,
        headerContent: {
          showId: {
            id: 'show',
            title: '详情'
          },
        }
      }
    },
    methods: {
      //初始化请求列表数据
      //初始化请求列表数据
      init () {
        Util = this.$util
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          },
        }

        this.setTableData()
      },
      cancel(targer) {
        this[targer + 'Modal'] = false;
        this.setTableData()
      },
      setTableData (isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj)
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions,
        }, isLoading)
      },
      listDataSuccess (res) {
//        res.data.map((item)=>{
//          item.cutsDetail.testTime=item.cutsDetail.testTime|| this.conductDate(new Date(),'yyyy-MM-dd')
//        })
        this.tableData = res.data
        this.totalCount =res.totalCount;
      },
      show (res, type) {
        let {applyState,expertsState,spState}=res.cutsDetail;
        this.info = res
        this.info.applyState=applyState;
        this.info.expertsState=expertsState;
        this.info.spState=spState;
        this.type = type
        this.showModal = true
      },
      //设置表格及分页的位置
      //设置表格及分页的位置
      setTableDynHeight () {
        let contenHeight = this.$refs.content.parentNode.offsetHeight;
        let tableData = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
        this.tabHeight = this.dynamicHt;
      },

    },
    created () {
      this.init()
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
    components: {show},
  }

</script>
<style lang="scss">

</style>
