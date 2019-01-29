<!----------------------------------
****--@name     排班管理
****--@role     ${*}
****--@date     2018/1/19
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" :inline="true" label-width="90px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10">&nbsp;</el-col>
        <!--搜索项-->
        <el-col :span="14" align="right">
          <el-form-item label="姓名" prop="diseaseName">
            <el-input v-model="formValidate.userName" placeholder="姓名">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">{{ 'query_more' | sysLan}}
          </el-button>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore" align="right">
        <el-form-item label="带教月份" prop="teachMonth">
          <el-date-picker v-model="formValidate.teachMonth" type="month" :editable="false" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-button type="info" @click="searchEvent">{{ 'query' | sysLan }}</el-button>
      </div>
    </el-form>
    <!--列表数据-->
    <div>
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
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
          <!--<el-table-column-->
          <!--type="selection"-->
          <!--width="55" :selectable="canSelect">-->
          <!--</el-table-column>-->
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
            width="150">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)" type="info">{{ 'view' | sysLan }}</el-button>
              <el-button size="small" @click="arrange(scope.row)" type="primary">{{ 'arrange' | sysLan }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="userName"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="codeNumber"
            label="编号"
            width="110">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="phoneNumber"
            label="手机号"
            width="135"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="school"
            label="学校名称"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="specialty"
            label="专业"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="grade"
            label="年级"
            width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="depName"
            label="科室"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="beginTime"
            label="入科时间"
            width="125"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="endTime"
            label="出科时间"
            width="125"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ts"
            label="轮转周期"
            width="100"
          >
            <template scope="scope">{{scope.row.ts}}周</template>
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
    <div>

      <!--查看弹窗-->
      <Modal
        :mask-closable="false"
        width="1000"
        v-model="showModal"
        title="查看值班费详情"
        class-name="vertical-center-modal-money"
        :loading="loading">
        <modal-header slot="header" :content="viewId"></modal-header>
        <show v-if="showModal" :url="url" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>

      <!--安排弹窗-->
      <Modal
        :mask-closable="false"
        width="1000"
        v-model="arrangeModal"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="arrangeId"></modal-header>
        <arrange v-if="arrangeModal" :url="url" @cancel="cancel" @arrange="subCallback"
                 :operaility-data="operailityData"></arrange>
        <div slot="footer"></div>
      </Modal>
      <!---->
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--查看--组件
  import arrange from "./workforceManagement_arrange.vue";
  import show from "./workforceManagement_view.vue";
  //引入--上传资料--组件
  import url from './api.js'
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        url,
        //查询表单
        formValidate: {
          teachMonth: '',//带教月份
          userName: '',//用户姓名
        },
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        searchMore: false,
        arrangeModal: false,
        tableData: [],
        //转换暴露状态
        loading: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.queryStudents.path,
            params: {},
          }
        },

        /*--按钮button--*/
        arrangeId: {id: 'arrangeId', title: '安排'},
        viewId: {id: 'viewId', title: '查看'},
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
      updateListData(responseData) {
        this.tableData = this.addIndex(responseData.data);
        this.totalCount = responseData.totalCount || 0;
      },

      setTableData() {
        let formValidate = this.formDate(this.getFormData(this.formValidate), ['teachMonth'], 'yyyy-MM');
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

      /*--点击--安排--按钮--*/
      arrange(data) {
        this.operailityData = data
        this.openModel("arrange");
      },

      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = data;
        this.openModel("show");
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

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },

      getOptionData(data) {
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.arrangeDepState == 'P') {
            data.splice(i, 1);
            i--;
          }
        }
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
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
      arrange, show,
    }
  }
</script>

