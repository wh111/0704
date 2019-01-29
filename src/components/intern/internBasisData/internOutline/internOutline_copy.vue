<!---实习大纲管理-修改--->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="2">
        <div class="cal-schoolTit" style="text-align: right;">学校:</div>
      </el-col>
      <el-col :span="5">
        <search-select v-if="formValidate.schoolId!=''" @setSltOptionValue="setSltOptionValue" :selectOptions="selectOptions"></search-select>
      </el-col>
      <el-col :span="2">
        <div class="cal-schoolTit" style="text-align: right;">专业:</div>
      </el-col>
      <el-col :span="5">
        <dictionary-select v-if="formValidate.schoolId!=''" @setSltOptionValue="setSpecialtyOptionValue" :selectOptions="specialtyOptions"></dictionary-select>
      </el-col>
      <el-col :span="2">
        <div class="cal-schoolTit" style="text-align: right;">年级:</div>
      </el-col>
      <el-col :span="5">
        <el-date-picker
          :editable="false"
          style="width: 100px"
          v-model="formValidate.gradeNum"
          type="year"
          placeholder="选择年">
        </el-date-picker>
      </el-col>
    </el-row>
    <br />
    <div class="el-form">
      <el-row v-if="outlines.length>0" :gutter="10">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="22">
          <div style="margin: 8px 0;" v-for="(groupItem,groupIndex) in outlines" :key="groupIndex" class="form-fieldset-wrapper">
            <div class="form-fieldset-del">
              <el-tooltip :content="'点击删除'+groupOtions[groupIndex]" placement="top" effect="light">
                <el-button style="float: right;" type="danger" size="mini" @click="delGroup(groupIndex)" icon="close"></el-button>
              </el-tooltip>
            </div>
            <fieldset style="min-height:90px;">
              <legend style="font-size:16px">&nbsp;&nbsp;{{groupOtions[groupIndex]}}&nbsp;&nbsp;</legend>
              <div class="cal-schoolTit">
                必须轮转科室 <el-button type="primary" size="mini" @click="openSetDepWin(groupIndex,'mustRotaryDep')" icon="plus"></el-button>
                组分类名称：
                <el-form :model="groupItem" ref="f" :rules="rules"  label-width="0" style="display: inline-block">
                  <el-form-item  prop="greatName">
                    <el-input v-if="typeof groupItem.greatName!='undefined'" v-model="groupItem.greatName" style="width: 120px;" placeholder="请输入内容"></el-input>
                  </el-form-item>
              </el-form>
              </div>

              <el-table
                border
                align="center"
                :data="groupItem.mustRotaryDep"
                tooltip-effect="dark"
                style="width: 100%">
                </el-table-column>
                <el-table-column
                  prop="depName"
                  label="科室"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  label="实习时间"
                  class-name="valiTableStyle"
                  align="center">
                  <template scope="scope">
                    <el-form :model="scope.row" ref="f" :rules="rules"  label-width="0" class="demo-ruleForm">
                      <el-form-item  prop="ts">
                        <el-input  v-model="scope.row.ts" placeholder="请输入内容" style="width: 120px"> <template slot="append">周</template></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  label="备注"
                  align="center">
                  <template scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入内容"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="teachNames"
                  label="操作"
                  align="center">
                  <template scope="scope">
                    <el-button type="danger" size="mini" @click="delGroupItem(groupIndex,scope.$index,'mustRotaryDep')">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <br />
              <div class="cal-schoolTit">
                自选轮转科室 <el-button type="primary" size="mini" @click="openSetDepWin(groupIndex,'randomRotaryDep')" icon="plus"></el-button>
              </div>
              <br />
              <div style="overflow: auto;margin: 0 auto" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
                <table :width="'100%'">

                  <colgroup  v-for="(item,index) in noMustHeader">
                    <col :name="'el-table_1_column_'+index" :width="150">
                  </colgroup>
                  <thead >
                  <tr  >
                    <th class="cell" v-for="(item,index) in noMustHeader">
                      {{item.label}}
                    </th>
                  </tr>
                  </thead>
                </table>
                <div v-if="groupItem.randomRotaryDep.length>0" class="el-table__body-wrapper" style="max-height:400px;overflow-x: hidden;overflow-y: auto;">
                  <table   :width="'100%'">
                    <colgroup  v-for="(item,index) in noMustHeader">
                      <col name="'el-table_1_column_'+index" :width="150">
                    </colgroup>

                    <tbody  class="add-scope">
                    <tr v-for="(item,index) in groupItem.randomRotaryDep">
                      <td>
                        &nbsp;&nbsp;&nbsp;&nbsp;{{item.depName}}
                      </td>
                      <td align="center">
                        <el-input placeholder="请输入内容" style="width: 90%" v-model="item.remark"></el-input>
                      </td>
                      <td v-show="index==0" :rowspan="groupItem.randomRotaryDep.length" align="center">
                        <el-input placeholder="请输入内容" v-model="item.ts" style="width: 50px"></el-input> 周
                      </td>
                      <td v-show="index==0" :rowspan="groupItem.randomRotaryDep.length" align="center">
                        自选 <el-input placeholder="请输入内容" v-model="item.optionalNum" style="width: 50px"></el-input> 科
                      </td>
                      <td align="center">
                        <el-button type="danger" size="mini" @click="delGroupItem(groupIndex,index,'randomRotaryDep')">删除</el-button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="el-table__empty-block" v-else><span class="el-table__empty-text">暂无数据</span></div>
              </div>
            </fieldset>
          </div>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
      </el-row>
      <el-row :gutter="10" v-else>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="22"><div class="cal-schoolTit" style="border: 1px solid #ececec;padding: 20px;"><span class="el-table__empty-text">还没有组,请添加组!</span></div></el-col>
        <el-col :span="1">&nbsp;</el-col>
      </el-row>
    </div>
    <br />
    <el-row :gutter="10">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="22">
        <el-button type="primary" @click="addGroup">添加组</el-button>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
      <el-col :span="4" class="textCenter"><load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn></el-col>
      <el-col :span="4" class="textCenter"><el-button  @click="cancel">取消</el-button></el-col>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
    </el-row>
    <!--增加弹窗-->
    <Modal
      :mask-closable="false"
      v-model="setDepModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="700">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="setDepModal"  @cancel="cancelSetDep" @filterAddDepData="filterAddDepData" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import add from "./internOutline_setDep.vue";
  //引入--操作url的api
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    //props接收父组件传递过来的数据
    props: ['editOperailityData','rules'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        /*--按钮button--*/
        addId:{
          id:'add',
          title:'添加'},
        operailityData:"",
        setDepModal:false,


        //必选科室
        tableData1:[],

        //自选科室
        noMustHeader:[{
          key :'parentTitle',
          label :'科室',
        },{
          key :'remark',
          label :'备注',
        },
          {
            key :'titleSub',
            label :'实习时间',
          },
          {
            key :'titleSub',
            label :'自选规则',
          },
          {
            key :'operateParent',
            label :'操作',
          },
        ],

        noMustBody:[],

        //form表单bind数据
        formValidate: {
          "schoolId":"",
          "schoolName":"",
          "specialty":"",
          "gradeNum":"",
          "outlines":[]
        },
        currGroupIndex:"",
        tabType:"",

        //组格式化组
        groupOtions:[
          "第一组","第二组","第三组","第四组","第五组","第六组","第七组","第八组","第九组","第十组","第十一组","第十二组","第十三组","第十四组","第十五组","第十六组","第十七组","第十八组","第十九组","第二十组"
        ],
        groupTemplate:{
          "greatName":"",
          "mustRotaryDep": [],
          "randomRotaryDep": []
        },
        outlines: [],

        //请求学校数据
        selectOptions:{
          multiple:false,    //是否多选
          url: api.schools.path,
          value:"",
        },

        //请求专业数据
        specialtyOptions:{
          multiple:false,    //是否多选
          url: api.specialty.path,
          value:"",
        },

        //获取大纲详情
        getOutline:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.dgGet.path+"/"+this.editOperailityData["outlineId"],
          }
        },


        //保存大纲
        copyOutline:{
          type:'copy',
          successTitle:'复制成功!',
          errorTitle:'复制失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.dgAdd.path,
            method: api.dgAdd.method,
            jsonString:true,
          },
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;

        this.ajax(this.getOutline);
      },


      //获取大纲详情
      updateListData(responseData){
        let data = responseData.data;
        this.formateQuestData(data);
      },


      /**
       * 格式化请求的数据
       *
       * */
      formateQuestData(data){
        let obj={}
        obj["schoolId"] = data["schoolId"];
        obj["schoolName"] = data["schoolName"];
        obj["specialty"] = data["specialty"];
        obj["gradeNum"] = data["gradeNum"];

        Util._.forEach(data["outlines"], (item,k)=> {
          let tempObj = {
            "mustRotaryDep":[],
            "randomRotaryDep":[],
            "greatName":"",
          }
          let greatName = '';

          for(var i=0,subItem;i<item["mustRotaryDep"].length;i++){
            subItem=item["mustRotaryDep"][i];
            subItem["isMustRotaryDep"] = subItem["isMustDep"];
            delete subItem["depSetId"];
          }
          for(var i=0,subItem;i<item["randomRotaryDep"].length;i++){
            subItem=item["randomRotaryDep"][i];
            subItem["isMustRotaryDep"] = subItem["isMustDep"];
            delete subItem["depSetId"];
          }

          if(item["mustRotaryDep"].length>0){
            greatName = item["mustRotaryDep"][0]["greatName"];
          }else{
            if(item["randomRotaryDep"].length!='undefined'){
             greatName = item["randomRotaryDep"][0]["greatName"];
            }
          }
          tempObj["greatName"] = greatName;
          tempObj = Object.assign(tempObj,item)
          this.outlines.push(tempObj);
        })


        this.selectOptions.value = parseInt(data["schoolId"]);
        this.specialtyOptions.value = data["specialty"];
        this.formValidate = Object.assign(this.formValidate,obj);
      },


      /*
       * 设置学校选中的值
       * @param val string || number  选中学校的id
       * */
      setSltOptionValue(val,id){
        this.formValidate.schoolId = id;
        this.formValidate.schoolName = val;
      },


      /*
       * 设置专业
       * @param val string || number  选中学校的id
       * */
      setSpecialtyOptionValue(val,id){
        //this.formValidate.schoolId = id;
        this.formValidate.specialty = val;
      },


      /**
       * 添加组列表---filter添加的数据
       */
      filterAddDepData(data){
        let template = this.randomTemplate();
        if(this.tabType=="mustRotaryDep"){
          template = this.mustTemplate();
        };
        let tempArr = [];
        for(var i=0,tempObj;i<data.length;i++){
          tempObj = this.getFormData(Object.assign(template,data[i]));
          tempObj["groupNo"] = this.currGroupIndex+1;
          tempObj["depIndex"] = (i+1);
          tempArr.push(tempObj);
        }

        let sltedGroupData = this.outlines[this.currGroupIndex][this.tabType];
        //console.log("isSltedGroup",sltedGroupData);
        let noMustTs = "";
        let optionalNum = "";

        if(sltedGroupData.length>0){
          if(this.tabType!="mustRotaryDep"){
            for(var k=0;k<sltedGroupData.length;k++){
              if(sltedGroupData[k]["ts"]!=""){
                noMustTs = sltedGroupData[k]["ts"];
              }
              if(sltedGroupData[k]["optionalNum"]!=""){
                optionalNum = sltedGroupData[k]["optionalNum"];
              }
            }
          }


          for(var i=0;i<tempArr.length;i++){
            for(var k=0;k<sltedGroupData.length;k++){
              if(tempArr[i]["depId"]==sltedGroupData[k]["depId"]){
                tempArr[i] = Object.assign(tempArr[i],sltedGroupData[k]);
              }
            }
          }
        }
        if(this.tabType!="mustRotaryDep"){
          tempArr[0]["ts"] = noMustTs;
          if(tempArr.length==1){
            optionalNum = 1;
          }
          tempArr[0]["optionalNum"] = optionalNum;
        }
        //console.log("tempArr",tempArr);
        this.outlines[this.currGroupIndex][this.tabType] = tempArr;
      },


      /**
       * 添加组列表---必选科室
       */
      mustTemplate(data){
        let template = {
          "depSetId":"",
          "greatName":"",   //组分类
          "groupNo":"",     //组索引
          "isMustRotaryDep":"Y",   //是否必选科室
          "depId":"",    //科室id
          "depName":"",  //科室名称
          "ts":"",       //周期数
          "remark":"",   //备注
          "depIndex":"",      //所在当前行索引
          "optionalNum":""    //自选规则是必选则为空
        }
        return template;
      },


      /**
       * 添加组列表---自选科室
       */
      randomTemplate(data){
        let template = {
          "depSetId":"",
          "greatName":"",   //组分类
          "groupNo":"",     //组索引
          "isMustRotaryDep":"N",   //是否必选科室
          "depId":"",    //科室id
          "depName":"",  //科室名称
          "ts":"",       //周期数
          "remark":"",   //备注
          "depIndex":"",      //所在当前行索引
          "optionalNum":""    //自选规则是必选则为空
        }
        return template;
      },


      /**
       * 打开设置科室弹窗
       * @param currGroupIndex {number}  当前组的索引
       * @param tabType {string}   哪一类表格数据  必填 mustRotaryDep   自选 randomRotaryDep
       */
      openSetDepWin(currGroupIndex,tabType){
        this.currGroupIndex = currGroupIndex;
        this.tabType = tabType;

        this.operailityData = this.outlines[currGroupIndex][tabType];

        this.openModel("setDep");
      },


      /**
       * 添加组
       */
      addDep(){
        this.outlines.push(this.groupTemplate);
      },


      /**
       * 删除组
       * @param index {number}  组的索引
       */
      delGroup(index){
        this.outlines.splice(index,1);
      },


      /**
       * 添加组
       */
      addGroup(){
        if(this.groupOtions.length==this.outlines.length){
          this.showMess("最对可以添加二十个组!");
          return;
        }
        let addTemplate = this.getFormData(this.groupTemplate);
        this.outlines.push(addTemplate);
      },


      /**
       * 删除组下面单条数据
       * @param groupIndex {number}  当前组的索引
       * @param rowIndex {number}  组的索引
       * @param tabType {string}  哪一类表格数据  必填 mustRotaryDep   自选 randomRotaryDep
       */
      delGroupItem(groupIndex,rowIndex,tabType){
        this.outlines[groupIndex][tabType].splice(rowIndex,1);
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let tempArr = [];
        for(var i=0,item;i<this.outlines.length;i++){
          item = this.outlines[i];
          for(var k=0;k<item["mustRotaryDep"].length;k++){
            item["mustRotaryDep"][k]["greatName"] = item["greatName"];
          }
          let ts= 0,optionalNum=0;
          for(var k=0;k<item["randomRotaryDep"].length;k++){
            if(k==0){
              ts = item["randomRotaryDep"][k]["ts"];
              optionalNum = item["randomRotaryDep"][k]["optionalNum"];
            }else{
              item["randomRotaryDep"][k]["ts"] = ts;
              item["randomRotaryDep"][k]["optionalNum"] = optionalNum;
            }
            item["randomRotaryDep"][k]["greatName"] = item["greatName"];
          }
          tempArr = tempArr.concat(item["mustRotaryDep"]);
          tempArr = tempArr.concat(item["randomRotaryDep"]);
        }
        this.formValidate.gradeNum = this.conductDate(this.formValidate.gradeNum,"yyyy");
        this.formValidate.outlines = tempArr;

        //this.formValidate.outlines  greatName  mustRotaryDep  randomRotaryDep
         let isSubmit = this.submitForm("formValidate");
         if(isSubmit){
         if(!isLoadingFun) isLoadingFun=function(){};
         isLoadingFun(true);
         this.copyOutline.ajaxParams.data=this.getFormData(this.formValidate);
         this.ajax(this.copyOutline,isLoadingFun)
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','copy');
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      cancelSetDep(options){
        this[options+'Modal'] = false;
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },

    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {
      add
    }
  }
</script>


