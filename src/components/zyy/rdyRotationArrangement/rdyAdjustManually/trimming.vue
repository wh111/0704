<!----------------------------------
****--微调(trimming)
****--@date     2017/7/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-row>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="4">
        <div class="cal-schoolTit">姓名：{{formValidate.userName}}</div>
      </el-col>
      <el-col :span="4">
        <div class="cal-schoolTit">是否暂停：{{formValidate.isPause==true?'是':'否'}}</div>
      </el-col>
      <el-col :span="10">
        <div class="cal-schoolTit">轮转开始时间：{{formValidate.rotaryStartTime}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="2">
        <el-button type="primary" @click="addTerm">添加</el-button>
      </el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="22">
        <el-table
          v-for="item in 1"
          :key="item"
          align="center"
          :data="formValidate.rotaryData"
          :height="500"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="depName"
            label="科室名称"
            class-name="valiTableStyle"
            show-overflow-tooltip>
            <template scope="scope">
              <el-form :model="scope.row" :ref="'formValidate_depId'+scope.$index" label-width="0" :rules="rules">
                <el-form-item prop="depId">
                  <el-select
                    style="width: 90%;"
                    v-model="scope.row.splitDepId"
                    :filterable="true"
                    placeholder="选择或输入匹配搜索">
                    <el-option
                      v-for="item in depOptionData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="beginTime"
            label="入科时间"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="出科时间"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="ts"
            label="时间"
            align="center"
            class-name="valiTableStyle"
            width="105">
            <template scope="scope">
              <el-form :model="scope.row" ref="f" :rules="rules"  label-width="0" class="demo-ruleForm">
                <el-form-item prop="ts">
                  <el-input  v-model="scope.row.ts" placeholder="请输入内容" style="width: 85px"> <template slot="append">月</template></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="220">
            <template scope="scope">
              <Button @click="sort('up',scope.$index)" type="ghost" icon="arrow-up-c"></Button>
              <Button @click="sort('down',scope.$index)" type="ghost" icon="arrow-down-c"></Button>
              <Button @click="delRow(scope.$index)" type="error">删 除</Button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>
    <el-row class="but-space">
      <el-col :span="9" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../api.js";

  import {
    reqDepVal as rules
  } from '../../rules'; // 表单验证
  //当前组件引入全局的util
  let Util = null;
  export default{
    //props接收父组件传递过来的数据
    props: ['operailityData','userType'],
      data() {
        return {
          rules,
          //保存按钮基本信息
          loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
          countDate:0,
          //form表单bind数据
          formValidate: {
            /*"userId":11,
            "userName":"张三",
            "specialty":"专业",
            "isPause":false,
            "rotaryStartTime":"207-01-01",
            "rotaryData":[
              {
                "podId":111,
                "depId":11,
                "depName":"科室1",
                "rtId":111,
                "rdId":111,
                "beginTime":"2017-01-01",
                "endTime":"2017-01-06",
                "ts":1,
                "order":2,
                "isRegister":"REGISTER",
                "registerTime":"2017-01-01 10:08:10",
                "podState":0,
                "depPhaseNum":1
              },
              {
                "podId":112,
                "depId":11,
                "depName":"科室2",
                "rtId":111,
                "rdId":111,
                "beginTime":"2017-01-07",
                "endTime":"2017-01-014",
                "ts":1,
                "order":2,
                "isRegister":"REGISTER",
                "registerTime":"2017-01-01 10:08:10",
                "podState":0,
                "depPhaseNum":1
              }
            ]*/
          },

          //保存的数据
          saveData:{
            "userType":this.userType,
            "userId":"",
            "userName":"",
            "minBegin":"2017-01-01",   //this.formValidate.rotaryStartTime
            "removePodIds":[],  //this.formValidate.rotaryData[0].podId
            "rtIdList":[],      //this.formValidate.rotaryData[0].rtId
            "podIdList":[],     //this.formValidate.rotaryData[0].podId
            "tsList":[],        //this.formValidate.rotaryData[0].ts
            "depIdList":[],     //this.formValidate.rotaryData[0].depId
            "cIdList":[],       //this.formValidate.rotaryData[0].cdepId
            "rdIdList":[],      //this.formValidate.rotaryData[0].rdId
          },

          //动态添加的模板数据
          templateData:{
            "podId":"",
            "depId":"",
            "depName":"",
            "rtId":"",
            "rdId":"",
            "ts":"",
          },

          //保存删除的数据
          deleteData:{},

          //科室下拉数据
          depOptionData:[],
          depOptionObjData:{},  //{id:name}

          //获取科室数据
          getDepOptionTitle:{
            ajaxSuccess:'getDepOptionData',
            ajaxParams:{
              url: api.getDepPagelist.path,
            }
          },

          listMessTitle:{
            ajaxSuccess:'updateListData',
            ajaxParams:{
              url: api.getRotaryDepIndo.path+"/"+this.operailityData.userId+"_"+this.userType,
            }
          },


          //当前组件提交(eidt)数据时,ajax处理的 基础信息设置
          editMessTitle:{
            type:'edit',
            successTitle:'微调成功!',
            errorTitle:'微调失败!',
            ajaxSuccess:'ajaxSuccess',
            ajaxError:'ajaxError',
            ajaxParams:{
              url: api.regUserMicrCtrol.path,
              method:api.regUserMicrCtrol.method,
              jsonString:true
            }
          },
        }
      },
      methods: {
        /*
         * 组件初始化入口
         * */
        init(){
          //console.log(this.operailityData);
          //默认请求加载数据
          this.ajax(this.listMessTitle);
        },


        //通过get请求列表数据
        getDepOptionData(responseData){
          let data = responseData.data;
          let tempArr = [];
          for(var i=0,item;i<data.length;i++){
            item = data[i];
            let depPhaseNum = item["depPhaseNum"];  //阶段号或组号
            let depPhase = item["depPhase"];   //阶段或组分类名称
            if(item["cdepList"]!==null){   //标准科室为空
              for(var k=0,subItem;k<item["cdepList"].length;k++){
                subItem = item["cdepList"][k];
                let cdepName = subItem["cdepName"];   //标准科室名称
                let cdepId = subItem["cdepId"];       //标准科室id
                let rdId = subItem["rdId"];           //细则与标准科室关系id

                if(item["cdepList"]!==null) {  //院内科室为空
                  for (var j = 0, ssubItem; j < subItem["hospitalDepList"].length; j++) {
                    ssubItem = subItem["hospitalDepList"][j];
                    ssubItem["showName"] = ssubItem["depName"] + "(" + cdepName + "-" + depPhase + ")";  //页面上展示院内科室下拉项
                    ssubItem["cdepId"] = cdepId;               //标准科室id
                    ssubItem["rdId"] = rdId;                   //细则与标准科室关系id
                    ssubItem["depPhaseNum"] = depPhaseNum;     //阶段号或组号
                  }
                  tempArr = tempArr.concat(subItem["hospitalDepList"]);
                }
              }
            }
          }
          let depOptions={};
          for(var i=0,item;i<tempArr.length;i++){
            item = tempArr[i];
            depOptions[item["depId"]+"##"+item["rdId"]]={
              id:item["depId"]+"##"+item["rdId"],
              name:item["showName"],
            }
            this.depOptionObjData[item["depId"]+"##"+item["rdId"]]={
              "depName":item["depName"],           //院内科室名称
              "cdepId":item["cdepId"],             //标准科室id
              "rdId":item["rdId"],                 //细则与标准科室关系id
              "depId":item["depId"],               //院内科室id
              "depPhaseNum":item["depPhaseNum"],   //阶段号或组号
            };
          }
          this.depOptionData = [];
          Util._.forEach(depOptions, (v,k)=> {
            this.depOptionData.push(v);
          })
          //console.log("depOptionData",this.depOptionData);
        },


        //通过get请求列表数据
        updateListData(responseData){
          let data = responseData.data;
          let firstRotaryData = data["rotaryData"][0];
          for(var i=0,item;i<data["rotaryData"].length;i++){
            item = data["rotaryData"][i];
            item["splitDepId"] = item["depId"]+"##"+item["rdId"]
          }
          //console.log("data",data);
          this.templateData = {
            "podId":"",                                  //轮转id
            "depId":firstRotaryData["depId"],            //院内科室id
            "depName":firstRotaryData["depName"],        //院内科室名称
            "rtId":firstRotaryData["rtId"],              //细则id
            "rdId":firstRotaryData["rdId"],              //细则与标准科室关系id
            "ts":firstRotaryData["ts"],                  //轮转周期
            "splitDepId":"",                             //用来标示科室唯一性(存储院内科室id+##+细则与标准科室关系id)  例如:565##7863
            "depPhaseNum":"",                            //阶段号或组号
          }
          //console.log("data",data);
          let option = Util._.defaultsDeep({},this.getDepOptionTitle);
          option.ajaxParams.url += "/"+firstRotaryData["rtId"];
          this.ajax(option);
          this.formValidate=data;

        },


        //添加
        addTerm (){
            let templateData =  Util._.defaultsDeep({},this.templateData);
          this.formValidate.rotaryData.push(templateData);
        },


        //删除添加项
        delRow(index){
          if(this.formValidate.rotaryData[index]["podId"]!=""){
            this.deleteData[this.formValidate.rotaryData[index]["podId"]] = this.formValidate.rotaryData[index]["podId"];
          }
          this.formValidate.rotaryData.splice(index,1);
        },


        /**
         * 排序
         * @param type {string}  向上or向下 up down
         * @param currIdx {number} 当前的顺序
         * */
        sort(type,currIdx){
          let gotoIdx = currIdx;
          let rotaryData = this.formValidate.rotaryData;
          if(type=="up"){
            if(gotoIdx!=0){
              gotoIdx--;
            }else{
              this.showMess("已经是第一位!")
              return;
            }
          }else{
            if(rotaryData.length-1>gotoIdx){
              gotoIdx++;
            }else{
              this.showMess("已经是最后一位!")
              return;
            }
          }
          let saveVal = rotaryData[currIdx];
          rotaryData.splice(currIdx,1);
          rotaryData.splice(gotoIdx, 0, saveVal);
        },


        /*
         * 点击提交按钮 监听是否提交数据
         * @param isLoadingFun boolean  form表单验证是否通过
         * */
        listenSubEvent(isLoadingFun){
          let isSubmit = this.submitForm("formValidate");
          if(isSubmit) {
            if (!isLoadingFun) isLoadingFun = function () {};
            isLoadingFun(true);
            this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
            this.ajax(this.editMessTitle, isLoadingFun)
          }
        },


        /*
         * 点击提交按钮 监听是否验证通过
         * @param formName string  form表单v-model数据对象名称
         * @return flag boolean   form表单验证是否通过
         * */
        submitForm(formName){
          let flag = true;
          for(let i =0;i< this.$refs.f.length; i++){
            this.$refs.f[i].validate((valid) => {
              if(!valid) {
              flag= false;
            }
          });
          }
          return flag;
        },


        /*
         * 默认组件第一次请求数据
         * @param res JSON  数据请求成功后返回的数据
         * */
        SuccessGetCurrData(responseData){
          let type = [];
          let data = responseData.data;
          type.push(data.type+"");
          this.formValidate = data;
          this.formValidate.type = type;
        },


        /*
         * 当前组件发送事件给父组件
         * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
         * */
        cancel(){
          this.$emit('cancel','edit');
        },


        /*
         * 获取表单数据
         * @return string  格式:id=0&name=aa
         * */
        getFormData(data){
          let myData = Util._.defaultsDeep({},data);
          this.saveData["userId"] = myData["userId"];
          this.saveData["userName"] = myData["userName"];
          this.saveData["minBegin"] = myData["rotaryStartTime"];
          /*saveData:{
            "userType":"ZYY",
              "userId":"",
              "userName":"",
              "minBegin":"2017-01-01",   //this.formValidate.rotaryStartTime
              "removePodIds":[],  //this.formValidate.rotaryData[0].podId
              "rtIdList":[],      //this.formValidate.rotaryData[0].rtId
              "podIdList":[],     //this.formValidate.rotaryData[0].podId
              "tsList":[],        //this.formValidate.rotaryData[0].ts
              "depIdList":[],     //this.formValidate.rotaryData[0].depId
              "cIdList":[],       //this.formValidate.rotaryData[0].depId
              "rdIdList":[],      //this.formValidate.rotaryData[0].rdId
          }*/
          let removePodIds = [],rtIdList=[],podIdList=[],tsList=[],depIdList=[],cIdList=[],rdIdList=[],depName=[],groupNo=[];
          Util._.forEach(this.deleteData,function (v,k) {
            removePodIds.push(v);
          })
          for(var i=0,item;i<myData["rotaryData"].length;i++){
            item = myData["rotaryData"][i];
            if(item["splitDepId"]!=""){
              let splitDepId = item["splitDepId"];
              rtIdList.push(item["rtId"]);                                                      //细则id
              podIdList.push(item["podId"]);                                                    //轮转id(新建添加时为空)
              tsList.push(item["ts"]);                                                          //轮转周期
              depIdList.push(this.depOptionObjData[item["splitDepId"]]["depId"]);               //院内科室id
              cIdList.push(this.depOptionObjData[item["splitDepId"]]["cdepId"]);                //标准科室id
              rdIdList.push(this.depOptionObjData[item["splitDepId"]]["rdId"]);                 //细则与标准科室关系id
              depName.push(this.depOptionObjData[item["splitDepId"]]["depName"]);               //院内科室名称
              //判断 是否为新加的科室 || 后台返回的数据中是否包含阶段号或组号(depPhaseNum)
              if(item["depPhaseNum"]==""||item["depPhaseNum"]===null){
                groupNo.push(this.depOptionObjData[item["splitDepId"]]["depPhaseNum"]);         //阶段号或组号
              }else{
                groupNo.push(item["depPhaseNum"]);                                              //阶段号或组号
              }
            }
          }
          this.saveData["rtIdList"] = rtIdList;
          this.saveData["podIdList"] = podIdList;
          this.saveData["tsList"] = tsList;
          this.saveData["depIdList"] = depIdList;
          this.saveData["cIdList"] = cIdList;
          this.saveData["rdIdList"] = rdIdList;
          this.saveData["removePodIds"] = removePodIds;
          this.saveData["depName"] = depName;
          this.saveData["groupNo"] = groupNo;

          return this.saveData;
        }

      },
      created(){
        //给当前组件注入全局util
        Util = this.$util;
        this.init();
      },
      mounted(){
      },
      components: {}
  }
</script>
