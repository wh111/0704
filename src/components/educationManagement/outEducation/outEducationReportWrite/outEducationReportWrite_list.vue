<!----------------------------------
****--@name     外出进修汇报填写
****--@role     所有角色
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="content">
    <el-row>
      <el-form :inline="true">
        <!--<el-col :span="4">-->
        <!--<el-button type="info" @click="add">添加</el-button>-->
        <!--<el-button type="danger" @click="remove">删除</el-button>-->
        <!--</el-col>-->
        <!--<el-col :span="20" align="right">-->
        <el-col>
          <el-form-item label="进修科目：">
            <el-input v-model="searchObj.deptName"></el-input>
            <!--<el-select v-model="searchObj.deptName" placeholder="请选择">-->
            <!--<el-option-->
            <!--v-for="item in deptOptions"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
            <!--</el-option>-->
            <!--</el-select>-->
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="searchObj.reportStatus" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 数据表格 -->
    <div ref="table">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template scope="scope">
            <!-- 申请审核通过才可添加 -->
            <el-button size="small" type="warning" @click="add(scope.row)" v-if="['AUDIT_SUCCESS'].indexOf(scope.row.status)> -1&&!scope.row.reportStatus " >添加</el-button>
            <!-- 汇报草稿|驳回状态才可修改 -->
            <el-button size="small" type="warning" @click="edit(scope.row)" v-else-if="['AUDIT_SUCCESS'].indexOf(scope.row.status)> -1&&scope.row.reportStatus " :disabled="['NOT_SUBMIT','AUDIT_FAILURE'].indexOf(scope.row.reportStatus) === -1">修改</el-button>
            <!-- 填写之后即可查看 -->
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
            <!-- 汇报草稿|驳回状态才可上报 -->
            <el-button size="small" type="danger" @click="reported(scope.row)" :disabled="['NOT_SUBMIT'].indexOf(scope.row.reportStatus) === -1">上报</el-button>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="userName" align="center"></el-table-column>
        <el-table-column label="手机号" prop="mobile" show-overflow-tooltip></el-table-column>
        <el-table-column label="专业技术职称" prop="titles" show-overflow-tooltip></el-table-column>
        <el-table-column label="进修科目" prop="deptName" show-overflow-tooltip></el-table-column>
        <el-table-column label="进修时间" prop="startTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="status" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.reportStatus | typeText }}
          </template>
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
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <oerw-input v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></oerw-input>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <oerw-input v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></oerw-input>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :loading="true"
           :width="800">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--上报弹窗-->
    <Modal :mask-closable="false" v-model="reportedModal" class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="button.reportedId"></modal-header>
      <div>
        <div class="remove">确认上报吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <el-button @click="reportedCall" type="primary">确定</el-button>
            <el-button class="but-col" @click="cancel('reported')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../outEducationAntragWrite/api';
  import statusOptions from '../outEducationAntragWrite/statusOptions';
  import oerwInput from './outEducationReportWrite_input.vue';
  import show from './outEducationReportWrite_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        deleteUrl: api.delete,
        deptOptions: [],
        statusOptions,
        //* 表格 *//
        self: this,
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        operailityData: '',
        multipleSelection: '', // 选项
        tableData: [], // 表格数据
        reportedModal: false,
        // 搜索
        searchObj: {
          deptId: '', // 进修科目id
          deptName: '', // 进修科目名称
          status: 'AUDIT_SUCCESS', // 状态
          reportStatus:'',
        },
        //* 按钮 *//
        button: {
          addId: {id: 'addId', title: '添加外出进修汇报'},
          editId: {id: 'addId', title: '修改外出进修汇报'},
          showId: {id: 'showId', title: '查看外出进修汇报'},
          reportedId: {id: 'reportedId', title: '上报外出进修汇报'},
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init: function () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.listJXS.path,
          method: api.listJXS.method,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.setTableData()
      },

      //*----------- 表格 ------------*//
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
        this.tableData = res.data || [];
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contentHeight = this.$refs.content.parentNode.offsetHeight;
        let tableData = this.$refs.table.offsetTop;
        let paginationHt = 50;
        this.dynamicHt = contentHeight - tableData - paginationHt;
      },
      /*----------- 模态框 -------------*/
      // 搜索
      search() {
        this.setTableData()
      },
      // 增加
      add(row) {
        this.operailityData = row;
        this.openModel('add')
      },
      // 编辑
      edit(row) {
        this.operailityData = row;
        this.openModel('edit')
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show');
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
            data: {
              id: this.operailityData.id,
              type: '1',
            }
          }
        };
        this.ajax(opt)
      },
      // 回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
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
      /*
       * 列表数据选择
       */
      isSelected() {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess("请选择数据!");
          flag = false;
        }
        return flag;
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
      oerwInput,
      show,
    }
  }
</script>
