<!----------------------------------
****--轮转安排(rdyArrangeRotation_rotationSet)
****--@date     2017/9/13
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <div class="cal-schoolTit">{{operailityData["depName"]}}：{{operailityData["ts"]}}月</div>
    <br />
    <el-table
      v-for="valItem in 1"
      :key="valItem"
      border
      align="center"
      :height="dynamicHt"
      :context="self"
      :data="tableData1"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        prop="depName"
        label="科室名称"
        class-name="valiTableStyle"
        show-overflow-tooltip>
        <template scope="scope">
          <div v-if="scope.$index==0">
            <el-radio-group v-model="formValidate.cType">
              <el-row>
                <el-col :span="24">
                  <div class="cal-schoolTit">
                    <el-radio v-model="formValidate.cType" :label="1">任选其</el-radio>
                    <el-input :disabled="formValidate.cType==0" @change.native="watchDeType(formValidate.randomNum)" style="width: 60px;" v-model="formValidate.randomNum" placeholder="请输入内容"></el-input>(<em style="color: #FF0000">该数量指：在所有的院内科室中系统随机抽选几个</em>)
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="cal-schoolTit"><el-radio v-model="formValidate.cType" :label="0">必选科室</el-radio></div>
                </el-col>
              </el-row>
            </el-radio-group>
          </div>
          <div v-else>
            <el-checkbox @change="removeDepIdx(scope.$index,scope.row)" v-model="scope.row.checked">{{scope.row.depName}}</el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="depTs"
        width="120"
        class-name="valiTableStyle"
        label="时间">
        <template scope="scope">

          <div v-if="scope.$index==0">
            <el-form :model="{ts:formValidate.depTs}" ref="formValidate" :rules="rdyDepContrast" label-width="0" >
              <el-form-item  prop="ts">
                <el-input style="width: 60px;" @change="handleRandomInput('depTs')" :disabled="formValidate.cType==0" v-model="formValidate.depTs" placeholder="请输入内容"></el-input>月
              </el-form-item>
            </el-form>
          </div>
          <div v-else>
            <el-form :model="{ts:scope.row.depTs}" ref="formValidate" :rules="rdyDepContrast" label-width="0" >
              <el-form-item  prop="ts">
                <el-input style="width: 60px;" @change="handleMustInput('depTs')" :disabled="formValidate.cType==1" v-model="scope.row.depTs" placeholder="请输入内容"></el-input>月
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <div style="text-align: center">
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>   <el-button @click="removeDep()" type="danger">移除</el-button>
    </div>
    <div class="cal-schoolTit">待选科室:<el-input style="width: 200px;" v-model="filterDep" placeholder="请输入内容"></el-input></div>
    <div class="sltDepWrapper">
      <ul class="sltDepUl">
        <div v-for="(item,index) in depTreeData" :key="item.id" class="sltDepBox">
          <li class="sltDep"><el-checkbox @change="handleCheck(item)" :disabled="item.checked" v-model="item.checked">{{item.name}}</el-checkbox></li>
          <li class="sltSubDep" v-if="typeof item.childList!='undefined'" v-for="(subItem,subIndex) in item.childList"><el-checkbox @change="handleCheck(subItem)" :disabled="subItem.checked" v-model="subItem.checked">{{subItem.name}}</el-checkbox></li>
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../api.js";
  import {rdyDepContrast} from "../../rules";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData"],
    data() {
      return {
        //验证规则
        rdyDepContrast,
        //保存按钮基本信息
        loadBtn:{title:'确定',callParEvent:'listenSubEvent'},

        //form表单bind数据
        formValidate: {
          "cType":0,  //类型(0 必须  1 任选)
          "randomNum":"",  //任选其几
          "podIds":this.operailityData["podIds"], //待安排的轮转ID(逗号分隔)
          "depIds":"", //科室ID逗号分隔
          "depTs":0.5  //科室周期逗号分隔
        },

        depTreeData:[],
        saveDepTreeData:[],

        //要删除科室
        delDep:{},

        //是否任选其一
        isRandom:1,

        //查询科室
        filterDep:"",

        dynamicHt: 300,
        self: this,
        tableData1: [{}],
        loading:false,
        listTotal:0,

        //获取所有的科室
        getDepMessTitle:{
          ajaxSuccess:'setDepData',
          ajaxParams:{
            url: api.getDepTree.path,
            params:{}
          }
        },

        //保存设置的科室
        addMessTitle:{
          type:'rotation',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            url: api.modifyDepRotaryData.path,
            method: api.modifyDepRotaryData.method,
            jsonString:true,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.getDepMessTitle);
      },

      //格式化科室目录树
      initFormateDepTree(data){
        /*data = [
         {
         "expand":true,
         "name":"内科",
         "id":1,
         "leaf":false,
         "children":[
         {
         "expand":true,
         "name":"内科A1",
         "id":3,
         "leaf":true
         },
         {
         "expand":true,
         "name":"内科A2",
         "id":4,
         "leaf":true
         }
         ]
         },
         {
         "expand":true,
         "name":"外科",
         "id":2,
         "leaf":true
         }
         ]*/
        this.setChecked(data,0);

        this.saveDepTreeData = Util._.defaultsDeep([],data);
        this.depTreeData = data;
      },

      //获取server端所有科室
      setDepData(responseData){
        let data = responseData.data;
        if(this.valDataType(data,"Array")){
            if(data.length>0){
              this.initFormateDepTree(data);
            }
          /*if(typeof data[0].childList!="undefined"&&data[0].childList!==null){
            this.initFormateDepTree(data[0].childList);
          }*/
        }
      },

      //监控人选其几的值是否大于选中的科室
      watchDeType(val){
        if(isNaN(val)){
          this.formValidate.randomNum = 1;
        }else{
          val = parseInt(val);
          if(val<=0 || val>(this.tableData1.length-1)){
            this.formValidate.randomNum = 1;
          }
        }
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(this.tableData1.length==1){
          this.showMess("您还没有配置科室!");
          return;
        }
        let totalNum = Number(this.operailityData.ts);
        if((Number(this.formValidate.depTs)) != totalNum){
          this.showMess("设置的科室总时间之和必须等于"+this.operailityData["depName"]+":"+this.operailityData["ts"]+"月");
          return;
        }
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },


      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = true;
        if(this.$refs[formName]){
          for(let i =0;i< this.$refs[formName].length; i++){
            this.$refs[formName][i].validate((valid) => {
              if(!valid) {
                flag= false;
              }
            });
          }
        }
        return flag;
      },


      setChecked(data,j){
        let isEnable = j==0?true:false;
        j++;
        for (var i = 0; i < data.length; i++) {
          data[i]["checked"] = isEnable;
          if (typeof data[i].childList != "undefined" && data[i].childList!=null && data[i].childList.length > 0) {
            this.setChecked(data[i].childList,j+1);
          }
        }
      },

      canelChecked(data,idArr,flag){
        if(idArr.length==0) return;
        for (var i = 0; i < data.length; i++) {
          let idx = idArr.indexOf(data[i]["id"]);
          if(idx>-1){
            idArr.splice(idx,1);
            data[i]["checked"] = flag;
          }
          if (typeof data[i].childList != "undefined" && data[i].childList!=null && data[i].childList.length > 0) {
            this.canelChecked(data[i].childList,idArr,flag);
          }
        }
      },


      /**
       * 动态添加科室
       * @param id {Number}  科室id
       * @param name {string}  科室名称
       * */
      addDep(id,name,item){
        let template={
          "checked":false,
          "depName":name, //科室名称
          "depId":id, //科室ID逗号分隔
          "depTs":0.5  //科室周期逗号分隔
        }
        let totalNum = Number(this.operailityData.ts);
        if((Number(this.formValidate.depTs)+template.depTs) > totalNum){
          item.checked = false;
          this.showMess("设置的科室总时间之和不能大于"+this.operailityData["depName"]+":"+this.operailityData["ts"]+"月");
          return;
        }
        if(this.formValidate.cType==1){
          template["depTs"] = this.formValidate["depTs"];
        }
        this.tableData1.push(template);
        if(this.formValidate.cType==0){
          this.handleMustInput();
        }

      },


      /**
       * 勾选科室后
       * @param item {Object}  科室数据
       * */
      handleCheck(item){
        if(item.checked){
          this.addDep(item.id,item.name,item);
        }
      },


      //存储要删除科室所在行的索引
      removeDepIdx(idx,item){
        if(item.checked){
          this.delDep[idx] = {idx:idx,id:item.depId};
        }else{
          delete this.delDep[idx];
        }
      },


      //移除调用
      removeDep(){
        let tempArr = [],idsArr=[];
        Util._.forEach(this.delDep,function (v,k) {
          tempArr.push(v["idx"]);
          idsArr.push(v["id"]);
        });
        if(tempArr.length==0){
          this.showMess("请选择要移除的科室!");
          return;
        }
        tempArr.sort(function(a,b){return a-b});

        for (var i=tempArr.length-1;i>=0;i--){
          this.tableData1.splice(tempArr[i],1);
        }
        this.canelChecked(this.depTreeData,idsArr,false);
        this.canelChecked(this.saveDepTreeData,idsArr,false);
        this.delDep = {};
        this.handleMustInput();
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        if(this.formValidate.cType==0){
          this.handleMustInput();
        }else{
          this.handleRandomInput();
        }
        let myData = Util._.defaultsDeep({},data);
        let depIdsArr = [];  //存储科室id
        let depTsArr = [];   //各科室周期数

        for(var i=1,item;i<this.tableData1.length;i++){
          item = this.tableData1[i];
          depIdsArr.push(item.depId);
          depTsArr.push(item.depTs);
        }
        myData["depIds"] = depIdsArr.join(",");
        myData["depTs"] = depTsArr.join(",");
        return myData;
      },


      /**
       * 选中随机类型后改变周期调用
       * @param type {String}   当前周期标示:"depTs" "ch2Ts" "ch1Ts"
       * */
      handleRandomInput(type){

        for(var i=1,item;i<this.tableData1.length;i++){
          item = this.tableData1[i];
          if(typeof type=="undefined") {
            item["depTs"] = this.formValidate["depTs"]==""?0:this.formValidate["depTs"];
          }else{
            item[type] = this.formValidate[type];
          }
        }
      },


      /**
       * 选中固定类型后改变周期调用
       * @param type {String}   当前周期标示:"depTs" "ch2Ts" "ch1Ts"
       * */
      handleMustInput(type){
        let count,count1,count2,count3;
        count = count1 = count2 = count3 = 0;
        for(var i=1,item;i<this.tableData1.length;i++){
          item = this.tableData1[i];
          if(item[type]!=""){
            if(typeof type=="undefined"){
              count1+= Number(item["depTs"]);
            }else {
              count+= Number(item[type]);
            }
          }
        }
        if(typeof type=="undefined"){
          this.formValidate["depTs"] = count1==0?1:count1;
        }else{
          this.formValidate[type] = count;
        }
      },
    },
    watch:{
      filterDep(val){
        //todo
        //if(!val){
        //this.depTreeData = this.saveDepTreeData;
        //}else{
        this.depTreeData.sort(function(a, b) {
          return a.name.indexOf(val) < b.name.indexOf(val);
        })
        for(var i=0,item;i<this.depTreeData.length;i++){
          item = this.depTreeData[i]["childList"];
          if(typeof item!="undefined"){
            item.sort(function(a, b) {
              return a.name.indexOf(val) < b.name.indexOf(val);
            })
          }
        }
        //}

        //console.log(val);
      }
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
