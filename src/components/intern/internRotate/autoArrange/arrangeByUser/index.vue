<!----------------------------------
****--按人员排班(index)
****--@date     2017/7/10
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-steps style="margin: 0 auto; width: 98%;" :space="190" :active="active" finish-status="success">
      <el-step title="第一步：选择学校"></el-step>
      <el-step title="第二步：选择人员"></el-step>
      <el-step title="第三步：设置轮转开始时间"></el-step>
      <el-step title="第四步：确认"></el-step>
      <el-step title="第五步：预览"></el-step>
      <el-step title="第六步：完成"></el-step>
    </el-steps>
    <!--- 第一步：选择学校与专业 --->
    <div v-show="active==0" style="margin: 20px;">
      <div style="width:100%;padding:0 10px;height:320px;overflow-y:auto;overflow-x:hidden;border: 1px solid #e0e6ed;">
      <el-row :gutter="10" v-if="schoolData.length>0">
        <el-col v-for="(item,index) in schoolData" :key="index" :span="6">
          <div class="cal-schools">
            <el-row>
              <el-col :span="20">
                <el-tooltip v-if="item.name&&item.name.length>10" :content="item.name" effect="light" placement="top">
                <el-button :type="item.checked?'success':''" class="overflow-txt1" @click="handleCheckSchool(index,item)" style="width: 100%" v-text="item.name"></el-button>
                </el-tooltip>
                <el-button v-else :type="item.checked?'success':''" class="overflow-txt1" @click="handleCheckSchool(index,item)" style="width: 100%" v-text="item.name"></el-button>
              </el-col>
              <el-col :span="4">
                <div v-show="item.checked" class="cal-check"><i class="el-icon-check"></i></div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
        <p v-else style="text-align:center;padding-top:100px">数据加载中……</p>
      </div>
      <br />
      <!--<el-row>
        <el-col :span="8"><div class="cal-schoolTit" style="text-align: right;">专业：</div></el-col>
        <el-col :span="10">
          <dictionary-select @setSltOptionValue="setSpecialtyOptionValue" :isClear="isClear" :selectOptions="specialtyOptions"></dictionary-select>
          <span v-if="sltedSpecialty==''" style="color: #FF0000">&nbsp;&nbsp;&nbsp;&nbsp;您还没有选择专业!</span>
        </el-col>
      </el-row>-->
      <el-row style="margin-top: 10px;">
        <el-col :span="8"><div class="cal-schoolTit" style="text-align: right;">大纲：</div></el-col>
        <el-col :span="14">
          <el-select
            v-model="sltedDg"
            :filterable="true"
            placeholder="选择或输入匹配搜索">
            <el-option
              v-for="item in getDgBySpecialty"
              :key="item.outlineId"
              :label="item.dgName"
              :value="item.outlineId">
            </el-option>
          </el-select>
          <span v-if="getDgBySpecialty.length==0" style="color: #FF0000">&nbsp;&nbsp;&nbsp;&nbsp;您还没有选择学校或者该学校下没有对应的大纲!</span>
          <span v-if="getDgBySpecialty.length>0&&sltedDg==''" style="color: #FF0000">&nbsp;&nbsp;&nbsp;&nbsp;请选择对应专业的大纲!</span>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="8"><div class="cal-schoolTit" style="text-align: right;">科室轮转要求：</div></el-col>
        <el-col :span="10">

          <el-select
            v-model="sltedDepReq"
            :filterable="true"
            placeholder="选择或输入匹配搜索">
            <el-option
              v-for="item in depReqData"
              :key="item.depOutlineId"
              :label="item.name"
              :value="item.depOutlineId">
            </el-option>
          </el-select>
          <span v-if="depReqData.length==0" style="color: #FF0000">&nbsp;&nbsp;&nbsp;&nbsp;没有科室轮转要求!</span>
          <span v-if="depReqData.length>0&&sltedDepReq==''" style="color: #FF0000">&nbsp;&nbsp;&nbsp;&nbsp;请选择对应科室轮转要求!</span>
        </el-col>
      </el-row>
    </div>
    <!--- 第二步：选择人员 --->
    <div v-if="active==1" style="margin: 20px;">
      <select-people :schoolId="saveSchoolData.schoolId" @setSltedPeople="setSltedPeople" :initUser="sltedPeople"></select-people>
    </div>
    <!--- 第三步：设置轮转开始时间 --->
    <div v-if="active==2" style="margin: 20px;">
      <br />
      <el-row>
        <el-col :span="8"><div class="cal-schoolTit" style="text-align: right;">轮转开始时间：</div></el-col>
        <el-col :span="10">
          <el-date-picker
            v-model="startRotateTime"
            type="date"
            :editable="false"
            placeholder="选择轮转开始时间"
            :picker-options="pickerOptions0">
          </el-date-picker>
          <span v-if="startRotateTime==''" style="color: #FF0000">&nbsp;&nbsp;&nbsp;&nbsp;您还没有选择开始轮转时间!</span>
        </el-col>
      </el-row>
    </div>
    <!--- 第四步：确认 --->
    <div v-if="active==3" style="margin: 10px 20px;">
      <el-row>
        <el-col :span="20"><div class="cal-schoolTit">学校：{{saveSchoolData.schoolName||""}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="20"><div class="cal-schoolTit">轮转开始时间：{{startRotateTime||""}}</div></el-col>
      </el-row>
      <el-row :gutter="10" class="myCard">
        <el-col style="margin: 10px 0; overflow: hidden; float: left" :span="12">
          <el-card :body-style="{ padding: '0px', margin:'0 auto' }">
            <div style="padding: 14px;">
              <div class="el-form selectUserBox">
                <fieldset style="min-height:90px;">
                  <legend style="font-size:16px">&nbsp;&nbsp;已选的人员名单&nbsp;&nbsp;</legend>
                  <div style="height:40px;overflow:auto;" v-if="sltedPeople.length>0">
                    <el-tag style="margin: 2px;" v-for="(item,idx) in sltedPeople" :key="idx" type="success">
                      {{item.userName}}
                    </el-tag>
                  </div>
                  <p v-else>您还没有选择安排的人员,请您选择!</p>
                </fieldset>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </div>
    <!--- 第五步：预览 --->
    <div v-if="active==4" style="margin: 20px;">
      <showTabData :tableData="tableData"></showTabData>
    </div>
    <!--- 第六步：完成 --->
    <div v-if="active==6" style="margin: 20px;text-align: center;">
      数据提交中……
    </div>
    <el-row :gutter="10">
      <el-col :span="24" style="text-align: center;">
        <el-button v-if="active>0&&active<4" style="margin-top: 12px;" @click="up">上一步</el-button>
        <el-button v-if="active<4" style="margin-top: 12px;" @click="next" :loading="isLoading">下一步</el-button>
        <load-btn v-if="active>3" style="margin-top: 12px;"  @listenSubEvent="success" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import selectPeople from "./selectPeople.vue";
  import showTabData from "./rotaryTableView.vue";
  import api from "../../../internRotate/api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["isInit"],
    data() {
      return {
        //生成轮转表提交时post用的data
        postData:{
          "rotaryTime":"",
          "outlineId":"",
          "depOutlineId":"",
          "userIds":"",
        },

        //只选选周一
        pickerOptions0: {
          disabledDate(time) {
            return time.getDay() !=1;
          }
        },

        //预览轮转表的存储data
        tableData:{
          thead:[],
          tbody:[],
        },

        //保存按钮基本信息
        loadBtn:{title:'完成',callParEvent:'listenSubEvent'},

        //当前步骤索引
        active: 0,

        //按钮loading效果
        isLoading:false,

        //选择的学校
        schoolData:[],
        sltedSchool:[],

        //请求专业数据
        sltedSpecialty:"",
        specialtyOptions:{
          multiple:false,    //是否多选
          url: api.specialty.path,
          value:'',
        },

        isClear:false,


        //存储一步的数据
        saveSchoolData:{
          "schoolId":"",
          "outlineId":"",
          "depOutlineId":"",
          "schoolName":"",
        },


        //第二步选择的人员
        sltedPeople:[],

        //轮转开始时间
        startRotateTime:"",

        //当前步骤
        currStep:0,

        //请求学校数据
        getSchoolsTitle:{
          ajaxSuccess:'getSchoolsData',
          ajaxParams:{
            url: api.schools.path,
            params:{}
          }
        },

        //根据专业匹配科室要求
        //getDepReqBySpecialty:[],
        sltedDepReq:"",

        //学校专业对应科室要求
        depReqData:[],
        getDepReqBySchoolId:{
          ajaxSuccess:'getDepReqData',
          ajaxParams:{
            url: api.getDepReq.path,
            params:{
              name:"",
              specialty:"",
              curPage:1,
              pageSize:20,
              sortby:"",
              order:"",
            }
          }
        },


        //根据专业匹配大纲
        getDgBySpecialty:[],
        sltedDg:"",

        //学校专业对应大纲
        dgData:[],
        getDgBySchoolId:{
          ajaxSuccess:'getDgData',
          ajaxParams:{
            url: api.schoolGetDg.path,
            params:{}
          }
        },


        //排班预览
        rotaryDeptGroupTitle:{
          ajaxSuccess:'setRotaryViewData',
          ajaxParams:{
            url: api.rotaryDeptUser.path,
            method:'post',
            jsonString:true,
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
            url: api.regrotaryDept.path,
              method:api.regrotaryDept.method,
              jsonString:true
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //初始化获取学校选择项
        this.ajax(this.getSchoolsTitle);

        //初始化获取所有的科室要求
        let option = Util._.defaultsDeep({},this.getDepReqBySchoolId);
        this.ajax(option);
      },


      //格式化排班表数据
      formatTableData(data){
        //this.tableData.thead  this.tableData.tbody
        let fixedInfo = [{"prop": "userName", "label": "姓名"}, {
          "prop": "schoolName",
          "label": "学校"
        }, {"prop": "specialty", "label": "培训方向"}]
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


      //获取学校list
      getSchoolsData(responseData){
        let data = responseData.data;

        for(var i=0,item;i<data.length;i++){
          item = data[i];
          item.checked = false;
        }
        this.schoolData=data;
        if(this.sltedSchool.length>0){
          this.schoolData[this.sltedSchool[0]].checked = true;
          this.saveSchoolData["schoolId"] = this.schoolData[this.sltedSchool[0]].id;
          this.saveSchoolData["schoolName"] = this.schoolData[this.sltedSchool[0]].name;
        }
      },


      //根据学校id获取专业对应科室要求
      getDepReqData(responseData){
        let data = responseData.data;
        this.depReqData = [];
        for(var i=0,item;i<data.length;i++){
          item = data[i];
          this.depReqData.push({
            depOutlineId:item["depOutlineId"],
            name:item["name"],
            //specialty:item["specialty"],
          });
        }
      },


      //根据学校id获取专业对应大纲
      getDgData(responseData){
        let data = responseData.data;
        this.getDgBySpecialty = [];
        for(var i=0,item;i<data.length;i++){
          item = data[i];
          /*{
           "outlineId":1,
           "schoolName":"南京大学",
           "gradeNum":2017,
           "specialty":"专业",
            outlineName:'名称'
           }*/
          this.getDgBySpecialty.push({
            outlineId:item["outlineId"],
            dgName:item["outlineName"],
            //specialty:item["specialty"],
          });
        }

      },


      /**
       * 选择学校
       * @param {number} idx 当前选择的学校的索引
       */
      handleCheckSchool(idx,item){
        if(this.sltedSchool.length>0){
          this.schoolData[this.sltedSchool[0]].checked = false;
          this.sltedSchool.splice(0,1);
        }
        item.checked = !item.checked;
        this.sltedSchool.push(idx);

        this.saveSchoolData["schoolId"] = item.id;
        this.saveSchoolData["schoolName"] = item.name;
        //清空已经设置的值
        this.clearAllVal();
        let option = Util._.defaultsDeep({},this.getDgBySchoolId);
        option.ajaxParams.url += '/' + 2
        this.ajax(option);
      },


      /*
       * 设置专业
       * @param val string || number  选中学校的id
       * */
      setSpecialtyOptionValue(val,id){
        //this.formValidate.schoolId = id;
        //this.formValidate.specialty = val;
        if(val!=""){
          this.sltedSpecialty = val;
          this.specialtyOptions.value = val;
          //this.getDepReqBySpecialty=[];
          this.sltedDepReq = "";
          //查询当前选择学校的大纲
          if(this.active==0){
            let option = Util._.defaultsDeep({},this.getDepReqBySchoolId);
            option.ajaxParams.params = Object.assign(option.ajaxParams.params,{
              name:this.saveSchoolData["schoolName"],
              specialty:this.sltedSpecialty,
            })
            this.ajax(option);
          }

          //设置大纲
          this.getDgBySpecialty=[];
          this.sltedDg = "";
          for(var i=0,item;i<this.dgData.length;i++){
            item = this.dgData[i];
            if(item["specialty"]==val){
              this.getDgBySpecialty.push(item);
            }
          }

        }
      },


      //设置并存储第三步选择的人员数据
      setSltedPeople(data){
        this.sltedPeople = data;
      },

      //设置排班预览的数据
      setRotaryViewData(responseData){
        let data = responseData.data;
        this.formatTableData(data);
        this.isLoading=false;
        this.active = 4;
      },


      //下一步
      next() {
        if(this.sltedSchool.length==0&&this.active==0){
          this.errorMess("请选择学校!");
          return;
        }
        /*if(this.sltedSpecialty==""&&this.active==0){
          this.errorMess("请选择专业!");
          return;
        }*/
        if(this.sltedDg==""&&this.active==0){
          this.errorMess("请选对应的大纲!");
          return;
        }
        if(this.sltedDepReq==""&&this.active==0){
          this.errorMess("请选对应的科室要求!");
          return;
        }
        if(this.sltedPeople.length==0&&this.active==1){
          this.errorMess("请选择安排轮转的人员!");
          return;
        }
        if(this.startRotateTime==""&&this.active==2){
          this.errorMess("请选择轮转开始时间!");
          return;
        }

        if(this.active==2){
          let tempArr = [];
          for(var i=0,item;i<this.sltedPeople.length;i++){
            item = this.sltedPeople[i];
            tempArr.push(item["userId"]);
          }
          this.postData.userIds = tempArr.join(",");
        }


        if(this.active==3){

          this.rotaryDeptGroupTitle.ajaxParams.data = this.getFormData(this.postData);
//          this.isLoading=true;
          this.ajax(this.rotaryDeptGroupTitle);
          return;
        }

        if (this.active++ > 4) this.active = 0;

      },

      //清空所有设置的值
      clearAllVal(){
        //清空专业
        //this.sltedSpecialty = "";
        //this.specialtyOptions.value = "";
        //this.isClear = !this.isClear;

        //清空大纲
        this.sltedDg="";
        this.getDgBySpecialty = [];
        this.dgData = [];

        //清空科室要求
        //this.sltedDepReq="";
        //this.depReqData = [];


      },

      //上一步
      up() {
        if (this.active-- == 1) {
          this.active = 0;
          this.ajax(this.getSchoolsTitle);
        };
        this.isLoading=false;
      },


      //完成
      success(isLoadingFun){
        this.active = 6;
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        this.ajax(this.saveRotaryDataTitle);
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
      startRotateTime(val){
        if(val!=""){
          this.startRotateTime = this.conductDate(this.startRotateTime);
          this.postData.rotaryTime = this.startRotateTime;
        }
      },
      sltedDepReq(val){
        if(val!=""){
          this.postData.depOutlineId = val;
        }
      },
      sltedDg(val){
        this.saveSchoolData["outlineId"] = val;
        if(val!=""){
          this.postData.outlineId = val;
        }
      },
      isInit(val){
        this.active = 0;
        this.isLoading = false;
      },

    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {
      showTabData,
      selectPeople,
    }
  }
</script>
