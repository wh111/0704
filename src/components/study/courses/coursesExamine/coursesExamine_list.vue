<template>
  <!-- 授课审核 -->
  <div ref="content" class="modal">
    <div class="listUpAreaBox">
      <!-- <div class="listUpArea-menus">
        <div class="add-remove">
          <el-button class="but-col" @click="add" type="info">创建课程</el-button>
          <el-button class="but-col" @click="remove" type="danger">删除授课</el-button>
        </div>
      </div> -->
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          <!--右侧查询-->
          <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px">
            <div class="listUpArea-searchLeft">
              <input class="hidden">
              <el-input placeholder="请输入课程名称" v-model="formValidate.title">
                <div slot="prepend">课程名称</div>
                <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
              </el-input>
            </div>
            <div class="listUpArea-moreSearch">
              <!--<el-button @click="showSearchMore" type="text">高级查询</el-button>-->
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="searchMore" class="listUpAreaMoreSearchBox" ref="searchMore">
      <el-form :inline="true" align="right">
        <el-form-item label="课程名称：">
          <el-input v-model="formValidate.title"></el-input>
        </el-form-item>
        <el-button type="info" @click="search">查询</el-button>
      </el-form>
    </div>
    <div id="myTable" ref="myTable" class="userDataTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="操作" align="center" width="210">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看
            </el-button>
            <el-button size="small" type="danger" @click="add(scope.row)">审核
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="课程名称" align="center" width="200"></el-table-column>
        <el-table-column prop="teacher" label="授课教师" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="课程状态" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.status | courseStatus }}
          </template>
        </el-table-column>
        <el-table-column prop="totalLesson" label="课程包含节数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateTime" label="授课时间" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.start+'--'+scope.row.end }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;" align="right">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
      </el-pagination>
    </div>
    <!--弹窗-->
    <div>
      <!--增加弹窗-->
      <Modal :mask-closable="false" v-model="addModal" class-name="vertical-center-modal" :width="1100">
        <modal-header slot="header" :content="headerContent.addId"></modal-header>
        <add v-if="addModal" @cancel="cancel" @add="subCallback" :operailityData="operailityData"></add>
        <div slot="footer"></div>
      </Modal>
      <!-- 查看弹窗 -->
      <Modal :mask-closable="false" v-model="showModal" class-name="vertical-center-modal" :width="1100">
        <modal-header slot="header" :parent="self" :content="headerContent.showId"></modal-header>
        <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :style="modelStyle"></show>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import api from './api';
  /*当前组件必要引入*/
  //引入--添加--组件
  import add from "./coursesExamine_add";
  //引入--查看--组件
  import show from "./coursesExamine_view";


  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        api,
        formValidate: {
          title: '', // 课程名称
        },
        /*--按钮button--*/
        headerContent: {
          addId: {
            id: 'examineId',
            title: '审核课程'
          },
          showId: {
            id: 'showId',
            title: '查看课程'
          },
        },
        // 弹窗样式
        modelStyle: {
          height: '650px'
        },

        searchMore: false,
        examineModal: false,

        operailityData: [],
        multipleSelection: [],
        dynamicHt: 100,
        tabHeight: 100,
        self: this,
        tableData: [],
        loading: false,
        listTotal: 0,

        //初始化加载页面信息
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.list.path,
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
          //url:this.listUrl,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.setTableData();
      },

      /*************************************** 表格相关 **********************************************/
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
        this.tabHeight = parHt - myTable.offsetTop - paginationHt;
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
          this.showMess("请选择课程!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能选择一条课程!")
          flag = false;
        }
        return flag;
      },


      //通过get请求列表数据并渲染表格数据
      updateListData(responseData) {
        let data = responseData.data;
        this.tableData = [];
        data = this.addIndex(data);
        this.tableData = data;
        this.listTotal = responseData.totalCount || 0;
      },


      //初始化加载列表数据
      setTableData() {
        this.setAjaxParams();
        this.postParamToServer();
      },

      //设置提交的参数
      setAjaxParams() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params,
          this.formValidate);
      },


      //向服务器发送数据
      postParamToServer() {
        let options = Util._.defaultsDeep({}, this.listMessTitle);
        if (this.deptId != "") {
          options["ajaxParams"]["params"]["deptIds"] = this.deptId;
        }
        this.ajax(options);
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit() {
        this.setTableData();
      },

      /************************************** 按钮事件 ************************************************/
      // 添加(审核)
      add(row) {
        this.operailityData = row;
        this.openModel('add');
      },

      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(row) {
        this.operailityData = row;
        this.openModel('show');
      },

      // 搜索
      search() {
        this.setTableData();
      },

      // 高级搜索按钮
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

      /****************************************** 弹窗相关 ********************************************/
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

    //初始化组件
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
      add,
      show,
    }

  }

</script>
