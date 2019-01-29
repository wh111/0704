<!----------------------------------
****--医学图谱(medicalAtlas_list)
****--@date     2017/8/7
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <div class="video-type-box">
      <div class="video-title-left">
        <classMenu @menuClick="searchByDep" :useType="'hover'" :types="'ATLAS'"></classMenu>
      </div>
      <div class="video-title-right" style="width: 400px">
        <el-row >
          <el-col :span="24">
            <el-input
              style="width: 100%;"
              placeholder="请输入图谱名称"
              icon="search"
              v-model="formValidate.title"
              :on-icon-click="handleIconClick">
            </el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-if="tableData1.length>0" class="all-work-list">
      <div class="work-list-box">
        <div class="card-box" v-for="(item,index) in tableData1" :key="index">
          <div class="card-img">
            <a @click="showImgListItem(item)" href="javascript:void(0)" class="card-img-hover" target="_blank" z-st="home_main_card_cover">
              <img :src="http+item.img" />
            </a>
          </div>
          <div class="card-info">
            <p class="card-info-title">
              <a @click="showImgListItem(item)" href="javascript:void(0)" :title="item.title" class="title-content" target="_blank" z-st="home_main_card_title" style="width: 228px;">{{item.title}}</a>
            </p>
            <p class="card-info-item">浏览次数：{{item.viewNum}}</p>
            <!--<p class="card-info-item">
              <span class="statistics-view">标签1</span>
              <span class="statistics-comment">标签2</span>
              <span class="statistics-tuijian">标签3</span>
            </p>-->
          </div>
          <!--<div class="card-item">
            <span class="user-avatar showMemberCard">
                <a href="javascript:void(0)" title="何文通设计豆" target="_blank" z-st="home_main_card_user">何文通设计豆</a>
                <div class="author-info-card hide" data-id="769799"></div>
            </span>
            <span class="time" title="审核通过时间：2017-08-09 10:13:56；创建时间：2017-08-09 10:13:56">5小时前</span>
          </div>-->
        </div>
      </div>
    </div>
    <p style="padding: 50px 0;text-align: center;" v-else>
      目前还没有可学习的文档文献!
    </p>
    <!--<el-tabs v-model="activeName">
      <el-tab-pane name="first" label="心内科">
        <div class="all-work-list">
          <div class="work-list-box">
            <div class="card-box" v-for="item in 5">
              <div class="card-img">
                <a href="javascript:void(0)" class="card-img-hover" target="_blank" z-st="home_main_card_cover">
                  <img src="http://img.zcool.cn/community/00b25c598a6f9f0000002129acd2f0.jpg@260w_195h_1c_1e_1o_100sh.jpg" />
                </a>
              </div>
              <div class="card-info">
                <p class="card-info-title">
                  <a href="javascript:void(0)" title="【何文通每日一画】七天第四十四辑  " class="title-content" target="_blank" z-st="home_main_card_title" style="width: 228px;">【何文通每日一画】七天第四十四辑  </a>
                </p>
                <p class="card-info-item">
                  <span class="statistics-view">标签1</span>
                  <span class="statistics-comment">标签2</span>
                  <span class="statistics-tuijian">标签3</span>
                </p>
              </div>
              <div class="card-item">
        <span class="user-avatar showMemberCard">
            <a href="javascript:void(0)" title="何文通设计豆" target="_blank" z-st="home_main_card_user">何文通设计豆</a>
            <div class="author-info-card hide" data-id="769799"></div>
        </span>

                <span class="time" title="审核通过时间：2017-08-09 10:13:56；创建时间：2017-08-09 10:13:56">5小时前</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>-->
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
        activeName: 'first',
        formValidate: {
          title: "",
        },

        //列表、及分页属性
        isHashMore:true,
        tableData1:[
            /*{
          "id":1,
          "title":"测试标题1",
          "img":"www",
          "remark":"eee",
          "viewNum":2
        }*/
        ],
        listTotal:0,
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.atlasList.path,
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
            url: api.atlasList.path,
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

      showImgListItem(item){
        this.$emit('show', 'show',item);
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
