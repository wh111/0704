<!----------------------------------
****--修改----对应标准科室的院内科室(addSetDep)
****--@date     2017/7/26
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <div class="cal-schoolTit">{{operailityData["cdepName"]}}：{{operailityData["ts"]}}月</div>
    <div class="cal-schoolTit">是否连续轮转：
      <el-radio-group v-model="formValidate.depIsCou">
        <el-radio :label="0">是</el-radio>
        <el-radio :label="1">否</el-radio>
      </el-radio-group>
    </div>
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
        prop="hospitalDepName"
        label="科室名称"
        class-name="valiTableStyle"
        show-overflow-tooltip>
        <template scope="scope">
          <div v-if="scope.$index==0">
            <el-radio-group v-model="formValidate.deType">
              <el-row>
                <el-col :span="24">
                  <div class="cal-schoolTit">
                    <el-radio v-model="formValidate.deType" :label="1">任选其</el-radio>
                    <el-input :disabled="formValidate.deType==0" @change.native="watchDeType(formValidate.depRandomNum)" style="width: 60px;" v-model="formValidate.depRandomNum" placeholder="请输入内容"></el-input>(<em style="color: #FF0000">该数量指：在所有的院内科室中系统随机抽选几个</em>)
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="cal-schoolTit"><el-radio v-model="formValidate.deType" :label="0">必选科室</el-radio></div>
                </el-col>
              </el-row>
            </el-radio-group>
          </div>
          <div v-else>
            <el-checkbox @change="removeDepIdx(scope.$index,scope.row)" v-model="scope.row.checked">{{scope.row.hospitalDepName}}</el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="chTs"
        width="120"
        class-name="valiTableStyle"
        label="3年时间">
        <template scope="scope">

          <div v-if="scope.$index==0">
            <el-form :model="{ts:formValidate.chTs}" ref="formValidate" :rules="rdyDepContrast" label-width="0" >
              <el-form-item  prop="ts">
                <el-input style="width: 60px;" @change="handleRandomInput('chTs')" :disabled="formValidate.deType==0" v-model="formValidate.chTs" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div v-else>
            <el-form :model="{ts:scope.row.chTs}" ref="formValidate" :rules="rdyDepContrast" label-width="0" >
              <el-form-item  prop="ts">
                <el-input style="width: 60px;" @change="handleMustInput('chTs')" :disabled="formValidate.deType==1" v-model="scope.row.chTs" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="ch2Ts"
        width="120"
        class-name="valiTableStyle"
        label="2年时间">
        <template scope="scope">
          <div v-if="scope.$index==0">
            <el-form :model="{ts:formValidate.ch2Ts}" ref="formValidate" :rules="rdyDepContrast" label-width="0" >
              <el-form-item  prop="ts">
                <el-input style="width: 60px;" @change="handleRandomInput('ch2Ts')" :disabled="formValidate.deType==0" v-model="formValidate.ch2Ts" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div v-else>
            <el-form :model="{ts:scope.row.ch2Ts}" ref="formValidate" :rules="rdyDepContrast" label-width="0">
              <el-form-item  prop="ts">
                <el-input style="width: 60px;" @change="handleMustInput('ch2Ts')" :disabled="formValidate.deType==1" v-model="scope.row.ch2Ts" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="ch1Ts"
        width="120"
        class-name="valiTableStyle"
        label="1年时间">
        <template scope="scope">
          <div v-if="scope.$index==0">
            <el-form :model="{ts:formValidate.ch1Ts}" ref="formValidate" :rules="rdyDepContrast" label-width="0" >
              <el-form-item  prop="ts">
                <el-input style="width: 60px;" @change="handleRandomInput('ch1Ts')" :disabled="formValidate.deType==0" v-model="formValidate.ch1Ts" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div v-else>
            <el-form :model="{ts:scope.row.ch1Ts}" ref="formValidate" :rules="rdyDepContrast" label-width="0">
              <el-form-item  prop="ts">
                <el-input style="width: 60px;" @change="handleMustInput('ch1Ts')" :disabled="formValidate.deType==1" v-model="scope.row.ch1Ts" placeholder="请输入内容"></el-input>
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
          "hgId":this.operailityData["hgId"],
          "rtId":this.operailityData["rtId"],
          "rdId":this.operailityData["rdId"],
          "hgGroup":this.operailityData["hgGroup"],
          "deType":1,
          "depRandomNum":1,
          "depIsCou":1,
          "chTs":1,
          "ch2Ts":1,
          "ch1Ts":1,
          "hospitalDeps":[]
        },

        depTreeData:[],
        saveDepTreeData:[],

        //要删除科室
        delDep:{},

        //是否连续轮转
        radio2: 3,

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
            url: api.getByDepth.path,
            params:{
              depth:3
            }
          }
        },

        //初始获取修改的数据
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.getRulesDepHgGroupByHgId.path+this.operailityData["hgId"],
            params:{
              name:'',code:''
            }
          }
        },

        //保存设置的科室
        addMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            url: api.rulesDepHgGroupAddOrEdit.path,
            method: api.rulesDepHgGroupAddOrEdit.method,
            jsonString:true,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        //this.initFormateData();
        //this.initFormateDepTree();
        this.ajax(this.listMessTitle);
        /*var users = [
         { 'user': 'fred',   'age': 48 },
         { 'user': 'barney', 'age': 34 },
         { 'user': 'fred',   'age': 42 },
         { 'user': 'barney', 'age': 36 }
         ];
         let myMap = Util._.sortBy(users, ['user'], ["fred",'desc']); //['desc', 'desc']
         console.log(myMap);*/
        //Util._.map(Util._.sortByOrder(users, ['user', 'age'], ['asc', 'desc']), Util._.values);
      },

      //通过get请求修改的数据
      updateListData(responseData){
        let data = responseData.data;
        if(!Util.isEmptyObject(data)){
          this.initFormateData(data);
          this.ajax(this.getDepMessTitle);
        }
      },

      //格式化列表server传输过来的数据
      initFormateData(data){
        /*data = {
          "rtId":"细则ID",
          "cdepId":"标准科室ID",
          "cdepName":"标准科室Name",
          "hgId":"组主键ID",
          "hgGroup":"组号",
          "deType":1,
          "depRandomNum":"任选其几",
          "hospitalDeps":[
            {
              "hospitalDepId":1,
              "hospitalDepName":"院内科室名称",
              "chTs":4,
              "ch2Ts":4,
              "ch1Ts":2
            }
          ]
        }*/
        if(data["deType"]==1){
          this.formValidate["chTs"] = data["hospitalDeps"].length>0?data["hospitalDeps"][0]["chTs"]:1;
          this.formValidate["ch2Ts"] = data["hospitalDeps"].length>0?data["hospitalDeps"][0]["ch2Ts"]:1;
          this.formValidate["ch1Ts"] = data["hospitalDeps"].length>0?data["hospitalDeps"][0]["ch1Ts"]:1;
        }else{
          if(data["hospitalDeps"].length>0){
            let chTs=0,ch2Ts=0,ch1Ts=0;
            for(var i=0,item;i<data["hospitalDeps"].length;i++){
              item = data["hospitalDeps"][i];
              if(item["chTs"]!=""&&item["chTs"]!==null){
                chTs+= parseInt(item["chTs"]);
              }
              if(item["ch2Ts"]!=""&&item["ch2Ts"]!==null){
                ch2Ts+= parseInt(item["ch2Ts"]);
              }
              if(item["ch1Ts"]!=""&&item["chTs"]!==null){
                ch1Ts+= parseInt(item["ch1Ts"]);
              }
            }
            this.formValidate["chTs"] = chTs;
            this.formValidate["ch2Ts"] = ch2Ts;
            this.formValidate["ch1Ts"] = ch1Ts;
          }else{
            this.formValidate["chTs"] = 1;
            this.formValidate["ch2Ts"] = 1;
            this.formValidate["ch1Ts"] = 1;
          }
        }
        this.formValidate["deType"] = data["deType"];
        this.formValidate["depRandomNum"] = data["depRandomNum"];
        this.formValidate["depIsCou"] = data["depIsCou"];

        this.tableData1=[];
        for(var i=0,item;i<data["hospitalDeps"].length;i++){
          item=data["hospitalDeps"][i]
          item["checked"]=false;
        }
        this.tableData1 = data["hospitalDeps"];
        this.tableData1.unshift({});
      },

      //格式化科室目录树
      initFormateDepTree(data){
        /*data = [
         {
         "expand":true,
         "name":"内科",
         "id":1,
         "leaf":false,
         "childList":[
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
        this.setChecked(data);
        let idArr = [];
        for(var i=0,item;i<this.tableData1.length;i++){
          item = this.tableData1[i];
          idArr.push(item["hospitalDepId"]);
        }
        this.canelChecked(data,idArr,true);

        this.saveDepTreeData = Util._.defaultsDeep([],data);
        this.depTreeData = data;
      },

      //获取server端所有科室
      setDepData(responseData){
        let data = responseData.data;
        if(this.valDataType(data,"Array")){
//          if(typeof data[0].childList!="undefined"){
//            this.initFormateDepTree(data[0].childList);
//          }
          data.map(item => {
            item.childList = []
          })
          this.initFormateDepTree(data);
        }
      },

      //保存的字段合并模板
      saveFeildExtend(){

        let template = {
          "rtId":this.operailityData["rtId"],      //培训细则id
          "rdId":this.operailityData["rdId"],      //轮转id
          "cdepId":this.operailityData["cdepId"],    //标准科室id
          "cdepName":this.operailityData["cdepName"],  //标准科室name
          "chId":"",
          "hospitalDepId":"",
          "hospitalDepName":"",
          "chTs":"",
          "ch2Ts":"",
          "ch1Ts":"",
        }
        return template;
      },


      //监控人选其几的值是否大于选中的科室
      watchDeType(val){
        if(isNaN(val)){
          this.formValidate.depRandomNum = 1;
        }else{
          val = parseInt(val);
          if(val<=0 || val>(this.tableData1.length-1)){
            this.formValidate.depRandomNum = 1;
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
        if(isSubmit) {
//          console.log(this.getFormData(this.formValidate));
//          return;
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


      setChecked(data){
        for (var i = 0; i < data.length; i++) {
          data[i]["checked"] = false;
          if (this.valDataType(data,"Array") && data[i].childList!==null) {
            this.setChecked(data[i].childList);
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
          if (this.valDataType(data,"Array") && data[i].childList!==null) {
            this.canelChecked(data[i].childList,idArr,flag);
          }
        }
      },


      /**
       * 动态添加科室
       * @param id {Number}  科室id
       * @param name {string}  科室名称
       * */
      addDep(id,name){
        let template={
          "hospitalDepId":id,
          "hospitalDepName":name,
          "checked":false,
          "chTs":1,
          "ch2Ts":1,
          "ch1Ts":1
        }
        if(this.formValidate.deType==1){
          template["chTs"] = this.formValidate["chTs"];
          template["ch2Ts"] = this.formValidate["ch2Ts"];
          template["ch1Ts"] = this.formValidate["ch1Ts"];
        }
        this.tableData1.push(template);
        if(this.formValidate.deType==0){
          this.handleMustInput();
        }

      },


      /**
       * 勾选科室后
       * @param item {Object}  科室数据
       * */
      handleCheck(item){
        if(item.checked){
          this.addDep(item.id,item.name);
        }
      },


      //存储要删除科室所在行的索引
      removeDepIdx(idx,item){
        if(item.checked){
          this.delDep[idx] = {idx:idx,id:item.hospitalDepId};
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
        if(this.formValidate.deType==0){
          this.handleMustInput();
        }else{
          this.handleRandomInput();
        }
        let myData = Util._.defaultsDeep({},data);
        let tempArr = [];

        for(var i=1,item,obj;i<this.tableData1.length;i++){
          item = this.tableData1[i];
          obj = Object.assign({},this.saveFeildExtend(),item);
          tempArr.push(obj);
        }

        myData["hospitalDeps"] = tempArr;
        return myData;
      },


      /**
       * 选中随机类型后改变周期调用
       * @param type {String}   当前周期标示:"chTs" "ch2Ts" "ch1Ts"
       * */
      handleRandomInput(type){

        for(var i=1,item;i<this.tableData1.length;i++){
          item = this.tableData1[i];
          if(typeof type=="undefined") {
            item["chTs"] = this.formValidate["chTs"]==""?0:this.formValidate["chTs"];
            item["ch2Ts"] = this.formValidate["ch2Ts"]==""?0:this.formValidate["ch2Ts"];
            item["ch1Ts"] = this.formValidate["ch1Ts"]==""?0:this.formValidate["ch1Ts"];
          }else{
            item[type] = this.formValidate[type];
          }
        }
      },


      /**
       * 选中固定类型后改变周期调用
       * @param type {String}   当前周期标示:"chTs" "ch2Ts" "ch1Ts"
       * */
      handleMustInput(type){
        let count,count1,count2,count3;
        count = count1 = count2 = count3 = 0;
        for(var i=1,item;i<this.tableData1.length;i++){
          item = this.tableData1[i];
          if(item[type]!=""){
            if(typeof type=="undefined"){
              count1+= parseInt(item["chTs"]);
              count2+= parseInt(item["ch2Ts"]);
              count3+= parseInt(item["ch1Ts"]);
            }else {
              count+= parseInt(item[type]);
            }
          }
        }
        if(typeof type=="undefined"){
          this.formValidate["chTs"] = count1==0?1:count1;
          this.formValidate["ch2Ts"] = count1==0?1:count2;
          this.formValidate["ch1Ts"] = count1==0?1:count3;
        }else{
          this.formValidate[type] = count;
        }
      },
      compare1 (prop, val) {
        return function (a, b) {
          var value1 = a[prop].indexOf(val);
          var value2 = b[prop].indexOf(val);
          if (value1 == -1) {
            value1 = -10000;
          } else {
            value1 = -value1;
          }
          if (value2 == -1) {
            value2 = -10000;
          } else {
            value2 = -value2;
          }
          return value2 - value1;
        };
      },
      compare2 (prop) {
        return function (a, b) {
          var value1 = a[prop] * 1;
          var value2 = b[prop] * 1;
          return value1 - value2;
        };
      }

    },
    watch:{
      filterDep(val){
        //todo
        if (!val) {
          this.depTreeData.sort(this.compare2('id'));
        } else {
          this.depTreeData.sort(this.compare1('name', val));
        }

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
