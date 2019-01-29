<!----------------------------------
****--文档文献-首页列表(literature_index)
****--@date     2017/8/8
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
<div>
  <div class="video-type-box">
    <div class="video-title-left">
      <classMenu @menuClick="searchByDep" :useType="'hover'" :types="'LITERATURE'"></classMenu>
    </div>
    <div class="video-title-right" style="width: 400px">
      <el-row >
        <el-col :span="24">
          <el-input
            style="width: 100%;"
            placeholder="文档文献名称"
            icon="search"
            v-model="formValidate.title"
            :on-icon-click="handleIconClick">
          </el-input>
        </el-col>
      </el-row>
    </div>
  </div>
  <div v-if="tableData1.length>0" v-for="(item,index) in tableData1" :key="index" class="c-container">
    <h3 class="t">
      <span class="c-icon c-gap-icon-right-small" :class="[api.fileType(item.fileType)]"></span><a @click="showDoc(item)" class="docTitleA" href="javascript:void(0)">{{item.title}}</a>
    </h3>
    <div class="c-abstract overflow-txt">
      {{item.brief}}
    </div>
    <div class="f13">
      <em>{{conductDate(item.updateTime)}}</em> | <em>共{{item.pageNum}}页</em> | <em>浏览{{!item.viewNum?0:item.viewNum}}次</em> | <em>贡献者：{{item.operator}}</em>
    </div>
  </div>
  <p v-if="tableData1.length==0" style="padding-top: 50px;text-align: center;">
    还没有上传文档文献!
  </p>
  <div v-if="tableData1.length>0" class="showMore">
    <el-button v-if="isHashMore" type="text">查看更多文献文档>></el-button>
    <span v-if="!isHashMore">已经没有更多文献文档可查看!</span>
  </div>
  <!--<div class="c-container">
    <h3 class="t">
      <span class="c-icon c-icon-doc c-gap-icon-right-small"></span><a class="docTitleA" href="javascript:void(0)">参考文献 文档_百度文库</a>
    </h3>
    <div class="c-abstract overflow-txt">
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
    </div>
    <div class="f13">
      <em>2017-05-01</em> | <em>共18页</em> | <em>61次下载</em> | <em>贡献者：czk0370</em>
    </div>
  </div>
  <div class="c-container">
    <h3 class="t">
      <span class="c-icon c-icon-ppt c-gap-icon-right-small"></span><a class="docTitleA" href="javascript:void(0)">参考文献 文档_百度文库</a>
    </h3>
    <div class="c-abstract overflow-txt">
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
    </div>
    <div class="f13">
      <em>2017-05-01</em> | <em>共18页</em> | <em>61次下载</em> | <em>贡献者：czk0370</em>
    </div>
  </div>
  <div class="c-container">
    <h3 class="t">
      <span class="c-icon c-icon-pdf c-gap-icon-right-small"></span><a class="docTitleA" href="javascript:void(0)">参考文献 文档_百度文库</a>
    </h3>
    <div class="c-abstract overflow-txt">
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
      <span class=" newTimeFactor_before_abs m">2014年12月25日&nbsp;-&nbsp;</span>在线互动式<em>文档</em>分享平台,在这里,您可以和千万网友分享自己手中的<em>文档</em>,全文阅读其他用户的<em>文档</em>,同时,也可以利用分享<em>文档</em>获取的积分下载<em>文档</em>
    </div>
    <div class="f13">
      <em>2017-05-01</em> | <em>共18页</em> | <em>61次下载</em> | <em>贡献者：czk0370</em>
    </div>
  </div>-->
</div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../api.js";
  import classMenu from "../../common/menu.vue";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["initData"],
    data() {
      return {
        api,
        formValidate: {
          title: this.initData.name,
        },

        //视频列表、及分页属性
        isHashMore:true,
        tableData1:[
            /*{
          "id":3,
          "title":"1",
          "brief":1,
          "pageNum":1,
          "downloadNum":1,
          "operator":"张三",
          "operatorId":1,
          "fileType":"doc",
          "updateTime":"1"
        }*/
        ],
        listTotal:0,
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.literatureList.path,
            params:{
              typeId:'',title:'',sortby:'',order:'',
            }
          }
        },

        //分类
        type:"",
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          params:{curPage: 1,pageSize: Util.pageInitPrams.pageSize}
        }
        this.listMessTitle.ajaxParams.params["sortby"]=this.sortFeild;
        this.setTableData();
      },


      setTableData(params){
        this.setAjaxParams();
        this.ajax(this.listMessTitle);
      },


      //设置提交的参数
      setAjaxParams(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params,this.formValidate);
      },


      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData1=[];
        this.tableData1= data;
        if(this.tableData1.length==responseData.totalCount){
          this.isHashMore = false;
        }
        this.listTotal = responseData.totalCount || 0;
      },


      //排序
      sort(val){
        this.listMessTitle.ajaxParams.params["sortby"]=val;
        this.setTableData();
      },


      handleIconClick(ev) {
        this.setTableData();
      },


      //点击更多评论
      queryMore(){
        let num = this.queryQptions.curPage;
        this.queryQptions={
          curPage: ++num,
          pageSize: 10
        }

        //this.ajax(this.listMessTitle);
        //查看更多
        let showMoreTitle = {
          ajaxSuccess: (responseData) => {
            let data = responseData.data;
            if(this.tableData1.length==responseData.totalCount){
              this.isHashMore = false;
            }
            this.listTotal = responseData.totalCount || 0;
          },
          errorTitle: '加载更多失败!',
          ajaxParams: {
            url: api.literatureList.path,
            method: 'get'
          }
        }
        showMoreTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.params);
        this.ajax(showMoreTitle);
      },


      //分类查询
      searchByDep(classItem){
        this.listMessTitle.ajaxParams.params["typeId"]=classItem.id;
        this.setTableData();
      },
      showDoc(item){
        this.$emit('show', 'show',item);
      }
    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {
      classMenu
    }
  }
</script>
<style>
  @import "../../../../assets/ambuf/css/videoStudy/default.css";
</style>
