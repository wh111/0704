<template>
  <div>
    <el-form :model="data" ref="data" :rules="this.$store.state.rules.authority" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="科室 :" prop="name1">
            {{data.depName}}
          </el-form-item>
          <el-form-item label="活动名称 :" prop="name1">
            {{data.activityName}}
          </el-form-item>
          <el-form-item label="活动时间 :" prop="activityTime">
            {{data.activityTime}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型 :" prop="name4">
            {{data.activityType}}
          </el-form-item>
          <el-form-item label="授课老师 :" prop="name5">
            {{data.hostUserName}}
          </el-form-item>
          <el-form-item label="活动地点 :" prop="name6">
            {{data.activitySite}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计划 :" prop="name7">
            {{data.isPlan == 'Y'?'计划内':'计划外'}}
            <!--<span v-for="item in data.recordTimes" :key="item" >{{item+'  '}}</span>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参加主体对象:">
           {{data.participantSubject | participantSubject}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="时间段 :" prop="name7">
            {{data.activityTimeInfo}}
            <!--<span v-for="item in data.recordTimes" :key="item" >{{item+'  '}}</span>-->
          </el-form-item>
        </el-col>
      </el-row>
  <!--    <el-row>
        <el-col :span="12">
          <el-form-item label="病例 :" prop="whetherNeedCases">
            {{data.whetherNeedCases=='YES'?'需要':data.whetherNeedCases=='NO'?'不需要':data.whetherNeedCases}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="病例名称 :" prop="name7" v-if="data.whetherNeedCases=='YES'">
            {{data.casesName}}
          </el-form-item>
        </el-col>
      </el-row>-->
      <el-row>
        <el-col :span="24">
          <el-form-item label="活动内容 : " prop="name8">
            <div class="grid-content">
              <el-input type="textarea" :rows="6" readonly resize="none" v-model="data.activityContent"></el-input>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="参加人 :" prop="name9">
            {{data.activityUser}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="课件资料:">
            <upload-file :show="true" :uploadFiles="data.fileList" ></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" >
          <el-form-item label="相关证明材料:">
            <upload-file :show="true" :uploadFiles="data.activityFileList" ></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--选择人员-->

  </div>
</template>
<script>
  export default{
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],

    data(){
        return{

          //获取的数据
          "data":{},

          //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
          listMessTitle: {
            ajaxSuccess: 'oneDataSuccess',
            ajaxParams: {
              url: this.url.teachctivityGet+'/'+this.operailityData.id,
              params: {},
            }
          },
        }
      },
    mounted(){
      //暂时没有初始化,预留初始化入口
      this.init();
    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        this.ajax(this.listMessTitle)
      },


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * 注:当前为添加页面暂时未用到,属于预留
       * */
      oneDataSuccess(responseData){
        let data = responseData.data;
        if(data.activityUser){
            let tempUserTypeValueName = [];
          let activityUserTypeValueName =  data.activityUser.split(',');
          for(let i=0;i<activityUserTypeValueName.length;i++){
           if(activityUserTypeValueName[i]!='null') {
             tempUserTypeValueName.push(activityUserTypeValueName[i])
           }
          }
          data.activityUser=tempUserTypeValueName.join(',')
        }

        this.data = data;
      },


    }
  }
</script>
