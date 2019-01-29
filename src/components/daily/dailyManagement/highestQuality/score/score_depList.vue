<!--评分-->
<template>
  <div id="nosocomial" ref="nosocomial" class="modal">
    <el-row>
      <el-col align="right">
        <el-form :inline="true" ref="ruleForm">
          <el-form-item prop="userName">
            <el-input v-model="formValidate.userName" placeholder="输入姓名搜索">
              <el-button slot="append" icon="search" @click="search"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div id="nosocomialTable" ref="nosocomialTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="序号" prop="index" width="70"></el-table-column>
        <el-table-column label="操作" align="center" width="140" show-overflow-tooltip>
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看
            </el-button>
            <el-button :disabled="scope.row.status !== 'YPF' || scope.row.score!=null" size="small" type="warning" @click="write(scope.row)">评分
            </el-button>
            <!--<el-button v-else size="small" type="danger" @click="reported(scope.row)">上报-->
            <!--</el-button>-->
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="grade" label="年级" show-overflow-tooltip>
          <template scope="scope">
            <span>{{ scope.row.grade || '——' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="group" label="班级" show-overflow-tooltip>
          <template scope="scope">
            <span>{{ scope.row.group || '——' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="评优项目" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="oneselfScore" label="个人预估" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.oneselfScore ? (scope.row.oneselfScore / 100) : '——' }}
          </template>
        </el-table-column>
        <el-table-column prop="score" label="得分" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.score ? (scope.row.score / 100) : '——' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.status | typeText }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
        </el-pagination>
      </div>
      <div>
        <!--上报弹窗-->
        <Modal close-on-click-modal="false" height="200" v-model="reportedModal" title="对话框标题"
               class-name="vertical-center-modal" :loading="loading" :width="500">
          <modal-header slot="header" :content="reportedId"></modal-header>
          <operate v-if="reportedModal" :type="'reported'" :operateUrl="reportedUrl" @operate="subCallback"
                   @cancel="cancel" :operaility-data="reportedData"></operate>
          <div slot="footer"></div>
        </Modal>

        <!--填写弹窗-->
        <Modal :mask-closable="false" v-model="writeModal" height="200" title="对话框标题" class-name="vertical-center-modal"
               :width="1000">
          <!--<div slot="header"> -->
          <!--</div>-->
          <modal-header slot="header" :content="writeId"></modal-header>
          <write v-if="writeModal" @cancel="cancel('write')" @add="subCallback('write','填写成功')"
                 :operailityData="operailityData" type="noScoreList" :submitBeforeFun="submitBeforeFun"
                 :url="writeUrl"></write>
          <div slot="footer"></div>
        </Modal>

        <!--查看弹窗-->
        <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
               :loading="true" :width="1000">
          <modal-header slot="header" :parent="self" :content="showId"></modal-header>
          <write v-if="showModal" @cancel="cancel('show')" :operailityData="operailityData"
                 type="haveScoreList"></write>
          <div slot="footer"></div>
        </Modal>
        <!---->
      </div>
    </div>
  </div>
</template>

<script>
  /*当前组审核件必要引入*/
  import api from './api';
  //引入--查看--组件
  //  import show from "./score_view.vue";
  //引入--填写--组件
  import write from "../../../../common/myEvaluation/myEvaluation.vue";

  //当前组件引入全局的util
  let Util = null;
  let store = null;
  export default {
    data() {
      return {
        isRoot: true,
        //查询表单
        formValidate: {
          userName: '',
          status: ''
        },

        searchData: {
          title: '提交',
          callParEvent: 'searchEvent'
        },
        /*--按钮button--*/
        writeId: {
          id: 'writeId',
          title: '评分'
        },
        reportedId: {
          id: 'reportedId',
          title: '上报'
        },
        showId: {
          id: 'showId',
          title: '查看'
        },
        //填写
        writeUrl: api.submit.path,

        writeModal: false,
        reportedModal: false,
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 0,
        self: this,
        tableData: [],
        loading: false,
        listTotal: 0,
      }
    },
    methods: {

      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        }

        this.setTableData();
      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let nosocomial = this.$refs.nosocomial;
        let parHt = nosocomial.parentNode.offsetHeight;
        let nosocomialTable = this.$refs.nosocomialTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - nosocomialTable.offsetTop - paginationHt;
      },


      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
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
          this.showMess("只能选择一条数据!")
          flag = false;
        }
        return flag;
      },


      //通过get请求列表数据
      listDataSuccess(res) {
        this.listTotal = res.totalCount || 0;
        this.tableData = this.addIndex(res.data);
      },
      setTableData(isLoading) {
        let opt = {
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: {
            url: api.list.path,
            params: Object.assign(this.queryQptions, this.formValidate)
          }
        };
        this.ajax(opt, isLoading)
      },


      //搜索监听回调
      search() {
        this.setTableData()
      },

      submitBeforeFun(res) {
        let data = res;
        data.oneselfId = this.operailityData.oneselfId;
        return data
      },

      // 上报
      reported(data) {
        this.reportedData = data;
        this.reportedData.id = this.reportedData.sellOneselfId;
        this.openModel('reported')
      },

      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = {
          activityId: data.appraiseActivityId,
          userId: data.userId,
          oneselfId: data.id
        };
        this.openModel('show');
      },

      /* 填写 */
      write(data) {
        this.operailityData = {
          activityId: data.appraiseActivityId,
          userId: data.userId,
          oneselfId: data.id
        };
        this.openModel('write')
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
//      show,
      write
    },
  }

</script>
<style>
  .add-remove {
    margin-bottom: 20px;
  }

  .header {
    height: 30px;
    font-size: 18px;
    color: #ffffff;
  }

</style>
