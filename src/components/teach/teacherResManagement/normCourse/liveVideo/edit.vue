<!--直播管理-->
<template>
  <!-- 直播 -->
  <div>
    <!--<div style="font-size: 18px;text-align: center"><el-button v-if="hasLive==1">正在上课时间</el-button><el-button v-if="hasLive==2">非授课时间</el-button></div>-->
    <!--有直播-->
    <liveBase :speakData="speakData" v-if="hasLive==1" @sendMes="getList" :courseId="courseId" :liveData="getData" :isManagement="true" style="height:510px;">
      <div slot="left">
        <div style="height:320px;">
          <!--<videojsLive v-if="getData.liveStream" :liveUrl="'http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8'" ></videojsLive>-->
          <!--<videojsLive  :liveUrl="'http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8'" ></videojsLive>-->
          <keep-alive>
            <hkVideo :courseId="courseId" v-if="liveList!=0" :liveList="liveList" :getData="getData" width="540" height="290" :count="count" :isShowRight="true" :ip="formValidate.ip" :port="formValidate.port" :nvrIp="formValidate.nvrIp" :loginName="formValidate.loginName" :password="formValidate.password"></hkVideo>
          </keep-alive>
        </div>
      </div>

      <div slot="right">
        <msgList :isManagement="true" @speak="speak" ref="msgList" style="height:510px;" :courseId="courseId" :liveData="getData"></msgList>
      </div>
    </liveBase>
    <no-live style="height:510px;" v-if="hasLive==2" :courseId="courseId"></no-live>
    <div v-if="hasLive==''" style="line-height: 100px;font-size: 25px;text-align: center">
      加载中
    </div>
  </div>
</template>

<script>
  import hkVideo from "./hkVideo.vue"
  import videojsLive from '../../../../common/videojsLive.vue'; //直播列表
  import noLive from './noLive.vue'; //无直播
  import api from './api'
  import msgList from './liveVideo_msgList.vue' //消息列表
  import liveBase from './liveVideo_layout.vue'; //直播布局
  export default {
    data() {
      return {
        courseId: '', //courseId
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.get.path,
            params: {
              courseId: '',
            }
          }
        },
        count: 0,
        liveList: [
          //         {"ip":"192.168.1.2","port":80,"loginName":'admin',"password":'admin12345',"isShowRight":false,"count":0},
          //          {"ip":"192.168.1.3","port":80,"loginName":'admin',"password":'admin12345',"isShowRight":false,"count":0},
          //          {"ip":"192.168.1.8","port":80,"loginName":'admin',"password":'admin12345',"isShowRight":false,"count":0},
          //          {"ip":"192.168.1.9","port":80,"loginName":'admin',"password":'admin12345',"isShowRight":false,"count":0},
          //          {"ip":"192.168.1.7","port":80,"loginName":'admin',"password":'admin12345',"isShowRight":false,"count":0},
          //          {"ip":"192.168.1.4","port":80,"loginName":'admin',"password":'admin12345',"isShowRight":false,"count":0},
        ],
        formValidate: {
          //          brand: 'HIKVISION', // 品牌
          //          modelNum: 'HIKVISION', // 产品型号
          //          ip: '192.168.1.2', // 设备ip
          //          isConsole: 'YES', // 是否有云台
          //          loginName: 'admin', // 登录名
          //          password: 'admin12345', // 密码
          //          nvrIp: '192.168.1.64', // 所在nvrIp
          //          port: '80', //通道号
        },

        getRoomCamera: {
          ajaxSuccess: 'getRoomCameraList',
          ajaxParams: {
            url: api.camera.path, //房间id
            params: {
              id: 2
            }
          }
        },
        speakData: '', // 获取禁言的数据
        hasLive: '', //当前是否有直播 1 有 2 没有
        getData: {},
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        let id = this.$store.state.curriculum.look.course.id;
        this.courseId = id;
        this.listMessTitle.ajaxParams.params.courseId = this.$store.state.curriculum.look.course.id;
        this.ajax(this.listMessTitle);
        //        this.updateListData();
      },

      updateListData(res) {
        let data = res.data;

        if (!data) return;
        if (data.hasLive) {
          this.hasLive = '1';
        } else {
          this.hasLive = '2';
        }
        if (data.live) {
          this.getData = data.live;
          this.getRoomCamera.ajaxParams.params.id = data.live.roomId;
          this.ajax(this.getRoomCamera);
        }


      },

      getRoomCameraList(res) {
        let data = res.data;
        if (!data) return;
        if (data == 0) {
          this.showMess('当前房间没有摄像头')
        }

        this.liveList = data;

      },

      //获取聊天列表数据
      getList() {

        //        this.$refs.msgList.getData()
      },

      //获取是否禁止发言的数据
      speak(data) {
        this.speakData = data;

      }

    },
    created() {
      this.init();
    },
    mounted() {},

    components: {
      liveBase,
      msgList,
      videojsLive,
      noLive,
      hkVideo
    },
  }

</script>

<style>
  /* 直播 */

</style>
