<!----------------------------------
****--按照专业---安排轮转(index)
****--@date     2017/7/23
****--@author   zyc<332533011@qq.com
---------------------------------->
<template>
  <div class="arrangeBySpecialty">
    <el-steps style="margin: 0 auto; width: 98%;" :space="160" :active="active" finish-status="success">
      <el-step title="第一步：选择基地"></el-step>
      <el-step title="第二步：选择人员"></el-step>
      <el-step title="第三步：选择培训标准"></el-step>
      <el-step title="第四步：设置轮转时间"></el-step>
      <el-step title="第五步：确认"></el-step>
      <el-step title="第六步：预览"></el-step>
      <el-step title="第七步：完成"></el-step>
    </el-steps>
    <!--- 第一步：选择基地 -->
    <div v-show="active==0" style="margin: 20px;">
      <first @setFirstVal="setFirstVal" :userType="userType"></first>
    </div>
    <!--- 第二步：选择人员 -->
    <div v-if="active==1" style="margin: 20px;">
      <second @setSecondVal="setSecondVal" :userType="userType" :initUser="initUser" :jdProclass="jdProclass"></second>
    </div>
    <!--- 第三步：选择培训标准 -->
    <div v-if="active==2" style="margin: 20px;">
      <third @setThirdVal="setThirdVal" :userType="userType" :initRtId="initRtId" :jdProclass="jdProclass"></third>
    </div>
    <!--- 第四步：设置轮转时间 -->
    <div v-if="active==3" style="margin: 10px 20px;">
      <br />
      <el-row>
        <el-col :span="8"><div class="cal-schoolTit" style="text-align: right;">轮转开始时间：</div></el-col>
        <el-col :span="10">
          <el-date-picker
            v-model="startRotateTime"
            type="date"
            placeholder="选择轮转开始时间"
            :picker-options="pickerOptions0">
          </el-date-picker>
          <span v-if="startRotateTime==''" style="color: #FF0000">&nbsp;&nbsp;&nbsp;&nbsp;您还没有选择开始轮转时间!</span>
        </el-col>
      </el-row>
    </div>
    <!--- 第五步：确认 -->
    <div v-if="active==4" style="margin: 20px;">
      <br />
      <el-row :gutter="10">
        <el-col :span="4">
          <div class="arrange-schoolTit" style="text-align: right;">基地名称：</div>
        </el-col>
        <el-col :span="20">
          <div class="arrange-schoolTit" style="">{{postData.jdName}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="4">
          <div class="arrange-schoolTit" style="text-align: right;">培训标准名称：</div>
        </el-col>
        <el-col :span="20">
          <div class="arrange-schoolTit">{{postData.rtName}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="4">
          <div class="arrange-schoolTit" style="text-align: right;">轮转开始时间：</div>
        </el-col>
        <el-col :span="20">
          <div class="arrange-schoolTit">{{postData.rtTime}}</div>
        </el-col>
      </el-row>
      <br />
      <el-row :gutter="10">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="22">
          <div class="el-form selectUserBox">
            <fieldset style="min-height:260px;">
              <legend style="font-size:16px">&nbsp;&nbsp;已选人员&nbsp;</legend>
              <div style="height:240px;overflow:auto;" v-if="groupUserNames.length>0">
                <el-tag style="margin: 2px;" v-for="(item,idx) in groupUserNames" :key="idx" type="success">
                  {{item}}
                </el-tag>
              </div>
              <p v-else>没有选择人员</p>
            </fieldset>
          </div>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
      </el-row>
    </div>
    <!--- 第六步：预览 -->
    <div v-if="active==5" style="margin: 20px;text-align: center;">
      <showTabData :tableData="tableData"></showTabData>
    </div>
    <!--- 第七步：完成 -->
    <div v-if="active==6" style="margin: 20px;text-align: center;">
      数据提交中……
    </div>
    <el-row :gutter="10">
      <el-col :span="24" style="text-align: center;">
        <el-button v-if="active>0&&active<6" style="margin-top: 12px;" @click="up">上一步</el-button>
        <el-button v-if="active<5" style="margin-top: 12px;" @click="next" :loading="isLoading">下一步</el-button>
        <load-btn v-if="active>4" style="margin-top: 12px;"  @listenSubEvent="success" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import first from "./firstStep.vue";
  import second from "./secondStep.vue";
  import third from "./thirdStep.vue";
  import showTabData from "./rotaryTableView.vue";
  import api from "../../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["isInit","userType"],
    data() {
      return {
        //生成轮转表提交时post用的data
        postData: {
          "rtId": "",
          "rtTime": "",
          "jdName": "",
          "rtName": "",
          "userId": "",
          "userName": "",
        },

        //第一步的选择的专业方向
        jdProclass:"",

        //第二步默认的选择人员
        initUser:[],

        //第三步默认选择的细则
        initRtId:{},

        //第五步已选择人员查看
        groupUserNames: [],

        //只选选周一
        pickerOptions0: {
          disabledDate(time) {
            return time.getDate() != 1 && time.getDate() != 16;
          }
        },


        //保存按钮基本信息
        loadBtn: {title: '完成', callParEvent: 'listenSubEvent'},

        //当前步骤索引
        active: 0,

        //按钮loading效果
        isLoading: false,


        //请求专业数据
        sltedSpecialty: "",


        //轮转开始时间
        startRotateTime: "",

        //当前步骤
        currStep: 0,


        //排班预览
        tableData: {
          thead: [],
          tbody: [],
        },
        rotaryDeptGroupTitle:{
          ajaxSuccess:'setRotaryViewData',
          ajaxParams:{
            url: api.rotaryDeptUser.path+this.userType,
            method:'post',
            jsonString:true,
            baseConfing: {timeout: 60000 * 10,}
          }
        },


        //保存轮转表
        saveRotaryDataTitle:{
          type:'add',
          successTitle:'轮转表安排成功!',
          errorTitle:'轮转表安排失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.regrotaryDept.path+this.userType,
            method:api.regrotaryDept.method,
            jsonString:true,
            baseConfing: {timeout: 60000 * 10,}
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;

      },


      //存储第一步的数据
      setFirstVal(val){
        //console.log("setFirstVal",val);
        this.postData["jdName"] = val["jdName"];
        this.jdProclass = val["jdProclass"]||'';
      },


      //存储第二步的数据
      setSecondVal(val){
        let nameArr = [];
        let idArr = [];
        this.initUser = val;
        this.groupUserNames = [];
        for(var i=0,item;i<val.length;i++){
          item = val[i];
          nameArr.push(item["userName"]);
          idArr.push(item["userId"]);
          this.groupUserNames.push(item["userName"]);
        }
        this.postData["userId"] = idArr.join(",");
        this.postData["userName"] = nameArr.join(",");
      },


     //存储三第步的数据
      setThirdVal(val){
        this.initRtId = val;
        //console.log("setThirdVal",val);
        this.postData["rtName"] = val.split("##")[0];
        this.postData["rtId"] = val.split("##")[1];
      },


      //格式化排班表数据
      formatTableData(data){
        //this.tableData.thead  this.tableData.tbody
        let fixedInfo=[{"prop":"userName","label":"姓名"},{"prop":"highestEdu","label":"学历"},{"prop":"specialty","label":"培训方向"}]
        let thead = [];
        let tbody = [];
        let tempArr = [];
        for(var i=0,item;i<data["times"].length;i++){
          item = data["times"][i];
          tempArr.push({
            "prop":item["beginTime"]+item["endTime"],
            "label":item["beginTime"]+" "+item["endTime"],
          })
        }
        thead = fixedInfo.concat(tempArr);
        /*for(var i=0,item;i<data["rotaryData"].length;i++){
         item = data["rotaryData"][i];
         bodyRight[item["beginTime"]+item["endTime"]+item["userId"]] = item;
         }*/
        for(var i=0,item;i<data["userInfo"].length;i++){
          item = data["userInfo"][i];
          for(var k=0,subItem;k<data["rotaryData"].length;k++){
            subItem = data["rotaryData"][k];
            if(item["userId"]==subItem["userId"]){
              item[subItem["beginTime"]+subItem["endTime"]] = subItem["depName"];
            }
          }
        }
        tbody = data["userInfo"];
        this.tableData.thead = thead;
        this.tableData.tbody = tbody;

      },


      //设置排班预览的数据
      setRotaryViewData(responseData){
        let data = responseData.data;
        this.formatTableData(data);
        this.isLoading=false;
        this.active = 5;
      },


      //下一步
      next() {
        if(this.postData["jdName"]==""&&this.active==0){
          this.errorMess("请选择基地!");
          return;
        }
        if(this.postData["userName"]==""&&this.active==1){
          this.errorMess("请选择人员!");
          return;
        }
        if(this.postData["rtName"]==""&&this.active==2){
          this.errorMess("请选择培训标准!");
          return;
        }
        if(this.postData["rtTime"]==""&&this.active==3){
          this.errorMess("请选择轮转开始时间!");
          return;
        }

        if(this.active==4){
          this.rotaryDeptGroupTitle.ajaxParams.data = this.getFormData(this.postData);
          this.isLoading=true;
          this.ajax(this.rotaryDeptGroupTitle);
          return;
        }

        if (this.active++ > 6) this.active = 0;

      },

      //清空所有设置的值
      clearAllVal(){



      },

      //上一步
      up() {
        if (this.active-- == 1) {
          this.active = 0;
        };
        this.isLoading=false;
      },


      //完成
      success(isLoadingFun){
        this.active = 6;
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        this.ajax(this.saveRotaryDataTitle,isLoadingFun);
      },


      /*
       * 获取表单数据
       * @return []
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },
    },
    watch:{

      isInit(val){
        this.active = 0;
        this.isLoading = false;
      },
      startRotateTime(val){
         this.postData["rtTime"] = this.conductDate(val);
      },

    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {
      first,second,third,showTabData
    }
  }
</script>
<style>
  .arrangeBySpecialty .arrange-schoolTit {
    font-size: 16px;
    padding: 8px 0
  }
</style>
