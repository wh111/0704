<template>
  <div id="content" ref="content" class="modal">
    <el-form  :model="formValidate" ref="formValidate" :rules="rules.teachingExperienceList"  inline label-width="90px" class="demo-ruleForm">
      <el-row >
        <el-col :span="10" >

        </el-col>
        <el-col :span="14" :offset="10" align="right">
          <el-form-item label="课程名称" prop="activityName" >
            <el-input style="width:300px;"   v-model="formValidate.activityName" placeholder="输入活动名称搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>

      <div v-if="searchMore" ref="searchMore">
        <el-form-item label="课程类型" prop="user">
          <el-select v-model="formValidate.activityType" label="活动状态" placeholder="请选择活动类型">
            <select-option  :id="'value'" :isCode="true" :type="'teachActivityType'"></select-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="activityBeginTime" >
          <el-date-picker
            v-model="formValidate.activityBeginTime"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions0"
            @change="handleStartTime">
          </el-date-picker>
          到
          <el-date-picker
            v-model="formValidate.activityEndTime"
            align="right"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions1"
            @change="handleEndTime">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="状态" prop="status" >
          <el-select filterable  v-model="formValidate.activityState" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="未上报" value="NO_RELEASE"></el-option>
            <el-option label="已上报" value="RELEASE"></el-option>
            <el-option label="结束" value="STOP"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室" prop="depId" >
          <el-select filterable  v-model="formValidate.depId" placeholder="请选择">
            <select-option ></select-option>
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
            width="260">
            <template scope="scope">
              <el-button size="small" @click="xdth(scope.row)">心得体会</el-button>
              <el-button size="small" @click="uploadingCourseware(scope.row)">上传课件</el-button>
              <el-button size="small" @click="show(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="activityName"
            label="课程名称"
            width="120">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityType"
            label="课程类型"
            width="120">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activitySite"
            label="授课地点"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="hostUserName"
            label="授课老师"
            width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityUser"
            label="参加人"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="actuallyUserCount"
            label="签到人数"
            width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityTime"
            label="日期"
            width="120">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityTimeInfo"
            label="时间"
            width="120">
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
    <!--心得体会-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="xdthModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="xdthId"></modal-header>
      <xdth v-if="xdthModal" @cancel="cancel" @xdth="subCallback" :url="url" :operaility-data="operailityData"></xdth>
      <div slot="footer"></div>
    </Modal>

    <!-- 上传课件-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="uploadingCoursewareModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="uploadingCoursewareId"></modal-header>
      <uploadingCourseware v-if="uploadingCoursewareModal" @cancel="cancel" @uploadingCourseware="subCallback" :url="url" :operaility-data="operailityData"></uploadingCourseware>
      <div slot="footer"></div>
    </Modal>
    <!--查看档案管理弹窗-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import rules from '../../rules.js'
  /*当前组件必要引入*/
  import url from '../app'
  //引入--新建--组件
  import show from "./teachingExperience_view.vue";
  //引入--选择人员--组件
  import xdth from "./teachingExperience_xdth.vue";
  //引入--选择人员--组件
  import uploadingCourseware from "./teachingExperience_uploadingCourseware.vue";
  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        rules,
        searchMore:'',
        //查询表单
        url:url,
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          activityName: '', //获得名称
          activityType: '', //活动类型
          activityBeginTime: '', //活动时间(开始)
          activityEndTime: '', //活动时间(开始)
          activityState: '', //活动状态
          depId: '', //科室ID
          userId:'',
        },

        "tableData":[
//          {
//            "id":1,
//            "activityName":"教学查房",
//            "activityType":"理论",
//            "hostUserName":"张三",
//            "activityTime":"2017-03-31",
//            "activitySite":"教学楼三楼301室",
//            "activityUser":"呼吸科-住院医师",
//            "shouldUserCount":30,
//            "actuallyUserCount":30,
//            "recordTimes":"9:00-10:00,10:10-11:00",
//            "activityState":"nosubmit"
//          }
        ],
        //窗口开关
        uploadingCoursewareModal:false,
        xdthModal:false,

        uploadingCoursewareId:{id:'uploadingCoursewareId',title:'上传课件'},
        xdthId:{id:'xdthId',title:'心得体会'},

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        loading:false,
        listTotal:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.hostUserList,
            params:{}
          }
        },
        /*--按钮button--*/
        viewId:{id:'view',title:'查看'},
        auditId:{id:'audit',title:'审核'},
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;
        let userInfo = this.$store.getters.getUserInfo;
        this.formValidate.userId = userInfo.id;
        this.queryQptions = {curPage: 1,pageSize: Util.pageInitPrams.pageSize
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
        if(!data)return;
        this.tableData = this.addIndex(data);
        this.listTotal = responseData.totalCount||0;
      },
      setTableData(){
        let  formSearch = this.formDate(this.getFormData(this.formValidate),['activityBeginTime','activityEndTime'],this.yearMonthData);
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,formSearch);
        this.ajax(this.listMessTitle);
      },
      //搜索监听回调
      searchEvent(isLoading){
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if(isSubmit){
          this.setTableData(isLoading)
        }
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
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
      /*--点击--心得体会--按钮--*/
      xdth(data){
        this.operailityData = data;
        this.openModel("xdth");
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data,type){
          this.operailityData= data;
        this.openModel("show");
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      uploadingCourseware(data,type){
          this.operailityData= data;
        this.openModel("uploadingCourseware");
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
      show,xdth,uploadingCourseware
    }
  }
</script>
