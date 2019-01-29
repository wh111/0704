
<!----------------------------------
****--执业医师考试
****--@date     2017/7/3
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form  ref="formValidate" :model="formValidate" :rules="rules" inline label-width="130px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >
          <!--todo disabled显示隐藏-->
          <!--有限制-->
          <!--<el-button type="primary" :disabled="disabled.pass" @click="pass">通过</el-button>
          <el-button type="danger" :disabled="disabled.pass"  @click="reject">不通过</el-button>-->
          <!--无限制-->
          <el-button type="primary"  @click="pass">通过</el-button>
          <el-button type="danger"   @click="reject">不通过</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item label="姓名:" prop="name" >
            <el-input style="width:300px;"   v-model="formValidate.name" placeholder="输入姓名搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <br>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore">

        <el-form-item label="专业:" prop="major" >
          <el-input  v-model="formValidate.major" placeholder="输入姓名搜索"></el-input>
        </el-form-item>

        <!--<el-form-item label="成绩范围（最小）:" prop="minScore" >-->
          <!--<el-input   v-model="formValidate.minScore" placeholder="输入成绩"></el-input>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="成绩范围（最大）:" prop="maxScore" >-->
          <!--<el-input  v-model="formValidate.maxScore" placeholder="输入成绩"></el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="状态:" prop="state" >
        <el-select filterable  v-model="formValidate.state" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="待审核" value="SUBMIT"></el-option>
        <el-option label="不通过" value="NO_PASS"></el-option>
        <el-option label="通过" value="PASS"></el-option>
        </el-select>
        </el-form-item>
        <!--<el-form-item label="生源类型:" prop="userType" >-->
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

    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable">
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
            width="80">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="160">
            <template scope="scope">
              <el-button  size="small" @click="show(scope.row)">查看</el-button>
              <el-button :disabled="['PASS','NO_PASS'].includes(scope.row.state) " size="small" @click="audit(scope.row)">审核</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="姓名"
            width="150">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="gender"
            label="性别"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="phone"
            label="电话号码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="major"
            label="专业">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="state"
            label="状态"
            width="100">
            <template scope="scope">
              {{scope.row.state|exam}}
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
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></show>
      <div slot="footer"></div>
    </Modal>
    <!--审核弹窗-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="auditModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="button.audit"></modal-header>
      <audit v-if="auditModal" @cancel="cancel" @audit="subCallback" :operaility-data="operailityData" :url="url"></audit>
      <div slot="footer"></div>
    </Modal>

    <!--批量通过-->
    <Modal
      width="500"
      v-model="passModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="button.passId"></modal-header>
      <operate v-if="passModal" :type="'pass'" :operate-url="auditUrl" :operateData="passData"  @cancel="cancel" @operate="subCallback" :operaility-data="operailityData" ></operate>
      <div slot="footer"></div>
    </Modal>

    <!--批量驳回-->
    <Modal
      width="500"
      v-model="rejectModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="button.rejectId"></modal-header>
      <operate v-if="rejectModal" :type="'reject'" :operate-url="auditUrl"  :operateData="rejectData"  @cancel="cancel" @operate="subCallback" :operaility-data="operailityData" ></operate>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>

  import {completionOfTheInspectionList as rules} from '../rules';
  /*当前组件必要引入*/
  import url from '../api'
  //引入--查看--组件
  import show from "./occupationalExamination_view.vue";
  //引入--查看--组件
  import audit from "./occupationalExamination_audit.vue";
  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        rules,
        url,
        auditUrl:url.modifyState.path,
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          name: '',       //姓名
          userType: '',   //生源类型
          year: '',   //年级
          major: '',   //专业
          state: '',   //状态
          sortby: '',   //排序列ieID
          order: ''     //升序、降序 ASC ,DESC
        },

        disabled:{
          pass:false,
        },

        rejectData:{
          data:{state:'NO_PASS'}
        },
        passData:{
          data:{state:'PASS'}
        },
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        searchMore: false,
        passModal: false,
        rejectModal: false,
        loading:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.examPagelist.path,
            params:{}
          }
        },
        /*--按钮button--*/
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},
        //* 按钮 *//
        button: {
          showId: {id: 'showId', title: '查看'},
          audit: {id: 'audit', title: '审核'},
          passId:{id:'passId',title:'通过'},
          rejectId:{id:'rejectId',title:'驳回'},
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
        let disabled = {pass:false}
        val.map(item=>{
          if(['NO_PASS','PASS'].includes(item.state) ){
            disabled.pass = true;
          }
        })
        this.disabled = disabled;
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
//        let {minScore,maxScore} = this.formValidate;
//        if(minScore && maxScore && minScore>=maxScore){
//          this.errorMess('最大分数必须大于最小分数');
//          return
//        }
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


      /*--点击--批量通过--按钮--*/
      pass(){
        if(!this.isSelected()) return;
        let ids = [];
        for(let i =0;i<this.multipleSelection.length;i++){
          let item = this.multipleSelection[i];
          item.id = item.userId;
        }
        this.operailityData = this.multipleSelection;
        this.openModel('pass') ;
      },


      reject(){
        if(!this.isSelected()) return;
        let ids = [];
        for(let i =0;i<this.multipleSelection.length;i++){
          let item = this.multipleSelection[i];
          item.id = item.userId;
        }
        this.operailityData = this.multipleSelection;
        this.openModel('reject') ;
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
      * 点击--查看--按钮
      * @param index string|number  当前行索引
      * */
      audit(data){
        this.operailityData = data;
        this.openModel("audit");
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

      //确定导出
      affirmDerive() {
        this.cancel('derive')
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
