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
          <el-form-item label="应到人数:" prop="activityTime">
            {{data.shouldUserCount}}
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
          <el-form-item label="签到人数:" prop="name6">
            {{data.actuallyUserCount}}
          </el-form-item>
          <el-form-item label="参加主体对象:">
            {{data.participantSubject | participantSubject}}
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
          /*"id":1,
          "depId":2,
          "depName":"内科",
          "activityName":"教学查房",
          "activityType":"理论",
          "hostUserId":2,
          "hostUserName":"张三",
          "activityTime":"2017-03-31",
          "activitySite":"教学楼三楼301室",
          "activityUser":"呼吸科-住院医师",
          "whetherNeedCases":"YES",
          "casesName":"穿刺术",
          "activityContent":"活动内容",
          "activityUserType":"rotarydep",
          "activityUserTypeValue":"2,3, 4",
          "activityUserTypeValueName":"呼吸内科,消化内科, 血液内科",
          "activityDepUserType":"",
          "shouldUserCount":30,
          "actuallyUserCount":10,
          "timeIds":"1,2,3",
          "recordTimes":"8:00-9:00,10:00-11:00，11:10-12:00",
          "signTime":"2017-03-31 10:10:05",
          "activityState":"nosubmit",
          "fileList":[
            {
              "fileId":"2",
              "fileName":"文件名称",
              "fileUrl":"www.baidu.com/",
              "fileType":"txt"
            }
           participantSubject:'ALL' //参加主体对象（默认ALL）(新增2017-11-13)(SXS-实习生、YJS-研究生、ZYY-住院医、JXS-进修生、ALL所有类型)

          ]*/
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:this.url.teachctivityGet+'/'+this.operailityData.id,
            params:{}
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
