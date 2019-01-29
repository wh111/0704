<template>
  <div class="showContent">

    <!--文档文献-->
    <literature :operailityData="operailityData" :isStudyRecords="true" v-if="operailityData.types=='LITERATURE'"></literature>
    <!--病例学习-->
    <caseStudy :operailityData="operailityData"  :isStudyRecords="true" v-if="operailityData.types=='CASES'"> </caseStudy>
    <!--医学图谱-->
    <medicalAtlas :operailityData="operailityData" :isStudyRecords="true" v-if="operailityData.types=='ATLAS'"></medicalAtlas>
    <!--videoStudy-->
    <videoStudy :operailityData="operailityData" :isStudyRecords="true" v-if="operailityData.types=='VIDEO'"></videoStudy>
  </div>
</template>
<script>
  /*引入--文档文献--  */
  import literature from "../literature/literature_view.vue";
  /*引入--病例学习 --*/
  import caseStudy from '../caseStudy/caseStudy_view.vue'
  /*引入--医学图谱 --*/
  import medicalAtlas from '../medicalAtlas/medicalAtlas_view.vue'
  /*引入--视频学习 --*/
  import videoStudy from '../videoStudy/videoStudy_view.vue'
  import api from "../api.js";
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

//        listMessTitle:{
//          ajaxSuccess:'SuccessGetCurrData',
//          ajaxParams:{
//            url: api.get.path+'/'+this.operailityData.id,
//          }
//        }
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
        this.videoOptions.filePath = this.$store.state.envPath.videoHost+data.filePath;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
       // this.ajax(this.listMessTitle);
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
      literature,
      caseStudy,
      medicalAtlas,
      videoStudy,
    }
  }
</script>
<style>
  @import "../../../../assets/ambuf/css/videoStudy/default.css";
</style>
