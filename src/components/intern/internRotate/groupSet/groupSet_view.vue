<!----------------------------------
****--分组设置(groupSet_view)
****--@date     2017/7/3
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="10">
        <div class="cal-schoolTit">分组名称：{{groupData.groupName}}</div>
      </el-col>
      <el-col :span="10">
        <div class="cal-schoolTit">分组顺序：{{groupData.groupIndexName}}</div>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="22">
        <div class="el-form selectUserBox">
          <fieldset style="min-height:90px;">
            <legend style="font-size:16px">&nbsp;&nbsp;组员名单&nbsp;</legend>
            <div style="height:40px;overflow:auto;" v-if="typeof groupData.groupUserNames!='undefined'">
              <el-tag style="margin: 2px;" v-for="(item,idx) in groupData.groupUserNames" :key="idx" type="success">
                {{item}}
              </el-tag>
            </div>
            <p v-else>没有组员</p>
          </fieldset>
        </div>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入当前组件字典api
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        //查看分组
        groupData:{
          depGroupIndex:"",
          groupId:"",
          groupIndexName:"",
          groupName:"",
          groupUserIds:"",
          groupUserNames:"",
          outlineId:"",
        },
        getGroupMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.groupShow.path+"/"+this.operailityData["groupId"],
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.getGroupMessTitle);
      },

      //获取服务端分组信息
      updateListData(responseData){
        let data = responseData.data;
        this.groupData = this.formateQuestData(data);
      },


      /**
       * 格式化请求的数据
       * @param data  {Object}  服务端请求的源数据
       * @return obj  {Object}  页面视图展示需要的数据
       * */
      formateQuestData(data){
        let obj = {}
        if(!Util.isEmptyObject(data)){
          if(data["groupUserNames"].indexOf(",")>-1){
            data["groupUserNames"] = data["groupUserNames"].split(",");
          }else{
            data["groupUserNames"] = [data["groupUserNames"]];
          }
          obj = data;
        }
        return obj;
      },

    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
