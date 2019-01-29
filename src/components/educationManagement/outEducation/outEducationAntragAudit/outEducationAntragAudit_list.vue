<!----------------------------------
****--@name     外出进修申请审核
****--@role     科主任、教育处、分管院长
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="content">
    <el-row>
      <el-form :inline="true">
        <el-col :span="4">&nbsp;
          <!--<el-button :disabled="disabled.pass" type="primary" @click="pass">批量通过</el-button>-->
          <!--<el-button :disabled="disabled.pass" type="danger" @click="reject">批量驳回</el-button>-->
        </el-col>
        <el-col :span="20" align="right">
          <!--<el-col>-->
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
            <el-select v-model="searchObj.status" placeholder="请选择">
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
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
            <!-- 上报才可审核 -->
            <el-button size="small" type="warning" @click="add(scope.row)" :disabled="!scope.row.hasSp">审核</el-button>
            <!-- 审核通过才可进行费用报销审核 -->
            <!--<el-button size="small" type="danger" @click="edit(scope.row)" :disabled="['6'].indexOf(scope.row.status) === -1">费用报销</el-button>-->
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="userName" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="手机号" prop="mobile" show-overflow-tooltip></el-table-column>
        <el-table-column label="专业技术职称" prop="titles" show-overflow-tooltip></el-table-column>
        <el-table-column label="进修科目" prop="deptName" show-overflow-tooltip></el-table-column>
        <el-table-column label="进修时间" prop="startTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="status" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.status | typeText }}
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
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="940">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <!--<edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>-->
      <div>
        <div class="remove">确认费用已报销？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <el-button @click="editCall" type="primary">确认</el-button>
            <el-button class="but-col" @click="cancel('edit')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :loading="true"
           :width="940">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>

    <!--批量通过-->
    <Modal
      width="500"
      v-model="passModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="button.passId"></modal-header>
      <operate v-if="passModal" :type="'pass'" :operate-url="auditUrl" :methods="'post'" :operateData="passData"
               @cancel="cancel" @operate="subCallback" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>

    <!--批量驳回-->
    <Modal
      width="500"
      v-model="rejectModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="button.rejectId"></modal-header>
      <operate v-if="rejectModal" :type="'reject'" :operate-url="auditUrl" :operateData="rejectData" :methods="'post'"
               @cancel="cancel" @operate="subCallback" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../outEducationAntragWrite/api';
  import add from './outEducationAntragAudit_add.vue';
  //  import edit from './outEducationAntragAudit_edit.vue';
  import show from '../outEducationAntragWrite/outEducationAntragWrite_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        url: api,
        deleteUrl: api.delete,
        auditUrl: api.audit.path,
        deptOptions: [],
        statusOptions: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 'NOT_AUDIT',
            label: '待审核',
          },
          {
            value: 'AUDIT_FAILURE',
            label: '未通过',
          },
          {
            value: 'AUDIT_SUCCESS',
            label: '通过',
          },
        ],
        disabled: {pass: false,},

        passData: {
          data: {status: '3'}
        },
        rejectData: {
          data: {status: '2'}
        },
        //* 表格 *//
        self: this,
        totalCount: 0,
        loading: false,
        passModal: false,
        rejectModal: false,
        dynamicHt: 100, // 表格高度
        operailityData: '',
        multipleSelection: '', // 选项
        tableData: [], // 表格数据
        reportedModal: false,
        // 搜索
        searchObj: {
          deptId: '', // 进修科目id
          deptName: '', // 进修科目名称
          status: '', // 状态
          reportStatus:'',//汇报状态
        },
        //* 按钮 *//
        button: {
          addId: {id: 'addId', title: '审核外出进修申请'},
          showId: {id: 'showId', title: '查看外出进修申请'},
          editId: {id: 'editId', title: '外出进修申请费用报销'},
          passId: {id: 'passId', title: '通过'},
          rejectId: {id: 'rejectId', title: '驳回'},
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
          url: api.list.path,
          method: api.list.method,
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
        let disabled = {pass: false,}

        for (let i = 0; i < val.length; i++) {
          let item = val[i];
          if (['2', '3'].includes(item.status + '')) {
            disabled.pass = true
          }
        }
        this.disabled = disabled;
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
        this.openModel('edit');
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show');
      },

      /*--点击--批量通过--按钮--*/
      pass() {
        if (!this.isSelected()) return;
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          let item = this.multipleSelection[i];
          ids.push(item.id);

        }
        this.operailityData = [];
        this.passData.data.ids = ids.join(',');
        this.openModel('pass');
      },


      reject() {
        if (!this.isSelected()) return;
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          let item = this.multipleSelection[i];
          ids.push(item.id);

        }
        this.operailityData = [];
        this.rejectData.data.ids = ids.join(',');
        this.openModel('reject');
      },

      // 费用报销
      editCall() {
        let opt = {
          ajaxSuccess: res => this.subCallback('edit', '费用报销成功'),
          ajaxError: () => this.errorMess('费用报销失败'),
          ajaxParams: {
            url: api.audit.path,
            method: api.audit.method,
            data: {
              ids: this.operailityData.id,
              status: '8'
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
      add,
//      edit,
      show,
    }
  }
</script>
