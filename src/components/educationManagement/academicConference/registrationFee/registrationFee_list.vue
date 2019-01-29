<!----------------------------------
****--@name     费用登记
****--@role     ${*}
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="conten">
    <el-row>
      <el-form :inline="true">
        <!--<el-col :span="5">-->
          <!--<el-form-item>-->
            <!--<el-button type="info" @click="add">添加</el-button>-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
            <!--<el-button type="danger" @click="remove">删除</el-button>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="19" align="right">-->
        <el-col align="right">
          <el-form-item label="会议名称：" prop="name">
            <el-input v-model="searchObj.name"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="searchObj.status" placeholder="请选择">
              <el-option v-for="(item,index) in statusOption" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="search">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 表格 -->
    <div ref="table">
      <el-table align="center" :context="self" :height="dynamicHt" :data="tableData" tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column label="序号" prop="index" width="70"></el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="info" @click="edit(scope.row)" :disabled="scope.row.status !== 'AUDIT_SUCCESS'">
              <!--{{ scope.row.travelFee == null && scope.row.hotelFee == null ? '登记' : '修改' }}-->
              登记
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="applicantName" show-overflow-tooltip></el-table-column>
        <el-table-column label="职称" prop="jobTitle" show-overflow-tooltip></el-table-column>
        <el-table-column label="会议名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="科室名称" prop="hosdeptName" show-overflow-tooltip></el-table-column>
        <el-table-column label="会议地点" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="会议开始时间" prop="startTime" show-overflow-tooltip></el-table-column>
        <!--<el-table-column label="会议结束时间" prop="endTime" show-overflow-tooltip></el-table-column>-->
        <el-table-column label="状态" prop="status" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.status | typeText }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页按钮 -->
      <div style="float: right;margin-top:10px;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </div>

    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <edit v-if="addModal" @cancel="cancel" @add="subCallback"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" class-name="vertical-center-modal" :loading="true"
           :width="800">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import api from '../MeetingReportWrite/api';
  /*当前组件必要引入*/
  import statusOption from '../MeetingReportWrite/statusOption';
  import edit from './registrationFee_edit.vue';
  import show from './registrationFee_view.vue';

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        statusOption,
        deleteUrl: api.delete,
        reportedUrl: api.submit,
        searchObj: {
          name: '', // 会议名称
          status: '', // 状态
        },

        //* 表格 *//
        self: this,
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        operailityData: '',
        multipleSelection: '', // 选项
        tableData: [], // 表格数据

        reportedModal: false,
        /*--按钮button--*/
        button: {
          addId: {
            id: 'addId',
            title: '会议费用登记'
          },
          showId: {
            id: 'showId',
            title: '查看会议费用'
          },
          editId: {
            id: 'editId',
            title: '会议费用登记'
          },
          removeId: {
            id: 'removeId',
            title: '删除会议费用记录'
          },
          reportedId: {id: 'reportedId', title: '上报'},
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
      /************************** 表格 ************************/
      /*
   * checkbox 选择后触发事件
   * @param val Array 存在所有的选择每一个行数据
   */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
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
        this.tableData = this.addIndex(res.data || []);
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.conten.parentNode.offsetHeight;
        let tableTop = this.$refs.table.offsetTop;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableTop - paginationHt;
      },
      /*
      * 列表数据只能选择一个
      * @param isOnly true  是否只选择一个
      */
      isSelected(isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess("请选择数据!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能选择一条数据!")
          flag = false;
        }
        return flag;
      },
      /************************ 操作***************************/
      // 添加
      add() {
        this.operailityData = null;
        this.openModel('add')
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      // 修改
      edit(row) {
        this.operailityData = row;
        this.openModel('edit')
      },
      // 搜索
      search() {
        this.setTableData();
      },
      // 删除
      remove() {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove')
        }
      },
      // 上报
      reported(row){
        this.operailityData = row;
        this.openModel('reported')
      },
      // 上报操作
      reportedCall(){
        let opt = {
          ajaxSuccess: res => this.subCallback('reported','上报成功'),
          ajaxError: ()=> this.errorMess('上报失败'),
          ajaxParams:{
            url: api.submit.path,
            method: api.submit.method,
            data:{
              id:this.operailityData.id
            }
          }
        };
        this.ajax(opt)
      },
      /********************** 模态窗操作 ************************/
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      /*
     * 打开指定的模态窗体
     * @param options string 当前指定的模态:"add"、"edit"
     * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      // 操作回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
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
      edit,
      show
    }
  }
</script>
