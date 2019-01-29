<template>
  <div id="content" ref="content" class="modal">

    <el-form  :model="formValidate" ref="formValidate" :rules="rules.leaveManagementList" inline label-width="90px" class="demo-ruleForm">
      <el-row >
        <el-col :span="10" >
          &nbsp;
          <!--<el-button  class="but-col"  @click="pass" type="primary">批量通过</el-button>-->
          <!--<el-button class="but-col" @click="reject" type="danger">批量驳回</el-button>-->
        </el-col>
        <el-col :span="14"  align="right">
          <input class="hidden">
          <el-input style="width:300px;"   v-model="formValidate.userName" placeholder="输入姓名搜索">
            <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
          </el-input>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      </br>
      <div v-if="searchMore" ref="searchMore">
        <el-form-item label="请假时间" prop="name" >
          <el-date-picker
            v-model="formValidate.beginDate"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions0"
            @change="handleStartTime"
          >
          </el-date-picker>
          到
          <el-date-picker
            v-model="formValidate.endDate"
            align="right"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions1"
            @change="handleEndTime">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="科室" prop="depId" >
          <el-select filterable  v-model="formValidate.depId" placeholder="请选择">
            <select-option :role="role" :type="type" :name="type=='getDepByTeacher'?'depName':''" :id="type=='getDepByTeacher'?'depId':''"  :userType="userType"  :userId="userId"></select-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status" >
          <el-select filterable  v-model="formValidate.status" placeholder="请选择">
            <el-option label="审核中(待审)" value="DSH"></el-option>
            <el-option label="通过" value="TG"></el-option>
            <el-option label="不通过" value="BTG"></el-option>
          </el-select>
        </el-form-item>

        <!--<el-form-item label="生源类型" prop="userType" >-->
          <!--<el-select filterable  v-model="formValidate.userType" placeholder="请选择">-->
            <!--<el-option label="全部" value=""></el-option>-->
            <!--<el-option label="实习生" value="SXS"></el-option>-->
            <!--<el-option label="研究生" value="YJS"></el-option>-->
            <!--<el-option label="住院医" value="ZYY"></el-option>-->
            <!--<el-option label="进修生" value="JXS"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->

        <el-button type="info" @click="searchEvent">查询</el-button>

      </div>
    </el-form>

      <!--<el-button  class="but-col" @click="add" type="primary">添加</el-button>-->
      <!--<el-button class="but-col" @click="remove" type="danger">删除</el-button>-->


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
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="100">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <el-button
              size="small"
              @click="show(scope.row)">查看</el-button>
            <el-button
              size="small"
              v-if="scope.row.hasSp"
              @click="audit(scope.row)">审核</el-button>
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
          prop="rewardDate"
          label="请假时间"
          show-overflow-tooltip>
          <template scope="scope">
            <span style="margin-left: 10px">{{scope.row.beginDate}}~{{scope.row.endDate}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="leaveType"
          label="请假事由"
          show-overflow-tooltip>
          <template scope="scope">
            {{converterLeaveType(scope.row.leaveType)}}
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="状态"
          show-overflow-tooltip>
          <template scope="scope">
            {{converter(scope.row.status)}}
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
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
      </div>

        <div>
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
            <remove v-if="removeModal" :delete-url="deleteUrl" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>

            <div slot="footer"></div>
          </Modal>
          <!--查看档案管理弹窗-->
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
          <!--审核弹窗-->
          <Modal
            width="1000"
            v-model="auditModal"
            title="查看档案管理弹窗"
            class-name="vertical-center-modal"
            :loading="loading">
            <modal-header slot="header" :content="auditId"></modal-header>
            <audit v-if="auditModal" :rules="rules" @cancel="cancel" @audit="subCallback" :operaility-data="operailityData"></audit>
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
            <operate v-if="reportedModal" :type="'reported'" :operateData="reportedData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
            <div slot="footer"></div>
          </Modal>
          <!---->
          <!--批量通过弹窗-->
          <Modal
            close-on-click-modal="false"
            height="200"
            v-model="passModal"
            title="对话框标题"
            class-name="vertical-center-modal"
            :loading="loading"
            :width="500">
            <modal-header slot="header" :content="passId"></modal-header>
            <operate v-if="passModal" :type="'pass'" :operateData="statusData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
            <div slot="footer"></div>
          </Modal>
          <!---->
          <!--批量驳回弹窗-->
          <Modal
            close-on-click-modal="false"
            height="200"
            v-model="rejectModal"
            title="对话框标题"
            class-name="vertical-center-modal"
            :loading="loading"
            :width="500">
            <modal-header slot="header" :content="rejectId"></modal-header>
            <operate v-if="rejectModal" :operateData="statusData" :type="'reject'"  @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
            <div slot="footer"></div>
          </Modal>
          <!---->
        </div>
   </div>
  </div>
</template>
<script >
  import rules from '../rules.js';
  import edit from "./leaveManagement_edit.vue";
  import show from "./leaveManagement_view.vue";
  import add from "./leaveManagement_add.vue";
  import audit from "./leaveManagement_audit.vue";
  let Util=null;
  export default{
    data() {
      return {
        rules:rules,
        //查询表单
        deleteUrl:'leave/remove',
        formValidate: {
          beginDate: '',
          endDate: '',
          depId: '',
          status: 'DSH',
          userType: '',
          userName: ''
        },
        options:{},
        "tableData":[

        ],
        searchMore: false,
        statusData:{
          url:'leave/modifyLeaveStatus/approval/batch',
          method:'put',
          data:{
            status:'TG'
          }
        },
        reportedData:{
          url:'leave/modifyLeaveStatus',
          method:'put',
          data:{
            status:'YSB'
          }
        },

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        loading:false,
        totalCount:0,


        reportedModal:false,
        passModal:false,
        rejectModal:false,
        /*--按钮button--*/
        addId:{id:'addId',title:'新建'},
        editId:{id:'editId',title:'修改'},
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},
        auditId:{id:'auditId',title:'审核'},
        reportedId:{id:'reportedId',title:'上报'},
        passId:{id:'passId',title:'通过'},
        rejectId:{id:'rejectId',title:'驳回'},

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:'leave/list',
            params:''
          }
        },

        type:'dep',
        role:''


      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        let userInfo = this.$store.getters.getUserInfo;
        if(userInfo.roleList[0].identify == 'DJLS'){
          this.type = 'getDepByTeacher';
        }else {
          this.type = 'byUserType';
        }
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;
        this.queryQptions = {
        curPage: 1,
          pageSize: Util.pageInitPrams.pageSize,
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
          let data = responseData.data;
          if (!data)return;
          this.tableData = responseData.data;
      this.totalCount = responseData.totalCount || 0;
      },
      setTableData(){
        let formValidate =  this.formDate(this.getFormData(this.formValidate),['beginDate','endDate'],this.yearMonthData);
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,formValidate);
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
        this.operailityData = {userNmae:'张三',id:'2'}
        this.openModel("add");
      },


      //审核
      audit(data){
        this.operailityData = data;
        this.openModel("audit");
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
        this.operailityData = this.multipleSelection;
        this.openModel('remove') ;
      },


      /*--点击--批量通过--按钮--*/
      pass(){
        if(!this.isSelected()) return;
        this.statusData.data.status = 'TG';
        this.operailityData = this.multipleSelection;
        this.openModel('pass') ;
      },


      /*--点击--批量驳回--按钮--*/
      reject(){
        if(!this.isSelected()) return;
        this.statusData.data.status = 'BH';
        this.operailityData = this.multipleSelection;
        this.openModel('reject') ;
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data){
        this.operailityData = data
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

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },



      //转换请假条状态status
      converter(status){
        switch (status){
          case 'WSB' :status = '未上报' ;
            break;
          case 'DSH' :status = '审核中(待审)' ;
            break;
          case 'TG' :status = '通过' ;
            break;
          case 'BTG' :status = '不通过' ;
            break;
          case 'BH' :status = '驳回修改' ;
            break;
        }
        return status;
      },

      //转换
      converterLeaveType(leaveType){
        switch (leaveType){
          case 'SHI' : leaveType = '事假';
            break;
          case 'BING' : leaveType = '病假';
            break;
          case 'SANG' : leaveType = '丧假';
            break;
          case 'CHAN' : leaveType = '产假';
            break;
          case 'TAN' : leaveType = '探亲假';
            break;
          case 'HUN' : leaveType = '婚假';
            break;
          case 'OTHER' : leaveType = '其他';
            break;

        }
        return leaveType
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
      let userInfo = this.$store.getters.getUserInfo;
      this.userId=userInfo.id;
      this.userType=userInfo.studentTypes;
      this.role = userInfo.roleList[0].identify;
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
      show,edit,add,audit
    },
    computed:{
      //计算总共多少天
      length(){
        if(!this.formValidate.endDate ||!this.formValidate.beginDate)return 0
        let length = this.formValidate.timeLength = (this.deformatterDate(this.formValidate.endDate) - this.deformatterDate(this.formValidate.beginDate))/86400000+1;
        return length
      }

    },
    watch:{
      showData(){
        this.loading=true;
      }
    }

  }
</script>
<style>

.add-remove{
  margin-bottom: 20px;
}



</style>
