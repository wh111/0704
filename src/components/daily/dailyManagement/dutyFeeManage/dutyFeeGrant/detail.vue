<!--
****--@file     detail
****--@date     2018/1/19 16:25
****--@author   wh
****--@describe   值班费发放详情
-->
<template>
  <div class="dutyFeeDetail-root modal" id="content" ref="content">
    <el-button @click="exportExcel">{{ 'export' | sysLan}}</el-button>
    <div style="float: right">
      <el-form ref="formValidate" :inline="true" label-width="90px">
        <el-form-item label="姓名" prop="diseaseName">
          <el-input v-model="formValidate.userName" placeholder="姓名">
            <el-button @click="search" slot="append" icon="search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <!--<el-input placeholder="姓名" v-model="formValidate.userName" style="width: 300px"></el-input>-->
      <!--<el-button @click="search" class="btn1">搜索</el-button>-->
    </div>
    <div style="margin-top: 20px">
      <div
        id="myTable"
        ref="myTable">
        <el-table
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="LastTableData"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%"
          border>
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
            align="center">
            <template scope="scope">
              <el-button size="small" type="info" @click="show(scope.row)">{{ 'view' | sysLan}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="姓名"
            align="center">
          </el-table-column>
          <el-table-column
            label="电话"
            prop="mobile"
            align="center">
          </el-table-column>
          <el-table-column
            v-if="activeName!='gwbt'"
            label="次数"
            prop="count"
            align="center">
          </el-table-column>
          <el-table-column
            label="应发金额"

            prop="money"
            align="center">

          </el-table-column>
          <el-table-column
            label="开户行"
            prop="bankAddress"
            align="center">
          </el-table-column>
          <el-table-column
            label="账号"
            prop="bankNumber"
            align="center">
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
      <modal-header slot="header" :content="view1Id"></modal-header>
      <show v-if="showModal" :activeName="activeName" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="值班费标题"
           class-name="duty-fee-modal"
           :width="500">
      <modal-header slot="header" :content="content"></modal-header>
      <derive v-if="deriveModal" type="derive" messTitle="确定要导出值班费发放表吗？" :url="url"
              @cancel="deriveModal = false"></derive>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>

<style lang="scss">
  .dutyFeeDetail-root {
    .btn1 {
      color: #fff;
      background-color: #13ce66;
      border-color: #13ce66;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import show from './seedetailModal.vue'
  import api from './api'

  let Util = null
  export default {
    props: ['activeName'],
    data() {
      return {
        self: this,
        LastTableData: [],
        dynamicHt: 400,
        showModal: false,
        formValidate: {
          sortby: "",
          order: '',
          type: '',
          userName: ''
        },
        totalCount: 0,
        name: '',
        operailityData: '',
        loading: false,
        view1Id: {id: 'viewId', title: '查看'},
        //导出
        deriveData: {
          url: '',
          type: ''
        },
        deriveModal: false,
        content: {
          id: 'deriveFeeIssueId',
          title: '值班费发放表'
        },
        url: '',

      }
    },
    methods: {
      //导出表
      exportExcel() {
        this.url = api.exportExcel.path + '?type=' + this.activeName + '&userName=' + this.formValidate.userName
        this.deriveModal = true
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.parentNode.parentNode.parentNode.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 100;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
        // console.log( this.dynamicHt)
      },
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      //初始化请求列表数据
      init() {
        this.formValidate.type = this.activeName;
        Util = this.$util;
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          url: api.pagelist.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          },
        }
        this.setListData();
      },
      setListData(isLoading) {
        this.queryQptions.params = Object.assign(this.queryQptions.params, this.formValidate);
        this.ajax({
          ajaxSuccess: this.listDataSuccess,
          ajaxParams: this.queryQptions,
        }, isLoading)

      },
      listDataSuccess(res) {//获取值班费列表
        //  console.log(res.data)
        this.LastTableData = this.addIndex(res.data);
        this.totalCount = res.totalCount;
      },
      search() {
        this.setListData();

      },
      show(m) {
        this.operailityData = m.userId;
        this.openModel("show");
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
