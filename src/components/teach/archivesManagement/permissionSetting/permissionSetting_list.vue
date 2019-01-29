<!--权限设置-->
<template>
  <div id="content" ref="content" class="modal">
    <!--列表操作按钮-->
    <div class="listUpAreaBox">
      <div class="listUpArea-menus">
        &nbsp;
      </div>
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          <!--右侧查询-->
          <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px">
            <!--<div class="listUpArea-searchLeft">-->
              <el-input placeholder="请输入角色名称" v-model="formValidate.name">
                <div slot="prepend">角色名称</div>
                <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
              </el-input>
            <!--</div>-->
            <!--<div class="listUpArea-moreSearch">-->
              <!--<el-button @click="showMoreSearch" type="text">高级查询</el-button>-->
            <!--</div>-->
          </el-form>
        </div>
      </div>
    </div>
    <br />
    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div id="myTable" ref="myTable">

        <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" highlight-current-row
          style="width: 100%;height: 100%">
          <el-table-column label="操作" width="160">
            <template scope="scope">
              <el-button size="small" @click="allotJurisdition(scope.row)">权限设置</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="角色名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="identify" label="代码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="remark" label="角色描述" align="center" show-overflow-tooltip>
          </el-table-column>

        </el-table>
      </div>
      <!--分页-->
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--分配权限-->
    <Modal close-on-click-modal="false" width="1000" v-model="allotJurisditionModal" title="对话框标题" class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="allotJurisditionId"></modal-header>
      <allotJurisdition v-if="allotJurisditionModal" @cancel="cancel" @allotJurisdition="subCallback" :show-data="operailityData"></allotJurisdition>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //引入--分配权限--组件
  import allotJurisdition from "./permissionSetting_allotJurisdition.vue";
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        //查询
        formValidate: {
          name: '',
          identify:"",
          type:"",
        },
        radioVal: '',
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        allotJurisditionModal: false,
        loading: false,
        listTotal: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.list.path,
            params: {
//              identify: "",
//              type: ""
            }
          }
        },
        /*--按钮button--*/
        allotJurisditionId: {
          id: 'allotJurisdition',
          title: '分配权限'
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


      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },


      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly) {
        let radioVal = this.radioVal;
        let flag = true;
        if (radioVal == "") {
          this.showMess("请选择数据!");
          flag = false;
        }
        return flag;
      },


      //查询调用方法
      handleSubmit(name) {
        this.setTableData();
      },


      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        // console.log(responseData);
        this.tableData = [];
        data = this.addIndex(data);
        this.tableData = data;
        this.listTotal = responseData.totalCount || 0;
      },


      setTableData() {
        Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params,this.formValidate);
        this.ajax(this.listMessTitle);
      },


      /*--点击--审核--按钮--*/
      allotJurisdition(row) {
        this.operailityData = row;
        this.openModel('allotJurisdition');
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
      allotJurisdition
    }
  }

</script>
