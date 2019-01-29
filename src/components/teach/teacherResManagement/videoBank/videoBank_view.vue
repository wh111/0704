<!----------------------------------
****--查看-病历库(resCaseLibrary_add)
****--@date     2017/8/4
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div class="showContent">
    <div class="video-type-box" style="text-align: center">
      <h2>{{formValidate.name}}</h2>
    </div>
    <div style="width: 100%;height: 500px">
      <showVideo v-if="videoOptions.filePath!=''" :filePath="videoOptions.filePath" :videoType="videoOptions.videoType"></showVideo>
      <p v-else>正在加载中……</p>
    </div>
    <introduce :content="formValidate.remark"></introduce>
    <chatteris v-if="formValidate.id!=''" :resourceId="formValidate.id" :types="'VIDEO'"></chatteris>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import showVideo from "../../../common/video.vue";
  import introduce from "../../../study/common/introduce.vue";
  import chatteris from "../../../study/common/chatteris.vue";
  import api from "./api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData"],
    data() {
      return {
        formValidate: {
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

        //视频中用到的参数
        videoOptions:{
          filePath:"",
          videoType:"mp4"
        },

        videoRules:["mp4","ogg","webm"],

        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url: api.get.path+'/'+this.operailityData.id,
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
        this.formValidate=data;
        let suffix = this.getFileName(data.filePath);
        if(this.videoRules.indexOf(suffix)){
          this.showMess("不支持的视频格式("+suffix+")!");
        }
        this.videoOptions.videoType = suffix;
        this.videoOptions.filePath = this.$store.state.envPath.videoHost+data.filePath;
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
      },
      cancel(){
        this.$emit('cancel','show');
      }

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
