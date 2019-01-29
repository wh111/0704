<!----------------------------------
****--管床纪录审核
****--@role     带教老师
****--@date     2017/7/9
****--@author   gx
----------------------------------->

<template>
  <div id="content" ref="content" class="modal">
    <el-form  ref="formValidate" :model="formValidate" :rules="clinicalOperationWriteList" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >
          <el-button type="primary" @click="pass">批量通过</el-button>
          <el-button type="danger" @click="reject">批量驳回</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item label="病名" prop="name" >
            <el-input style="width:300px;"   v-model="formValidate.name" placeholder="输入病名搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-show="searchMore" ref="searchMore" align="right">
        <el-form-item label="科室" prop="userType" >
          <el-select filterable  v-model="formValidate.depId" placeholder="请选择">
            <!---->
            <!--<select-option :type="'userRotaryDeptlist'" :userType="userType" :userId="userId"  name="depName" id="depId"></select-option>-->
            <select-option :type="type"></select-option>
          </el-select>

        </el-form-item>
        <el-form-item label="状态:"  prop="title">
          <el-select v-model="formValidate.state" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="待审核" value="SUBMIT"></el-option>
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
              <el-button v-if="scope.row.state!='PASS' && scope.row.state != 'REJECT'" size="small" @click="audit(scope.row)">审核</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="depName"
            label="科室"
            width="200">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="diseaseName"
            label="病名"
            width="200">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="caseNumber"
            label="病历号"
            width="200">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tubeTime"
            label="操作时间"
            align="center"
            width="200"
          >
          </el-table-column>

          <el-table-column
            prop="createUserName"
            label="创建人">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="teacherName"
            label="指导老师">
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
    <!--审核-->
    <Modal
      close-on-click-modal="false"
      width="1000"
      v-model="auditModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="auditId"></modal-header>
      <audit v-if="auditModal" @cancel="cancel" @audit="subCallback" :operaility-data="operailityData" :url="url"></audit>
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

    <!--批量通过-->
    <Modal
      width="500"
      v-model="passModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="passId"></modal-header>
      <operate v-if="passModal" :type="'pass'" :operate-url="url.tubeBedRecordingModifySubPass" :methods="'post'"  @cancel="cancel" @operate="subCallback" :operaility-data="operailityData" ></operate>
      <div slot="footer"></div>
    </Modal>

    <!--批量驳回-->
    <Modal
      width="500"
      v-model="rejectModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="rejectId"></modal-header>
      <operate v-if="rejectModal" :type="'reject'" :operate-url="url.tubeBedRecordingModifySubReject" :methods="'post'"  @cancel="cancel" @operate="subCallback" :operaility-data="operailityData" ></operate>
      <div slot="footer"></div>
    </Modal>
    <!---->
  </div>
</template>
<script>
  import {clinicalOperationWriteList} from '../rules'
  /*当前组件必要引入*/
  import url from '../api'
  //引入--修改--组件
  import audit from "./tubeBedRecordAudit_audit.vue";
  //引入--查看--组件
  import show from "./tubeBedRecordAudit_view.vue";

  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        clinicalOperationWriteList,
        url:url,
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          depId: '',       //科室ID
          name: '',       //操作名称
          sortby: '',    //   排序列
          order: '' ,//升序、降序
          state:"SUBMIT",
        },

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [
//          {
//            "id":111,
//            "depName":"科室",
//            "createUserName":"名称",
//            "createTime":"2014-01-01 10:10:10",
//            "clinicalName":"操作名称",
//            "clinicalType":"病例号",
//            "clinicalTime":"2016-01-01",
//            "note":"备注说明",
//            "teacherName":"指导老师",
//            "state":"NO_SUBMIT"
//          }
        ],
        searchMore: false,
        loading:false,
        passModal:false,
        rejectModal:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.tubeBedRecordingMangePageList,
            params:{}
          }
        },
        /*--按钮button--*/
        editId:{id:'editId',title:'修改'},
        viewId:{id:'viewId',title:'查看'},
        passId:{id:'passId',title:'通过'},
        auditId:{id:'auditId',title:'审核'},
        reportedId:{id:'reportedId',title:'上报'},
        rejectId:{id:'rejectId',title:'驳回'},
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
        let identify = userInfo.roleList[0].identify;
        if(identify=='JXMS'||identify=='KEZR'|| identify==''){
          this.type = 'byNowUser';
        }else {
          this.type = 'dep';
        }
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
          this.showMess("只能修改一条数据!")
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
      /*--点击--批量通过--按钮--*/
      pass(){
        if(!this.isSelected()) return;
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].state == 'PASS' ||this.multipleSelection[i].state == 'REJECT'){
            this.errorMess('已通过或者已驳回的数据不能进行通过');
            return;
          }
        }
        this.operailityData =this.multipleSelection;
        this.openModel('pass') ;
      },

      /*--点击--审核--按钮--*/
      audit(data){
        this.operailityData = data;
        this.openModel("audit");
      },

      reject(){
        if(!this.isSelected()) return;
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].state == 'PASS' ||this.multipleSelection[i].state == 'REJECT'){
            this.errorMess('已通过或者已驳回的数据不能进行驳回');
            return;
          }
        }
        this.operailityData =this.multipleSelection;
        this.openModel('reject') ;
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
      //当前组件引入的子组件
      audit,show
    }
  }
</script>

