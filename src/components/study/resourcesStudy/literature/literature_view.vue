<!----------------------------------
****--文档文献-查看列表(literature_index)
****--@date     2017/8/8
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <div class="video-type-box" v-if="!isStudyRecords">
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
              v-model="formValidate.title"
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
    <ppt v-if="docType=='ppt'">
      <div slot="header">
        <h2 style="text-align: center;">{{showListItem.title}}</h2>
        <div class="downLoadDoc">
        <el-row>
          <el-col :span="16" style="text-align: left">介绍：{{showListItem.brief}}</el-col>
          <el-col :span="6" :offset="2">上传人：{{showListItem.operator}}</el-col>
        </el-row>
        </div>
      </div>
    </ppt>
    <doc v-if="docType=='doc'">
      <div slot="header">
        <h2 style="text-align: center;padding: 15px 0;">{{showListItem.title}}</h2>
      </div>
    </doc>
    <xls v-if="docType=='xls'">
      <div slot="header">
        <h2 style="text-align: center;padding: 15px 0;">{{showListItem.title}}</h2>
      </div>
    </xls>
    <pdf v-if="docType=='pdf'&&showListItem.pdf!=''" :pdfSrc="showListItem.pdf">
      <div slot="header">
        <h2 style="text-align: center;padding: 15px 0;">{{showListItem.title}}</h2>
      </div>
    </pdf>
    <div class="downLoadDoc"><el-button type="primary" @click="downLoadFile(showListItem.pdf)" icon="arrow-down">下载</el-button></div>
    <chatteris v-if="showListItem.id!=''" :resourceId="showListItem.id" :types="'LITERATURE'"></chatteris>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../api.js"
  import ppt from "../../common/viewPPT.vue";
  import doc from "../../common/viewDoc.vue";
  import xls from "../../common/view_xls.vue";
  import pdf from "../../common/view_pdf.vue";
  import introduce from  "../../common/introduce.vue";
  import chatteris from "../../common/chatteris.vue";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData",'isStudyRecords'],
    data() {
      return {
        docType:"pdf",
        formValidate:{
          title:"",
        },
        showListItem: {
          "id":"",
          "typeId":"",
          "title":"",
          "brief":"",
          "tags":"",
          "fileId":"",
          "pdf":"",
          "imgs":"",
          "pageNum":"",
          "downloadNum":"",
          "viewNum":"",
          "operator":"",
          "operatorId":"",
          "createTime":"",
          "updateTime":""
        },
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url: api.literatureInfo.path+'/'+this.operailityData.id,
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
        this.showListItem.pdf = this.$store.state.envPath.http+data["pdf"];
      },
      downLoadFile(url){
          window.open(url);
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
      },
      pdfSrc(){
        let http = this.$store.state.envPath.http || "";
        return http+this.showListItem.pdf;
      }
    },
    mounted(){
    },
    components: {
      ppt,
      doc,
      xls,
      pdf,
      introduce,
      chatteris
    }
  }
</script>
<style>
  @import "../../../../assets/ambuf/css/videoStudy/default.css";
</style>
