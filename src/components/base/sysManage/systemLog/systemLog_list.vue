<!--系统日志-->

<template>
  <div id="content" ref="content" class="modal">
    <el-form :inline="true">
      <el-row>
        <el-col align="right">
          <el-form-item label="操作账号：">
            <el-input placeholder="请输入操作账号" v-model="formValidate.account">
              <el-button @click="handleSubmit('formValidate')" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="showSearchMore" type="text">高级查询</el-button>
          </el-form-item>
        </el-col>
        <div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">
          <el-form-item label="操作人名称:" prop="userName">
            <el-input v-model="formValidate.userName"></el-input>
          </el-form-item>
          <el-form-item label="操作ip:" prop="ip">
            <el-input v-model="formValidate.ip"></el-input>
          </el-form-item>
          <el-form-item label="操作类型:" prop="method">
            <el-select v-model="formValidate.method" placeholder="请选择生源类型">
              <el-option label="全部" value=""></el-option>
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间:" prop="times">
            <el-date-picker
              v-model="formValidate.times"
              type="datetime"
              :editable="false"
              placeholder="选择操作时间" @change="changeDate">
            </el-date-picker>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
        </div>
      </el-row>
    </el-form>

    <div id="myTable" ref="myTable">
      <el-table
        align="center"
        :height="tabHeight"
        :context="self"
        :data="tableData1"
        tooltip-effect="dark"

        @selection-change="handleSelectionChange">
        <el-table-column
          align="center"
          label="序号"
          prop="index"
          width="100">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="userName"
          label="用户名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="userId"
          label="用户ID"
          show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="id"-->
        <!--label="数据id"-->
        <!--align="center"-->
        <!--show-overflow-tooltip>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="account"
          label="登陆账号"
          show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="userName"-->
        <!--label="操作对象"-->
        <!--show-overflow-tooltip>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="times"
          label="操作时间"
          width="190"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.times | formatDate('yyyy-MM-dd HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="操作ip"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="uri"
          label="请求接口"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="method"
          label="请求类型"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="params"
          label="携带参数"
          show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="types"-->
        <!--label="接口类型"-->
        <!--show-overflow-tooltip>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="remark"
          label="备注"
          show-overflow-tooltip>
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

</template>
<script>
  import {systemLog as rules} from '../rules'
  //当前组件引入全局的util
  let Util = null;

  export default {
    data() {
      return {
        rules,
        //查询表单
        searchMore: false,
        formValidate: {
          account: '',
          userName: '',
          ip: '',
          method: '',
          times: ''
        },
        searchData: {title: '提交', callParEvent: 'searchEvent'},
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        tableData1: [],
        loading: false,
        totalCount: 0,
        listMessTitle: {
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: {
            url: '/logs/query',
            params: {}
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
        //console.log(  this.queryQptions);
      },
      //搜索监听回调
      searchEvent(isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData()
        }
      },
      changeDate(val) {
        this.formValidate.times = val
      },
      // 筛选
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          if (this.searchMore) {
            this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight;
          } else {
            this.tabHeight = this.dynamicHt
          }
        })
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.content.parentNode.offsetHeight;
        let tableData = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
        this.tabHeight = this.dynamicHt;
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
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      listDataSuccess(res) {
        let data = res.data;
        this.tableData1 = this.addIndex(data);
        this.totalCount = res.totalCount;
      },
      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign({}, this.listMessTitle.ajaxParams.params, this.formValidate)
        this.ajax(this.listMessTitle)
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        this.setTableData()
      },

      //导出
      derive() {

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
    }


  }
</script>




