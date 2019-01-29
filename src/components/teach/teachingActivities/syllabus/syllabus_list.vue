<template>
  <div id="content" ref="content">
    <el-form  label-width="80px" ref="formValidate" inline class="demo-ruleForm">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >&nbsp;</el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item label="开始时间" prop="activityBeginTime" >
            <el-date-picker
              v-model="formValidate.activityBeginTime"
              type="date"
              :clearable="false"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              @change="handleStartTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="activityEndTime" >
            <el-date-picker
              v-model="formValidate.activityEndTime"
              align="right"
              type="date"
              :clearable="false"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions1"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
          <el-button @click="searchEvent"    icon="search"></el-button>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>

      <!--高级搜索项-->
      <div v-show="searchMore" ref="searchMore" style="float: right">
        <el-form-item label="科室" prop="name" >
          <el-select v-model="formValidate.depId" placeholder="科室">
            <select-option  :type="'dep'"></select-option>
          </el-select>
        </el-form-item>
        <el-button type="info" @click="searchEvent">查询</el-button>
      </div>
    </el-form>
    <div>
      <div
        id="myTable"
        ref="myTable">
        <el-table
          :data="tableData"
          border
          :height="dynamicHt"
          tooltip-effect="dark"
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            label="序号"
            prop="index"
            align="center"
            width="65">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="课程名称"
            prop="activityName"
            show-overflow-tooltip
            width="200">
          </el-table-column>
          <el-table-column
            prop="activitySite"
            show-overflow-tooltip
            label="授课地点"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityType"
            label="课程类型"
            width="120">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityTime"
            label="课程时间"
            width="120">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="hostUserName"
            label="授课老师"
            width="120">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityState"
            label="状态"
            width="120">
            <template scope="scope">
              {{ scope.row.activityState == 'NO_RELEASE'?'未发布':scope.row.activityState =='RELEASE'?'已发布':'结束'}}
            </template>
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
    <!--查看教学活动-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="showModal"
      title="查看教学活动"
      class-name="vertical-center-modal"
      :width="960">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" :url="url" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    </div>
</template>


<script>
  import url from '../app';
  import show from './syllabus_view.vue';
  let Util = null;
  export default {
      props:['userType'],
    data() {
      return {
        //查询表单
        url:url,
        tableData: [],
        formValidate: {
          activityName: '',//活动名称
          activityType: '',//活动类型
          activityBeginTime: '',//开始时间
          activityEndTime: '',//结束时间
          depId: '',//科室
        },
        searchMore: false,
        showModal:false,
        viewId:{id:'view',title:'查看'},
        dynamicHt:100,
        totalCount:0,
        operailityData:{},
        multipleSelection:[],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        tableListMessTitle: {
          ajaxSuccess: 'updateTableList',
          ajaxParams: {
            url: url.teachctivityListType+'/'+this.userType,
            params: {},
          }
        },
      }
    },
    methods: {
    //初始化请求列表数据
    init(){
      Util = this.$util;
      //ajax请求参数设置
      this.myPages =  Util.pageInitPrams;

      this.queryQptions = {
        curPage: 1,pageSize: Util.pageInitPrams.pageSize
      }
      this.setTableData();
    },
    //设置表格及分页的位置
    setTableDynHeight(){
      let content = this.$refs.content;
      let parHt = content.parentNode.parentNode.offsetHeight;
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
        this.showMess("只能修改一条数据!")
        flag = false;
      }
      return flag;
    },

    //通过get请求列表数据
    updateTableList(responseData){
      if(!responseData.data)return;
      this.tableData = this.addIndex(responseData.data);
      if(!responseData.totalCount) return;
      this.totalCount = responseData.totalCount;
    },
    setTableData(){
      this.tableListMessTitle.ajaxParams.params = Object.assign(this.tableListMessTitle.ajaxParams.params,this.queryQptions,this.formValidate);
      this.ajax(this.tableListMessTitle);
    },

    //搜索监听回调
    searchEvent(isLoading){
      //        isLoading(true);
      let isSubmit = this.handleSubmit('formValidate');
      if(isSubmit){
        this.setTableData()
      }
    },


    /*
     * 列表查询方法
     * @param string 查询from的id
     * */
    handleSubmit(name){
      let flag =false
      this.$refs[name].validate((valid) => {
        if (valid) {
          flag =true;
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
      return flag
    },


    /*--点击--添加--按钮--*/
    add(){
      this.openModel("add");
    },
    /*--点击--修改--按钮--*/
    edit(data){
      this.operailityData = data;
      this.openModel("edit");
    },
    /*--点击--删除--按钮--*/
    remove(){
      if(!this.isSelected()) return;
      this.operailityData = this.multipleSelection;
      this.openModel('remove') ;
    },
    /*
     * 点击--查看--按钮
     * @param index string|number  当前行索引
     * */
    show(data){
      this.operailityData = data;
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


    // 高级搜索按钮展开搜索表单并重新计算表格高度
    showSearchMore() {
      this.searchMore = !this.searchMore;
      this.$nextTick(function () {
        this.setTableDynHeight()
      })
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
      show,
    }
  };

</script>
