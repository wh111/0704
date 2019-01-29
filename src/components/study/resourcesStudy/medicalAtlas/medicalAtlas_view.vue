<!----------------------------------
****--医学图谱(medicalAtlas_list)
****--@date     2017/8/7
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div class="showContent">
    <div class="video-type-box"  v-if="!isStudyRecords">
      <div class="video-title-left" style="padding-top:8px;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item @click.native="goBack">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{showListItem.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="video-title-right">
        <el-row>
          <el-col :span="18">
            <el-input
              placeholder="请输入文档文献名称"
              icon="search"
              v-model="formValidate.name"
              :on-icon-click="handleIconClick">
            </el-input>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="4">
            <el-button type="primary" icon="arrow-left" @click="goBack">返回</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <viewPPT v-if="docImages.length>0" @showIntro="showIntro" :docImages="docImages">
      <h2 slot="header">{{showListItem.title}}</h2>
    </viewPPT>
    <div slot="content" style="margin: 0 auto; width: 1000px;">
      {{imgIntro[currIntro]}}
    </div>
    <chatteris v-if="showListItem.id!=''" :resourceId="showListItem.id" :types="'ATLAS'"></chatteris>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  import api from "../api.js"
  import viewPPT from "../../../study/common/viewPPT.vue";
  import introduce from  "../../common/introduce.vue";
  import chatteris from "../../common/chatteris.vue";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData",'isStudyRecords'],
    data() {
      return {
        formValidate:{
          title:"",
        },
        showListItem: {
          "id":"",
          "typeId":"",
          "title":"",
          "tags":"",
          "img":"",
          "remark":"",
          "viewNum":"",
          "operator":"",
          "operatorId":"",
          "updateTime":"",
          "atlasImgsDtoList":[]
        },

        docImages:[],
        imgIntro:[],
        currIntro:0,

        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url: api.atlasInfo.path+'/'+this.operailityData.id,
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
        this.showListItem=data;
        this.docImages = [];
        this.imgIntro = [];
        for(var i=0,item;i<data["atlasImgsDtoList"].length;i++){
          item = data["atlasImgsDtoList"][i];
          this.docImages.push(this.$store.state.envPath.http+item.img);
          this.imgIntro.push(item.remark);
        }
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },

      handleIconClick(ev) {
        this.$emit("search",'index',{name:this.formValidate.title})
      },

      /**
       * 切换图片介绍
       * @param idx  当前选中图片的索引
       */
      showIntro(idx){
        this.currIntro = idx;
      },

      goBack(){
        this.$emit('show', 'index',{});
      }
    },
    created(){
      this.init();
    },
    computed:{
      http(){
        let http = this.$store.state.envPath.http || "";
        return http;
      }
    },
    mounted(){},
    components: {
      viewPPT,
      introduce,
      chatteris,
    }
  }
</script>
<style>
  @import '../../../../assets/ambuf/css/manage_v1.0/swiper.css';
</style>
