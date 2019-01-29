<!----------------------------------
****--病例学习(caseStudy_list)
****--@date     2017/8/7
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <div class="video-type-box">
      <div class="video-title-left">
        <classMenu @menuClick="searchByDep" :useType="'hover'" :types="'CASES'"></classMenu>
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
                      <dd @click="searchByDep">心血管内科</dd>
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
      <div class="video-title-right" style="width: 400px">
        <el-row >
          <el-col :span="24">
            <el-input
              style="width: 100%;"
              placeholder="请输入病例学习名称"
              icon="search"
              v-model="formValidate.title"
              :on-icon-click="handleIconClick">
            </el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <div v-if="tableData1.length>0" v-for="(item,index) in tableData1" :key="index" class="caseListBox" @click="showList(item)">
        <div class="caseListBox-left">
          <img :src="http+item.logo" />
        </div>
        <div class="caseListBox-right">
          <div class="caseListBox-right-top">
            <div class="caseListBox-right-title">
              {{item.title}}
            </div>
            <div class="caseListBox-right-date">
              浏览{{item.viewNum}}次 | {{conductDate(item.updateTime,'yyyy-MM-dd HH:mm:ss')}}
            </div>
          </div>
          <div class="caseListBox-right-text">
            {{item.brief}}
          </div>
        </div>
      </div>
      <p v-if="tableData1.length==0" style="padding-top: 50px;text-align: center;">
        还没有上传病例!
      </p>
      <div v-if="tableData1.length>0" class="showMore">
        <el-button v-if="isHashMore" type="text">查看更多病例>></el-button>
        <span v-if="!isHashMore">已经没有更多病例可查看!</span>
      </div>
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
    data() {
      return {
        formValidate: {
          title: "",
        },

        //列表、及分页属性
        isHashMore:true,
        tableData1:[
            /*{
             "id":1,
             "title":"测试标题1",
             "logo":"www",
             "brief":"eee",
             "viewNum":2,
             "pageNum":2,
             "downloadNum":2,
             "operator":2,
             "operatorId":2,
             "updateTime":2
        }*/
        ],
        listTotal:0,
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.casesList.path,
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
            url: api.casesList.path,
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
      },
      showList(item){
        this.showDoc(item);
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
