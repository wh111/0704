<template>

  <div class="showWrapper">
        <div v-for="(item,index) in data">
          <div style="position: relative">
            <!--item.hostUserPhoto?http+item.hostUserPhoto:-->
            <img v-if="item.hostUserPhoto" style="width: 120px;height: 120px;" class="currUserMess headerUrl" :src="http+item.hostUserPhoto"  />
            <img v-else class="currUserMess headerUrl" style="width: 120px;height: 120px; "  src="../../../../assets/ambuf/images/physician.png"  />
            <!--static/img/2017/07/14/20170714092405208.JPG-->
          </div>
          <el-row :gutter="20" class="row-bg">
            <el-col :span="6"><p><strong>课程名称:</strong>{{item.activityName}} </p></el-col>
            <el-col :span="6"><p><strong>授课地点:</strong>{{item.activitySite}} </p></el-col>
            <el-col :span="6"><p><strong>授课对象:</strong> {{trope(item.activityUserType)}} </p></el-col>
          </el-row>
          <el-row :gutter="20" class="row-bg">
            <el-col :span="6"><p><strong>课程类型:</strong>{{item.activityType}}  </p></el-col>
            <el-col :span="6"><p><strong>课程时间:</strong> {{item.activityTime}} </p></el-col>
            <el-col :span="6"><p><strong>授课老师:</strong> {{item.hostUserName}} </p></el-col>
          </el-row>
          <el-row :gutter="20" class="row-bg">
            <el-col :span="6"><p><strong>参加主体对象:</strong> {{item.participantSubject | participantSubject}} </p></el-col>
          </el-row>
          <el-row :gutter="20" class="row-bg">
            <el-col :span="18"><p><strong>课程内容:</strong>{{item.activityContent}}  </p></el-col>
          </el-row>
          <el-row  class="row-bg">
            <el-col :span="3"><p><strong>课前预习资料:</strong> </p></el-col>
            <el-col :span="19"><upload-file  :show="true" :uploadFiles="item.fileList"></upload-file></el-col>
          </el-row>
          <el-row  class="row-bg">
            <el-col :span="3"><p><strong>相关证明材料:</strong> </p></el-col>
            <el-col :span="19"><upload-file  :show="true" :uploadFiles="item.activityFileList"></upload-file></el-col>
          </el-row>
          <br>
          <hr>
          <br>
        </div>
        <div slot="reference" class="name-wrapper">
        </div>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],
    data (){
      return{
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置

        "data":[{
          "id":'',
          "depId":'',
          "depName":"",
          "activityName":"",
          "activityType":"",
          "hostUserId":'',
          "hostUserName":"",
          "activityTime":"",
          "activitySite":"",
          "activityUser":"",
          "whetherNeedCases":"",
          "casesName":"",
          "activityContent":"",
          "activityUserType":"",
          "activityUserTypeValue":"",
          "activityUserTypeValueName":"",
          "activityDepUserType":"",
          "shouldUserCount":'',
          "actuallyUserCount":'',
          "timeIds":"",
          "recordTimes":"",
          "activityState":"",
          "fileList":[],
          participantSubject:'ALL' //参加主体对象（默认ALL）(新增2017-11-13)(SXS-实习生、YJS-研究生、ZYY-住院医、JXS-进修生、ALL所有类型)
        }],
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.teachctivityGetList+'/'+this.operailityData.activityId,
          }
        },
        http:'',
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      let env = this.$store.getters.getEnvPath;
      this.http = env["http"]
    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.data = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
      },

      //转义
      trope(type){
        type = type.toLowerCase();
        switch(type){
          case 'rotarydep': type='轮转科室';
            break;
          case 'partuser': type='部分人员';
            break;
          case 'partrole': type='部分角色';
            break;
          case 'alluser': type='所有人员';
            break;
        }
        return type;

      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
    }
  }
</script>
