<template>

  <div>
    <el-form  label-width="90px" >
      <el-row>
        <el-col :span="5" :offset="4">
          <el-form-item label="科室:" prop="userType">
            {{formValidate.activityPlanDepName}}
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="计划年份:" prop="userType">
            {{formValidate.activityPlanYear}}
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="计划月份:" prop="userType">
            {{formValidate.activityPlanMonth}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form :model="formValidate" ref="formValidate"  class="demo-form-inline my-tooltip-button" label-width="90px" >

      <el-table
        align="center"
        :data="formValidate.activityDetails"
        tooltip-effect="dark"
        @row-click="rowclick"
        highlight-current-row
        max-height="500"
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="75">
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          align="center"
          prop="planActivityTitle"
          label="活动名称">
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="planActivityType"
          label="活动类型"
          width="180">
          <!--<template scope="scope">-->
            <!--<el-select disabled v-model="scope.row.planActivityType"  placeholder="请选择" >-->
              <!--<el-option-->
                <!--v-for="item in planActivityTypeData"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="planActivityHostUserName"
          label="授课老师"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="planActivityTime"
          align="center"
          label="活动时间"
          width="180">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="planActivityTimeids"
          align="center"
          label="活动时间段"
          width="200">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="planActivitySite"

          label="活动地点">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="planActivityContent"
          label="活动内容">
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template scope="scope">
            <el-tooltip  v-show="scope.row.planActivityFileName!=0" class="item" effect="dark"  placement="bottom">
              <div slot="content"><div v-for="(item,index) in scope.row.planActivityFileName" :key="index">{{item}}</div></div>
              <el-button size="small" @click="files(scope.row)" type="info">附件管理</el-button>
            </el-tooltip>
            <el-button v-show="scope.row.planActivityFileName==0" size="small" @click="files(scope.row)" >附件管理</el-button>
            <!--<el-button size="small" @click="remove(scope.$index)" type="danger">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    </br>
    <!--<el-row >-->
      <!--<el-col :span="10" :offset="10">-->
        <!--<load-btn @listenSubEvent="noreleaseEvent" :btnData="loadBtn"></load-btn>-->
        <!--<load-btn @listenSubEvent="releaseEvent" :btnData="releaseBtn"></load-btn>-->
        <!--<el-button  @click="cancel">取消</el-button>-->
      <!--</el-col>-->
    <!--</el-row >-->
    <!--选择人员-->
    <Modal
      :mask-closable="false"
      width="890"
      v-model="hostModal"
      title="新建教学活动"
      class-name="vertical-center-modal"
    >
      <modal-header slot="header" :content="hostId"></modal-header>
      <select-user v-if="hostModal" @cancel="hostModal=false" @setUsers="selectHostCallback" :initUser="selectUser"></select-user>
      <div slot="footer"></div>
    </Modal>
    <!--附件-->
    <Modal
      :mask-closable="false"
      width="890"
      v-model="uploadModal"
      title="新建教学活动"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="uploadId"></modal-header>
      <upload v-if="uploadModal" :isshow="true" :fileList="fileList" @cancel="uploadModal=false" @upLoad="uploadCallback" :initUser="selectUser"></upload>
      <div slot="footer"></div>
    </Modal>
    <!--选择主持人-->
  </div>
</template>
<script>
  import selectUser from "../../../common/selectUser.vue"  //选择主持人
  import upload from './teachplanPerformcase_uploadFile.vue' // 上传附件
  //当前组件引入全局的util
  let Util=null;
  export default {
    props:['operailityData','url'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        releaseBtn:{title:'提交并发布',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          "state":"NO_RELEASE",                      //RELEASE 或者 NO_RELEASE
          "activityPlanYear":this.operailityData.activityPlanYear,            //计划对应年份
          "activityPlanMonth":this.operailityData.activityPlanMonth,           //计划对应月份
          "activityPlanDepId":this.operailityData.activityPlanDepId,           //计划科室ID
          "activityPlanDepName":this.operailityData.activityPlanDepName,        //计划科室名称
          "activityDetails":[
//            {
//              "planActivityTitle":"",      //活动名称
//              "planActivityType":"",       //活动类型
//              "planActivityHostUserId":"", //主持人ID
//              planActivityHost:[],
//              "planActivityHostUserName":"",//主持人姓名
//              "planActivityTime":"",        //活动时间(yyyy-MM-dd)
//              "planActivityTimeids":[],     //活动时间段id(多个逗号分隔)
//              "planActivitySite":"",        //活动地点
//              "planActivityContent":"",     //活动内容
//              "planActivityFileId":""  ,      //附件IDs
//              "planActivityFileName":[] ,    //附件名字
//              "planActivityFileList":[] ,     //附件列表
//            }
          ]
        },


        fileList:[], //当前选中附件的数据
        selectUser:[],//当前选中选择人员的数据
        planActivityTypeData:[],  //获取的活动类型数据
        tableData:[],
        rowData :{},  //当前选择的是第几行
        hostModal:false,
        uploadModal:false,
        uploadId:{
          id:"uploadId",
          title:"附件管理",
        },
        hostId:{
          id:"hostId",
          title:"选择主持人",
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.teachActivityPlanModify+this.operailityData.activityPlanId,
            jsonString:true,
            method:'post',
            data:{},
          }
        },
        planActivityTypeMessTitle:{
          ajaxSuccess:'planActivityTypeSuccess',
          ajaxParams:{
            url:'/dictionary/getByCode/TEACH_ACTIVITY_TYPE',
            method:'get',
          }
        },

        timeIdsData:[],
        //获取活动时间段
        timeIdsMessTitle: {
          ajaxSuccess: 'timeIdsList',
          ajaxParams: {
            url: this.url.teachCourseTime,
            params: {},
          }
        },

        //获取数据
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.teachActivityPlanGet+this.operailityData.activityPlanId,
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      //请求教学活动类型数据
      this.ajax(this.planActivityTypeMessTitle)
//      this.ajax(this.timeIdsMessTitle);
      this.ajax(this.listMessTitle) //获取详情
      this.SuccessGetCurrData()
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{

      //提交不发布
      noreleaseEvent(isLoadingFun){
        this.formValidate.state = 'NO_RELEASE';
        this.listenSubEvent(isLoadingFun);
      },

      //提交并发布
      releaseEvent(isLoadingFun){
        this.formValidate.state = 'RELEASE';
        this.listenSubEvent(isLoadingFun);
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          let formValidate = this.getFormData(this.formValidate);
          this.editMessTitle.ajaxParams.data=this.conductListenData(formValidate);
          isLoadingFun(true);
          this.ajax(this.editMessTitle,isLoadingFun)
        }
      },

      //处理提交的数据
      conductListenData(data){
        let activityDetails = data.activityDetails;

        for(let i=0 ;i<activityDetails.length;i++){
          let item = activityDetails[i];
          item.planActivityTimeids = item.planActivityTimeids.join(',')  //处理时间段
          item.planActivityTime = this.yearMonthData(item.planActivityTime)  //处理时间段

        }
        return data;

      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },


      //获取到详情数据
      SuccessGetCurrData(res){
//        let data = res.data;
        let data = {
          "activityPlanId":111,
          "activityPlanYear":"计划对应年份",
          "activityPlanMonth":"计划对应月份",
          "activityPlanDepId":"计划科室ID",
          "activityPlanDepName":"计划科室名称",
          "activityPlanState":"计划状态",
          "activityDetails":[
            {
              "planDetailId":"活动详情ID",
              "planActivityTitle":"活动名称",
              "planActivityType":"活动类型",
              "planActivityHostUserId":"主持人ID",
              "planActivityHostUserName":"主持人姓名",
              "planActivityTime":"1992-01-01",
              "planActivityTimeids":"1",
              "planActivitySite":"活动地点",
              "planActivityContent":"活动内容",
              "planActivityFiles":[
                {
                  "id":11,
                  "fileUrl":"http://www.baidu.com",
                  "fileName":"附件",
                  "fileType":"txt"
                }
              ]
            }
          ]
        }
        if(!data) return;

        this.formValidate =  this.conductGetData(data)

      },


      //处理获取的时间段
      conductGetData(data){
        let activityDetails = data.activityDetails;
        for(let i=0;i<activityDetails.length;i++){
          let item = activityDetails[i];
          //处理时间段
          item.planActivityTimeids = item.planActivityTimeids.split(',');  //
          //处理主持人
          item.planActivityHost = [];
          let planActivityHostUserIds = item.planActivityHostUserId.split(',');
          let planActivityHostUserNames = item.planActivityHostUserName.split(',');
          for(let k=0;k<planActivityHostUserIds.length;k++){
            item.planActivityHost.push({
              key:planActivityHostUserIds[k],
              label:planActivityHostUserNames[k],
              disabled: false,
            })
          }

          //处理附件
          let files = item.planActivityFiles;
          item.planActivityFileList = files;
          let fileIds = [];
          let fileNames = [];
          for(let l=0;l<files.length;l++){
//            "planActivityFileId":""  ,      //附件IDs
//              "planActivityFileName":[] ,    //附件名字
            fileIds.push(files[l].id);
            fileNames.push(files[l].fileName);
          }
          item.planActivityFileId = fileIds.join(',');
          item.planActivityFileName = fileNames
        }
        return data;
      },

      //获取到的教学活动类型数据
      planActivityTypeSuccess(res){
        let data = res.data;
        if(!data) return;
        this.planActivityTypeData = data.child;

      },

      //获取活动时间段
      timeIdsList(res){
        let data = res.data;
        if(!data) return;
        this.timeIdsData = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
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
       * 组件初始化入口
       * */
      init(){
        //this.ajax(this.listMessTitle)
      },


      //某一行单元格被点击的时候
      rowclick(row,i,l){
        this.rowData = row;

      },

      //选择人员的回调函数
      selectHostCallback(data){
        this.rowData.planActivityHost = data
        let ids=[] ;
        let names=[];
        for(let i=0;i<data.length;i++){
          let item = data[i];
          ids.push(item.key);
          names.push(item.label);
        }
        this.rowData.planActivityHostUserName = names.join(',');
        this.rowData.planActivityHostUserId = ids.join(',');
        this.hostModal = false;
      },

      //附件回调
      uploadCallback(ids,names,file){
        this.rowData.planActivityFileId= ids;
        this.rowData.planActivityFileName= names;
        this.rowData.planActivityFileList= file;
      },


      openHost(item){
        this.selectUser = item.planActivityHost;
        //因为点击主持人的时候不赋值，所以重新赋值
        this.hostModal = true;
      },

      //点击文件管理按钮
      files(item){
        this.fileList = item.planActivityFileList;
        this.uploadModal = true
      },


      //点击删除
      remove(index){
        this.formValidate.activityDetails.splice(index,1)
      },

      //增加一行
      add(){

        this.formValidate.activityDetails.push({
          "planActivityTitle":"",      //活动名称
          "planActivityType":"",       //活动类型
          "planActivityHostUserId":"", //主持人ID
          planActivityHost:[],
          "planActivityHostUserName":"",//主持人姓名
          "planActivityTime":"",        //活动时间(yyyy-MM-dd)
          "planActivityTimeids":[],     //活动时间段id(多个逗号分隔)
          "planActivitySite":"",        //活动地点
          "planActivityContent":"",     //活动内容
          "planActivityFileId":""  ,      //附件IDs
          "planActivityFileName":[] ,    //附件名字
          "planActivityFileList":[] ,     //附件列表
        })
      },
    },

    components:{
      selectUser,upload
    }
  }
</script>

<style>
  .my-tooltip-button .el-button+.el-button{
    margin-left: 0;
  }
</style>
