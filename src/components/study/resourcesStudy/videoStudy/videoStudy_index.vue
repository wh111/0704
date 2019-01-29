<!----------------------------------
****--视频学习(videoStudy_list)
****--@date     2017/8/7
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
<div>
  <div class="video-type-box">
    <div class="video-title-left">
      <classMenu @menuClick="searchByDep" :useType="'hover'" :types="'VIDEO'"></classMenu>
      <!--<a class="videoHome-type">
        分类
        <div class="videoHome-type-content">
          <ul class="videoHome-type-content-list">
            <li>
              内科<i class="el-icon-arrow-right arrow-right"></i>
              <div class="videoHome-type-subContent">
                <div class="videoHome-type-subContent-title">
                  内科
                </div>
                <div class="videoHome-type-subContent-typesBox">
                  <dl class="videoHome-type-subContent-types">
                    <dd @click="searchByDep(12)">心血管内科</dd>
                    <dd>心血管内科</dd>
                    <dd>心血管内科</dd>
                    <dd>心血管内科</dd>
                    <dd>心血管内科</dd>
                    <dd>心血管内科</dd>
                  </dl>
                </div>
              </div>
            </li>
            <li>外科<i class="el-icon-arrow-right arrow-right"></i></li>
            <li>儿科<i class="el-icon-arrow-right arrow-right"></i></li>
            <li>妇产科<i class="el-icon-arrow-right arrow-right"></i></li>
            <li>保健<i class="el-icon-arrow-right arrow-right"></i></li>
          </ul>
        </div>
      </a>-->
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
        <el-col :span="12">
          <el-input
            placeholder="视频资源名称"
            icon="search"
            v-model="formValidate.name"
            :on-icon-click="handleIconClick">
          </el-input>
        </el-col>
        <el-col :span="10" :offset="2">
          <!--<el-button v-popover:popover>记录</el-button>-->
          <!--<el-button>收藏</el-button>-->
        </el-col>
      </el-row>

    </div>
  </div>
  <div class="videoHome-list-sort">
    <el-radio-group @change="sort" v-model="sortFeild">
      <el-radio-button label="DEFAULT">综合排序</el-radio-button>
      <el-radio-button label="NEWS">最新发布</el-radio-button>
      <el-radio-button label="VIEWNUM">最多播放</el-radio-button>
    </el-radio-group>
  </div>
  <div class="videoHome-list">
    <div v-if="tableData1.length>0" class="videoHome-list-item" v-for="item in tableData1">
      <div class="videoHome-list-item-img">
        <img :src="http+item.logoPath" alt="">
        <el-button @click="playerVideo(item)" class="btn" type="primary" icon="caret-right"></el-button>
        <div class="playerBox"></div>
      </div>
      <div class="videoHome-list-item-mess">
        <el-row>
          <el-col :span="14"><div class="videoHome-list-item-name overflow-txt1" title="视频名称视频名称视频名称">{{item.name}}</div></el-col>
          <el-col :span="10" style="text-align: right;">{{item.viewNum==''?0:item.viewNum}}次学习</el-col>
        </el-row>
        学习进度:
        <el-row>
          <el-col :span="24">
            <el-progress :percentage="Math.floor((isNaN(item.progress/item.length)||!isFinite(item.progress/item.length)?0:(item.progress/item.length))*100)"></el-progress>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-if="tableData1.length==0" style="height: 200px;text-align: center;padding: 100px;">还没有上传学习视频!</div>
  </div>
  <div v-if="tableData1.length>0" class="showMore">
    <el-button v-if="isHashMore" @click="next" type="text">查看更多视频>></el-button>
    <span v-if="!isHashMore">已经没有更多视频可查看!</span>
  </div>
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
      look: "index",
      formValidate: {
        name: this.initData.name,
      },

      //当前时间
      currTime:0,

      //视频列表、及分页属性
      isHashMore:true,
      tableData1:[
          /*{
        "id":3,
        "name":"1",
        "length":100,
        "size":1,
        "count":1,
        "logoPath":"1",
        "likes":1,
        "viewNum":0,
        "disLikes":3,
        "operator":"张三",
        "progress":55.66,
        "updateTime":"2017-05-02 2:2:2"
      }*/
      ],
      listTotal:0,
      listMessTitle:{
        ajaxSuccess:'updateListData',
        ajaxParams:{
          url: api.videoList.path,
          params:{
            typeId:'',name:'',sortby:'',order:'',
          }
        }
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

      //排序
      sortFeild:"DEFAULT",

      //分类
      type:"",
    }
  },
  methods: {
    //初始化请求列表数据
    init(){
      Util = this.$util;
      this.currTime = this.parseTimestamp(new Date());
      //ajax请求参数设置
      this.myPages =  Util.pageInitPrams;

      this.queryQptions = {
        params:{curPage: 1,pageSize: Util.pageInitPrams.pageSize}
      }
      this.listMessTitle.ajaxParams.params["sortby"]=this.sortFeild;
      this.setTableData();
      this.ajax(this.searchRecordsTitle)
    },


    //获取学习记录
    getRecordsData(responseData){
      let data = responseData.data;
      this.recordData=[];
      //最多显示5条播放记录
      this.recordData = data.splice(0,5);
    },
    //下一页
    next(){
      this.queryQptions.params.curPage+=1;
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
      this.tableData1=this.tableData1.concat(data) ;
//      this.tableData1= data;
       if(this.tableData1.length==responseData.totalCount){
        this.isHashMore = false;
       }
      this.listTotal = responseData.totalCount || 0;
    },


    //排序
    sort(val){
      this.listMessTitle.ajaxParams.params["sortby"]=val;
      this.initList()
      this.setTableData();
    },


    handleIconClick(ev) {
      this.setTableData();
    },

    initList(){
      this.isHashMore = true;
      this.tableData1=[];
      this.queryQptions = {
        params:{curPage: 1,pageSize: Util.pageInitPrams.pageSize}
      }
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
        url: api.videoList.path,
          method: 'get'
      }
    }
      showMoreTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.params);
      this.ajax(showMoreTitle);
    },


    //分类查询
    searchByDep(classItem){
      this.listMessTitle.ajaxParams.params["typeId"]=classItem.id;
      this.initList()
      this.setTableData();
    },

    playerVideo(item){
      this.$emit('show', 'show',item);
    }
  },
  computed:{
    http(){
      let http = this.$store.state.envPath.http || "";
      return http;
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
