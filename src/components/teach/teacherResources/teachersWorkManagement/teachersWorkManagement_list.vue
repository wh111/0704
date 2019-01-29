<!--档案审核-->
<template>
  <div id="content" ref="content" class="modal">
      <div class="listUpAreaBox">
        <div class="listUpArea-menus">
          <div class="add-remove">
            <el-button type="primary" @click="exportData">导出</el-button>
          </div>
        </div>
        <div class="listUpArea-search">
          <div class="listUpArea-searchWrapper">
            <!--右侧查询-->
            <el-form ref="formValidate"  :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px" >
              <div class="listUpArea-searchLeft">
                <el-input placeholder="请输入内容" v-model="formValidate.name">
                  <div slot="prepend">姓名</div>
                  <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
                </el-input>
              </div>
              <div class="listUpArea-moreSearch">
                <el-button @click="showMoreSearch" type="text">高级查询</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox">

      </div>
    <br />
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
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
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
            label="操作"
            width="160">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row.index)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="hosDept"
            label="科室"
            width="120">
          </el-table-column>
          <el-table-column
            prop="hosDept"
            label="轮转记录审核"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="evaluateStu"
            label="评价学生"
            width="120"
          >
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
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--导出-->
    <Modal
      close-on-click-modal="false"
      width="500"
      v-model="exportModal"
      title="导出"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="exportId"></modal-header>
      <!--<ept-work v-if="exportModal" @cancel="cancel" @export="subCallback" :operaility-data="operailityData"></ept-work>-->
      <div>
        <div class="remove">确认导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a href="/api/teach/exportWorks">
              <el-button @click="cancel('export')" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="cancel('export')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!--查看-->
    <Modal
      width="1000"
      v-model="showModal"
      title="查看"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import api from './api';
  /*当前组件必要引入*/
  //引入--导出--组件
//  import eptWork from "./teachersWorkManagement_export.vue";
  //引入--查看--组件
  import show from "./teachersWorkManagement_view.vue";

  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        formValidate: {
          name: '',
        },
        exportModal:false,
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        loading:false,
        listTotal:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
//          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:api.list.path,
            method:api.list.method,
          }
        },
        /*--按钮button--*/
        exportId:{id:'exportId',title:'导出'},
        viewId:{id:'viewId',title:'查看'},

      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          //url:this.listUrl,
          params:{curPage: 1,pageSize: Util.pageInitPrams.pageSize}
        }

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight(){
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
      isSelected(isOnly){
        let len = this.multipleSelection.length;
        let flag = true;
        if(len==0){
          this.showMess("请选择数据!");
          flag = false;
        }
        if(len>1 && isOnly){
          this.showMess("只能选择一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData=[];
        data = this.addIndex(data);
        this.tableData = data;
        this.listTotal = 1;
      },
      setTableData(){
        this.listMessTitle.ajaxParams = Object.assign(this.listMessTitle.ajaxParams,this.queryQptions);
        this.ajax(this.listMessTitle);
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){

      },
      /*--点击--导出--按钮--*/
      exportData(){
        this.openModel('export');
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index){
        this.operailityData = this.tableData[index-1];
        this.openModel("show");
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer){
        this[targer+'Modal'] = false;
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
      subCallback(target,title,updata){
        this.cancel(target);
        if(title){
          this.successMess(title);
        }
        if(!updata){
          this.setTableData();
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
      },
    },
    created(){
      this.init();
    },
    mounted(){
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components:{
      //当前组件引入的子组件
      show,
//      eptWork
    }
  }
</script>
