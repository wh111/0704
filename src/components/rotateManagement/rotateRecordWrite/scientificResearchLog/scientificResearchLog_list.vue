<!--
**** 科研日志填写
**** @date     2017/7/3
**** @author   gx
-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" :model="formValidate" :rules="rules"   inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >
          <el-button type="primary" @click="add">添加</el-button>
          <el-button type="danger" @click="remove">删除</el-button>
          <el-button  @click="derive" type="info">导出科研日志到Word</el-button>

        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item label="标题" prop="logTitle" >
            <el-input style="width:300px;"   v-model="formValidate.logTitle" placeholder="输入标题搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <br>
      <!--高级搜索项-->
      <div v-show="searchMore" ref="searchMore" align="right">
        <el-form-item label="开始时间" prop="searchStartTime" >
          <el-date-picker
            v-model="formValidate.searchStartTime"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions0"
            @change="handleStartTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="searchEndTime" >
          <el-date-picker
            v-model="formValidate.searchEndTime"
            align="right"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions1"
            @change="handleEndTime">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="状态:" >
          <el-select v-model="formValidate.state" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="未上报" value="NO_SUBMIT"></el-option>
            <el-option label="待审核" value="NO_PASS"></el-option>
            <el-option label="通过" value="PASS"></el-option>
            <el-option label="驳回" value="REJECT"></el-option>
          </el-select>
        </el-form-item>

        <el-button type="info" @click="searchEvent">查询</el-button>

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
            width="200">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
              <el-button v-if="scope.row.state=='NO_SUBMIT' || scope.row.state=='REJECT'" size="small" @click="edit(scope.row)">修改</el-button>
              <el-button v-if="scope.row.state=='NO_SUBMIT' || scope.row.state=='REJECT'"  size="small" @click="reported(scope.row)">上报</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="logTitle"
            label="标题">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="editTime"
            label="日期">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="state"
            label="状态">
            <template scope="scope">
              {{scope.row.state | typeText}}
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
    <!--新建-->
    <Modal
      close-on-click-modal="false"
      :mask-closable="false"
      width="800"
      v-model="addModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :url="url"></add>
      <div slot="footer"></div>
    </Modal>
    <!--修改-->
    <Modal
      close-on-click-modal="false"
      width="800"
      v-model="editModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :url="url"></edit>
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
      <remove  v-if="removeModal" :delete-url="url.scientificResearchLogRemove.path" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>

      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal
      width="800"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></show>
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
      <operate v-if="reportedModal" :type="'reported'" :operateUrl="url.scientificResearchLogSubmit.path"   @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>

    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题" class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="config.urlPrefix+url.scientificResearchLogExportWord.path+deriveIds">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!---->
  </div>
</template>
<script>
  import {scientificResearchLogList as rules} from '../../rules.js'
  /*当前组件必要引入*/
  import url from '../api'
  //引入--新建--组件
  import add from "./scientificResearchLog_add.vue";
  //引入--修改--组件
  import edit from "./scientificResearchLog_edit.vue";
  //引入--查看--组件
  import show from "./scientificResearchLog_view.vue";
  import config from "../../../../config/config.js";
  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        config,
        rules,
        url:url,
        //查询表单
        formValidate: {
          logTitle: '',       //标题
          searchStartTime: '',       //查询填写开始时间(yyyy-MM-dd)
          searchEndTime: '',    //   查询填写结束时间(yyyy-MM-dd)
          state: '' ,    //状态
          sortby: ''   ,  //排序字段
          order: ''    , //排序方式ASC,ASC
        },
        deriveIds:'',
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [

        ],
        deriveModal:false,
        deriveId: {
          id: 'deriveId',
          title: '导出'
        },
        searchMore: false,
        loading:false,
        reportedModal:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.scientificResearchLogPageList.path,
            params:{}
          }
        },
        /*--按钮button--*/
        addId:{id:'addId',title:'新建'},
        editId:{id:'editId',title:'修改'},
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},
        reportedId:{id:'reportedId',title:'上报'},
        //人员
        userId:'',
        userType:'',
      }


    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        let userInfo = this.$store.getters.getUserInfo;
        this.userType = userInfo.studentTypes;
        this.userId = userInfo.id;

        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,pageSize: Util.pageInitPrams.pageSize
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
          this.showMess("只能删除一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData){
        if(!responseData.data)return;
        this.tableData = this.addIndex(responseData.data);
        if(!responseData.totalCount) return;
        this.totalCount = responseData.totalCount;
      },
      setTableData(){

        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,this.formValidate);
        this.ajax(this.listMessTitle);
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

      //上报
      reported(data){
        this.operailityData = data;
        this.openModel("reported");
      },
      /*--点击--修改--按钮--*/
      edit(data){
        this.operailityData = data;
        this.openModel("edit");
      },
      /*--点击--删除--按钮--*/
      remove(){
        if(!this.isSelected()) return;
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].state != 'NO_SUBMIT' && this.multipleSelection[i].state != 'REJECT') {
            this.showMess('只能删除未上报或已驳回的数据');
            return;
          }
        }
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


      //导出
      derive(){
        if(!this.isSelected()) return;
        let tempArr = [];
        for(let i=0;i<this.multipleSelection.length;i++){
          tempArr.push(this.multipleSelection[i].id);
        }
        this.deriveIds =tempArr;
        this.openModel("derive");
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

      //确定导出
      affirmDerive() {
        //        let http = this.$store.getters.getEnvPath.http;
        //        window.open() ;
        this.deriveModal=false;
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
      add,edit,show
    }
  }
</script>
