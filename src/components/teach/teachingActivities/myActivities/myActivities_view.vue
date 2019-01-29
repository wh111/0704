<!--档案查看-->
<template>
  <div>
    <el-form :model="data" ref="data" :rules="this.$store.state.rules.authority" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="课程名称:" prop="name1">
            {{data.activityName}}
          </el-form-item>
          <el-form-item label="课程类型:" prop="name1">
            {{data.activityType}}
          </el-form-item>
          <el-form-item label="日期:" prop="activityTime">
            {{data.activityTime}}
          </el-form-item>
          <el-form-item label="课程内容:" prop="activityTime">
            {{data.activityContent}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授课地点:" prop="name4">
            {{data.activitySite}}
          </el-form-item>
          <el-form-item label="授课老师:" prop="name5">
            {{data.hostUserName}}
          </el-form-item>
          <el-form-item label="上课时间:" prop="name6">
            {{data.activityTimeInfo}}
          </el-form-item>
          <el-form-item label="签到时间:" prop="name6">
            {{data.signTime}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="课件资料:" prop="name7">
            <upload-file  :show="true" :uploadFiles="data.fileList"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="相关证明材料:" prop="name7">
            <upload-file  :show="true" :uploadFiles="data.activityFileList"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>


    </el-form>
  </div>
</template>
<script>
  export default {
    props:["operailityData",'url'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        activeName: 'first',
        isShowUpload:true,

        //获取到的数据
        "data":{
         /* "id":'',
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
          "activityUserTypeValueName":'',
          "activityDepUserType":"",
          "shouldUserCount":'',
          "actuallyUserCount":'',
          "timeIds":"",
          "recordTimes":"",
          "signTime":"",
          "activityState":"",
          "fileList":[
            {
              "fileId":"",
              "fileName":"",
              "fileUrl":"",
              "fileType":""
            }
          ]*/
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:this.url.useractivity+'/'+this.operailityData.id,
            params:{
            }
          }
        },
      };
    },
    created(){
      this.init();
    },
    methods: {
      init(){
        this.ajax(this.listMessTitle)
      },
      listenSubEvent(){

      },

      updateListData(res){
          this.data = res.data

      },


      handleClick(tab, event) {
        //console.log(tab, event);
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.showMessTitle.type);
      },
    }
  };
</script>
