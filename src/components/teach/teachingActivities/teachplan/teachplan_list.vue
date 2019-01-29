<!----------------------------------
****--@name     教学计划
****--@role     ${*}
****--@date     2017/8/25
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form  ref="formValidate" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >

          <el-button type="primary" @click="add">添加</el-button>
          <el-button type="danger" @click="remove">删除</el-button>
          <el-button type="primary" @click="publish">上报</el-button>
          <!--<el-button type="primary" @click="revocation">撤销</el-button>-->
          <el-button type="primary" @click="dervice">导出</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item label="计划年份:" prop="userType" >
            <el-date-picker
              v-model="formValidate.activityPlanYear"
              align="right"
              type="year"
              :editable="false"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <el-button @click="searchEvent"   icon="search"></el-button>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-show="searchMore" ref="searchMore">
        <el-form-item label="计划月份:" prop="userType" >
          <el-date-picker
            v-model="formValidate.activityPlanMonth"
            align="right"
            format="MM"
            type="month"
            :editable="false"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="科室:" prop="userType" >
          <el-select v-model="formValidate.activityPlanDepId" placeholder="科室">
            <select-option  :type="'dep'"></select-option>
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
            width="160">
            <template scope="scope">
              <el-button size="small"  type="info" @click="show(scope.row)">查看</el-button>
              <el-button
                size="small" type="warning" @click="edit(scope.row)">修改
              </el-button>
              <!--:disabled="!(scope.row.activityPlanState == 'NOT_SUBMIT' || scope.row.activityPlanState == 'AUDIT_FAILURE')"-->
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="activityPlanYear"
            label="计划对应年份">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityPlanMonth"
            label="计划对应月份">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityPlanDepName"
            label="计划科室名称"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityDetailCount"
            label="计划数量"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityPlanState"
            label="计划状态"
          >
            <template scope="scope">
              {{scope.row.activityPlanState | typeText}}
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
      :mask-closable="false"
      width="1300"
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
      :mask-closable="false"
      width="1300"
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
      :mask-closable="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove  v-if="removeModal" :delete-url="url.teachActivityPlanDelete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>

      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      width="1300"
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
      v-model="submitModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="submitId"></modal-header>
      <operate v-if="submitModal" :type="'submit'" :methods="'post'"
               :operate-data="submitData" @operate="subCallback"
               @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--撤销弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="revocationModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="revocationId"></modal-header>
      <operate v-if="revocationModal" :type="'revocation'" :operate-data="revocationData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="deriveModal"
      title="对话框标题"
      :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <!--<derive v-if="deriveModal" type="derive" messTitle="确定要导出到excel吗？"  :url="deriveUrl"-->
      <!--@cancel="cancel" @derive="subCallback"></derive>-->
      <ajax-derive v-if="deriveModal" type="derive" :deriveParams="deriveParams"
                   messTitle="确定要导出到excel吗？"
                   @cancel="cancel"></ajax-derive>
      <div slot="footer"></div>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../app'
  //引入--新建--组件
  import add from "./teachplan_add.vue";
  //引入--修改--组件
  import edit from "./teachplan_edit.vue";
  //引入--查看--组件
  import show from "./teachplan_view.vue";
  import ajaxDerive from '../../../common/ajax-derive.vue'

  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        url:url,
        deriveParams: '',
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          activityPlanYear: '',       //计划年份(yyyy)
          activityPlanMonth: '',       //计划月份(MM)
          activityPlanDepId:'' ,     //科室ID
          sortby: '',//排序列
          order: ''     //升序、降序
        },

        //上报
        submitData: {
          method:'put',
          url: url.modifyRelease,
          data:{
            type: 'submit',
          }
        },
        //撤销
        revocationData:{
          method:'put',
          url: url.modifyRelease,
          data:{
            type:'noRelease'
          }
        },
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [
//          {
//            "activityPlanId":111,
//            "activityPlanYear": "计划对应年份",
//            "activityPlanMonth": "计划对应月份",
//            "activityPlanDepId": "计划科室ID",
//            "activityPlanDepName": "计划科室名称",
//            "activityPlanState": "RELEASE",
//            "activityDetailCount":"计划数量",
//          }
        ],
        //发布
        submitModal: false,
        //撤销发布
        revocationModal:false,
        // 导出
        deriveModal: false,
        searchMore: false,
        loading:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.pageListManage,
            params:{}
          }
        },
        /*--按钮button--*/
        addId:{id:'addId',title:'新建'},
        editId:{id:'editId',title:'修改'},
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},
        submitId: {id: 'submitId', title: '上报'},
        revocationId:{id:'revocationId',title:'撤销'},
        deriveId: {id: 'deviceId', title: '导出'},

      }
    },
    methods: {
      //初始化请求列表数据
      init(){
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
        if(!responseData.data)return;
        this.tableData = this.addIndex(responseData.data);
        if(!responseData.totalCount) return;
        this.totalCount = responseData.totalCount;
      },
      setTableData(){

        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,this.getFormValidate());
        this.ajax(this.listMessTitle);
      },

      //获取搜索数据
      getFormValidate(){
        let formValidate =this.$util._.defaultsDeep({},this.formValidate);
        formValidate.activityPlanYear = this.conductDate(formValidate.activityPlanYear,'yyyy');
        formValidate.activityPlanMonth = this.conductDate(formValidate.activityPlanMonth,'MM');
        return formValidate
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
        for(let i=0;i< this.multipleSelection.length;i++){

          let item = this.multipleSelection[i];
          if(item.activityPlanState  == 'RELEASE' ){
            this.errorMess('只能对未发布的数据进行删除');
            return;
          }else {
            item.id = item.activityPlanId
          }


        }
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

      /*--点击--上报--按钮--*/
      publish(){
        if(!this.isSelected(true)) return;
        for(let i=0;i<this.multipleSelection.length;i++){
          if (this.multipleSelection[i].activityPlanState == 'NOT_SUBMIT') { // 未上报
            this.multipleSelection[i].id = this.multipleSelection[i].activityPlanId
          } else {
            this.errorMess('只能对未上报的数据进行上报')
            return
          }
        }
        this.operailityData = this.multipleSelection;
        this.openModel('submit')
      },


      /*--点击--撤销--按钮--*/
      revocation(){
        if(!this.isSelected(true)) return;
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].activityPlanState =='NO_RELEASE'){
            this.errorMess('只能对已发布的数据进行撤销');
            return ;
          }else {
            this.multipleSelection[i].id = this.multipleSelection[i].activityPlanId
          }
        }
        this.operailityData = this.multipleSelection;
        this.openModel('revocation') ;
      },
      /*--点击--导出--按钮--*/
      dervice () {
        let activityPlanIds = [] //定义数组存放选中的活动ID
        let activityPlanIdList = '' // 存放转化格式后的活动id
        if (this.multipleSelection.length) {
          for (var i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].activityPlanState == 'RELEASE') {
              activityPlanIds.push(this.multipleSelection[i].activityPlanId) // 已发布的可以导出
            } else {
              this.errorMess('只能对已发布的数据进行导出')
              return
            }
          }
        }
        if (activityPlanIds.length) {
          activityPlanIdList = activityPlanIds.join(',')
        }
        this.deriveParams = {
          url: '/teachActivityPlan/excelExport?activityPlanIdList=' +
          activityPlanIdList,
          params: this.getFormValidate(),
        }

        this.openModel('derive')
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
      Util = this.$util
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
      add, edit, show, ajaxDerive,
    }
  }
</script>
