<!----------------------------------
****--@name     奖惩记录登记
****--@role     ${*}
****--@date     2017/11/28
****--@author   gx
----------------------------------->
<!--奖惩记录-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" :inline="true" :model="queryQptions" label-width="90px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10">
          <el-button class="but-col" @click="add" type="success">添加</el-button>
          <el-button class="but-col" @click="remove" :disabled="disabled.remove" type="danger">删除</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14" align="right">
          <el-form-item label="科室:" prop="depId">
            <el-select v-model="formValidate.depId" placeholder="请选择" @change="searchEvent">
              <select-option type="byUserType"></select-option>
            </el-select>

          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>

      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore" style="float:right;">
        <!--<el-form-item label="科室:" prop="depId">-->
          <!--<el-select v-model="formValidate.depId" placeholder="请选择">-->
            <!--<select-option type="byUserType"></select-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="状态:" prop="rewardAndPunishmentStatus">
          <el-select v-model="formValidate.rewardAndPunishmentStatus" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="未上报" value="WSB"></el-option>
            <el-option label="审核中(待审)" value="DSH"></el-option>
            <el-option label="通过" value="TG"></el-option>
            <el-option label="不通过" value="BTG"></el-option>
            <el-option label="驳回修改" value="BH"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发生时间" prop="occurrenceTime">
          <el-date-picker v-model="formValidate.occurrenceTime" type="date" :editable="false" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-button type="info" @click="searchEvent">查询</el-button>
      </div>
    </el-form>

    <div
      id="myTable"
      ref="myTable"
    >
      <el-table
        align="center"
        :height="dynamicHt"
        :context="self"
        :data="tableData"
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          prop="index"
          width="100">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="210">
          <template scope="scope">
            <el-button
              size="small"
              type="info"
              @click="show(scope.row)">查看
            </el-button>
            <el-button
              :disabled="scope.row.rewardAndPunishmentStatus!='WSB'&&scope.row.rewardAndPunishmentStatus!='BTG'&&scope.row.rewardAndPunishmentStatus!='BH'"
              size="small"
              type="warning"
              @click="edit(scope.row)">修改
            </el-button>
            <el-button
              :disabled="scope.row.rewardAndPunishmentStatus!='WSB'&&scope.row.rewardAndPunishmentStatus!='BTG'&&scope.row.rewardAndPunishmentStatus!='BH'"
              size="small"
              type="danger"
              @click="reported(scope.row)">上报
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="depName"
          label="科室"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="rewardAndPunishmentType"
          label="惩奖类型"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.rewardAndPunishmentType==1 ? '惩罚' : '奖励'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="occurrenceTime"
          label="发生时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="userType"
          label="生源类型"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.userType | userType}}
          </template>
        </el-table-column>
        <el-table-column
          prop="rewardAndPunishmentStatus"
          label="状态"
          show-overflow-tooltip>
          <template scope="scope">
            {{converterStatus(scope.row.rewardAndPunishmentStatus)}}
          </template>
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
      <!--新建-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="addModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="addId"></modal-header>
        <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
        <div slot="footer"></div>
      </Modal>
      <!--修改-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="editModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="editId"></modal-header>
        <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
        <div slot="footer"></div>
      </Modal>
      <!--删除弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="removeModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="500">
        <modal-header slot="header" :content="removeId"></modal-header>
        <remove v-if="removeModal" :delete-url="deleteUrl" @remove="subCallback" @cancel="cancel"
                :operaility-data="operailityData"></remove>

        <div slot="footer"></div>
      </Modal>
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
      <!--上报弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="reportedModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="500">
        <modal-header slot="header" :content="reportedId"></modal-header>
        <operate v-if="reportedModal" :type="'reported'" :operateUrl="reportedUrl" @operate="subCallback"
                 @cancel="cancel" :operaility-data="operailityData"></operate>
        <div slot="footer"></div>
      </Modal>
      <!---->

    </div>
  </div>
</template>
<script>
  import show from "./practiceRecords_view.vue";
  import add from "./practiceRecords_add.vue";
  import edit from "./practiceRecords_edit.vue";

  let Util = null;

  export default {
    data() {
      return {
        deleteUrl: 'rewardAndPunishment/remove',
        reportedUrl: 'rewardAndPunishment/modifyStatus',

        formValidate: {
          userName: '',          //学员姓名
          depId: '',             //科室ID
          userType: '',        //生源类型
          rewardAndPunishmentStatus: '',  //奖惩记录状态
          occurrenceTime: '',  //发生时间
        },
        searchMore: false,
        options: [{
          value: '',
          label: '全部'
        }, {
          value: 'wsb',
          label: '未上报'
        }, {
          value: 'dsh',
          label: '待审核'
        }, {
          value: '3',
          label: '通过'
        }, {
          value: '4',
          label: '不通过'
        }],
        disabled: {
          remove: false,
        },
        multipleSelection: [],
        operailityData: '',
        dynamicHt: 100,
        self: this,

        totalCount: 0,
        loading: false,
        tableData: [
          /*   {
               "id":1,
               "userId":"1",
               "userName":"张三",
               "depName":"内科",
               "depId":"2",
               "rewardAndPunishmentType":"0",
               "rewardAndPunishmentDescribe":"测试奖励",
               "occurrenceTime":"2016-01-02",
               "rewardAndPunishmentStatus":"WSB"
             }*/
        ],

        reportedModal: false,

        addId: {id: 'addId', title: '新建'},
        editId: {id: 'editId', title: '修改'},
        removeId: {id: 'removeId', title: '删除'},
        viewId: {id: 'viewId', title: '查看'},
        auditId: {id: 'auditId', title: '审核'},
        reportedId: {id: 'reportedId', title: '上报'},
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: 'rewardAndPunishment/list',
            params: {},
          }

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
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        }

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        let disabled = {remove: false,}
        val.map(item => {
          if (item.rewardAndPunishmentStatus != 'WSB') {
            disabled.remove = true;
          }
        })
        this.disabled = disabled;
        this.multipleSelection = val;
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
          alert(isOnly)
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData) {
        this.totalCount = responseData.totalCount || 0;
        if (!responseData.data) return;
        this.tableData = this.addIndex(responseData.data);
      },
      setTableData() {
        let formValidate = this.formDate(this.getFormData(this.formValidate), ['occurrenceTime'], this.yearMonthData);
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, formValidate);
        this.ajax(this.listMessTitle);
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

      /*--点击--添加--按钮--*/
      add() {
        this.openModel("add");
      },


      /*--点击--修改--按钮--*/
      edit(data) {
        this.operailityData = data;
        this.openModel("edit");
      },


      /*--点击--删除--按钮--*/
      remove() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = data;
        this.openModel("show");
      },

      //审核
      audit(data) {
        this.operailityData = data;
        this.openModel("audit");
      },

      //上报
      reported(data) {
        this.operailityData = data;
        this.openModel("reported");
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
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
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },


      //转换status
      converterStatus(status) {

        switch (status) {
          case 'WSB' :
            status = '未上报';
            break;
          case 'DSH' :
            status = '审核中(待审)';
            break;
          case 'TG' :
            status = '通过';
            break;
          case 'BTG' :
            status = '不通过';
            break;
          case 'BH' :
            status = '驳回修改';
            break;
        }
        return status;
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
      //当前组件引入的子组件
      add, edit, show,
    }

  }
</script>
<style>

  .add-remove {
    margin-bottom: 20px;
  }


</style>
