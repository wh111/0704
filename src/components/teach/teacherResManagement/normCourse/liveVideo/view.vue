<template>
  <!-- 直播 -->
  <div>
      <!--<div style="font-size: 18px;text-align: center"><el-button v-if="hasLive==1">正在上课时间</el-button><el-button v-if="hasLive==2">非授课时间</el-button></div>-->
    <!--有直播-->
    <liveBase :speakData="speakData" v-if="hasLive==1" @sendMes="getList"  :courseId="courseId" :liveData="getData"  :isManagement="false"  style="height:470px;">
      <div slot="left" >
        <div style="height:280px;">
          <videojsLive v-if="getData.liveStream" style="height:100%;" :liveUrl="getData.liveStream" ></videojsLive>
        </div>
      </div>
      <div slot="right">
        <msgList @speak="speak" ref="msgList" style="height:470px;" :courseId="courseId" :liveData="getData"></msgList>
      </div>
    </liveBase>
    <no-live style="height:470px;" v-if="hasLive==2"  :courseId="courseId"></no-live>
    <div v-if="hasLive==''" style="line-height: 100px;font-size: 25px;text-align: center">
      加载中
    </div>
  </div>
</template>

<script>
  import videojsLive from '../../../../common/videojsLive.vue';//直播列表
  import noLive from './noLive.vue';   //无直播
  import api from './api'
  import msgList from './liveVideo_msgList.vue' //消息列表
  import liveBase from './liveVideo_layout.vue';//直播布局
  export default {
    data() {
      return {
        courseId:'', //courseId
        listMessTitle:{
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.get.path,
            params: {
              courseId:'',
            }
          }
        },
        speakData:'',  // 获取禁言的数据
        hasLive:'',  //当前是否有直播 1 有 2 没有
        getData:{},
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        let id =  this.$store.state.curriculum.look.course.id;
        this.courseId = id;
        this.listMessTitle.ajaxParams.params.courseId = this.$store.state.curriculum.look.course.id;
        this.ajax(this.listMessTitle);
//        this.updateListData();
      },

      updateListData(res){
          let data = res.data;
          if(!data) return;
          if(data.hasLive){
            this.hasLive = '1';
          }else {
            this.hasLive = '2';
          }
          if(data.live){
//            http://192.168.1.116:8999/
            data.live.liveStream = data.live.liveStream.replace(/\w+:\/\/\d+.\d+.\d+.\d+:\d+/,'');
            console.log(data.liveStream);
            this.getData =data.live;
          }

      },

      //获取聊天列表数据
      getList(){

//        this.$refs.msgList.getData()
      },


      //获取是否禁止发言的数据
      speak(data){
        this.speakData = data;

      }
    },
    created(){
      this.init();
    },
    mounted(){
    },

    components: {
      liveBase,msgList,videojsLive,noLive
    },
  }

</script>

<style>
  /* 直播 */

</style>
