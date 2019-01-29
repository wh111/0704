<!----------------------------------
****--视频学习(videoStudy_list)
****--@date     2017/8/7
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div class="showContent">
    <div class="video-type-box" v-if="!isStudyRecords">
      <div class="video-title-left" style="padding-top:8px;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item @click.native="goBack">首页</el-breadcrumb-item>
          <!--<el-breadcrumb-item>呼吸内科</el-breadcrumb-item>-->
          <el-breadcrumb-item>{{serverData.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="video-title-right">
        <el-popover
          ref="popover"
          placement="bottom"
          width="200"
          trigger="hover">
          <Timeline pending v-if="recordData.length>0">
            <Timeline-item v-for="(item,index) in recordData" :key="index">{{item.updateTime | formatTime('') }}：<el-button type="text">{{item.title}}</el-button>({{item.status==0?'学习中':'完成'}})</Timeline-item>
            <!--<Timeline-item>1分钟前：<el-button type="text">内科视频</el-button></Timeline-item>
            <Timeline-item>3小时前：<el-button type="text">内科视频</el-button></Timeline-item>
            <Timeline-item>2天前：<el-button type="text">内科视频</el-button></Timeline-item>-->
          </Timeline>
          <p style="text-align: center;padding: 30px 0;" v-else>还没有学习记录!</p>
        </el-popover>
        <el-row style="float: right">
          <el-col :span="10">
            <el-input
              placeholder="视频资源名称"
              icon="search"
              v-model="formValidate.name"
              :on-icon-click="handleIconClick">
            </el-input>
          </el-col>
          <el-col :span="8" :offset="2">
            <!--<el-button v-popover:popover>记录</el-button>-->
            <!--<el-button>收藏</el-button>-->
          </el-col>
          <el-col :span="4" :offset="1">
          <el-button type="primary" icon="arrow-left" @click="goBack">返回</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--<showVideo :videoType="'mp4'"></showVideo>-->
    <div v-if="serverData.id!=''">
      <div style="width: 100%;height: 500px;margin-top: 10px">
        <showVideo v-if="videoOptions.filePath!=''"  style="height:100%;" :currentTime="currentTime" @ended="videoEnded" @currentTime="videoCurrentTime"  :filePath="videoOptions.filePath" :videoType="videoOptions.videoType"></showVideo>
        <p v-else>数据加载失败……</p>
      </div>
      <introduce :content="serverData.remark"></introduce>
      <chatteris v-if="serverData.id!=''" :resourceId="serverData.id" :types="'VIDEO'"></chatteris>
    </div>
    <p v-else style="text-align: center;padding-top: 50px">数据加载失败!</p>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import showVideo from "../../../common/video.vue";
  import introduce from "../../common/introduce.vue";
  import chatteris from "../../common/chatteris.vue";
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData",'isStudyRecords'],
    data() {
      return {
        time:0,// 播放时长  10秒更新一次
        upDateTime:10,
        formValidate: {
          "name":"",
        },
        currentTime:0,

        serverData:{
          "id":"",
          "typeId":"",
          "name":"",
          "tags":"",
          "length":"",
          "size":"",
          "count":"",
          "remark":"",
          "fileId":"",
          "fileName":"",
          "filePath":"",
          "logoPath":"",
          "imgsPath":"",
          "likes":"",
          "disLikes":"",
          "operatorId":"",
          "operator":"",
          "createTime":"",
          "updateTime":"",
          "auditStatus":"",
          "publishStatus":"",
          "openStatus":""
        },

        videoRules:["mp4","ogg","webm"],

        //视频中用到的参数
        videoOptions:{
          filePath:"",
          videoType:"mp4"
        },

        //查询学习记录
        recordData:[
          /*{
           "id":18,
           "title":"title测试",
           "types":"VIDEO",
           "createTime":"",
           "updateTime":"",
           "status":0
           },*/
        ],
        searchRecordsTitle:{
          ajaxSuccess:'getRecordsData',
          ajaxParams:{
            url: api.userHistoryInfo.path,
            params:{
              types:'VIDEO',curPage:1,pageSize:5,
            }
          }
        },

        //saveProgress  上传进度
        saveProgressTitle:{
          ajaxSuccess:'videoSuccess',
            ajaxParams:{
              url: api.saveProgress.path,
              method:api.saveProgress.method,
              data:{
                videoId:'',
                times:"",
                status:'0',
            }
          }
        },


        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url: api.videoInfo.path+'/'+this.operailityData.id,
          }
        }
      }
    },
    methods: {

      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.serverData=data;
        let suffix = this.getFileName(data.filePath);
        if(this.videoRules.indexOf(suffix)){
          this.showMess("不支持的视频格式("+suffix+")!");
        }
        if(data.progress!=data.length){
          this.currentTime = +data.progress; // 开始播放时长
        }

        this.saveProgressTitle.ajaxParams.data.videoId = data.id;
        this.videoOptions.videoType = suffix;
        this.videoOptions.filePath = this.$store.state.envPath.videoHost+data.filePath;
      },

      //获取学习记录
      getRecordsData(responseData){
        let data = responseData.data;
        this.recordData=[];
        //最多显示5条播放记录
        this.recordData = data.splice(0,5);
      },

      getFileName(o){
        let len = o.lastIndexOf(".");
        let str = o.substring(len+1,o.length);
        str = str.toLowerCase();
        return str;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
        this.ajax(this.searchRecordsTitle);
      },

      handleIconClick(ev) {
        this.$emit("search",'index',{name:this.formValidate.name})
      },
      goBack(){
        this.$emit('show', 'index',{});
      },

      videoCurrentTime(time){
        this.saveProgressTitle.ajaxParams.data.times = parseInt(time)||'0';
//        if(time-this.time>this.upDateTime||time<this.time){
        if(time-this.time>this.upDateTime){
          this.saveProgressTitle.ajaxParams.data.status = '0';
          this.time = time;
          this.ajax(this.saveProgressTitle)
        }
      },

      videoSuccess(){


      },

      //视频播放结束
      videoEnded(time){
        if(this.serverData.length){
          this.saveProgressTitle.ajaxParams.data.times = this.serverData.length||0;
        }
        this.saveProgressTitle.ajaxParams.data.status = 1;
        this.ajax(this.saveProgressTitle)
      },

    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {
      showVideo,
      introduce,
      chatteris
    }
  }
</script>
<style>
  @import "../../../../assets/ambuf/css/videoStudy/default.css";
</style>
