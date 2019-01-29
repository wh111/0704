<!---实习大纲管理-添加--->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="2">
        <div class="cal-schoolTit" style="text-align: right;">名称:</div>
      </el-col>
      <el-col :span="4">
        <el-input v-model="formValidate.outlineName"></el-input>
      </el-col>
      <el-col :span="2">
        <div class="cal-schoolTit" style="text-align: right;">学校:</div>
      </el-col>
      <el-col :span="5">
        <search-select v-if="" @setSltOptionValue="setSltOptionValue" :selectOptions="selectOptions"></search-select>
      </el-col>
      <el-col :span="2">
        <div class="cal-schoolTit" style="text-align: right;">专业:</div>
      </el-col>
      <el-col :span="4">
        <dictionary-select @setSltOptionValue="setSpecialtyOptionValue" :selectOptions="specialtyOptions"></dictionary-select>
      </el-col>
      <el-col :span="2">
        <div class="cal-schoolTit" style="text-align: right;">年级:</div>
      </el-col>
      <el-col :span="3">
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
                  <el-input v-model="groupItem.greatName" style="width: 120px;" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-form>

            </div>

            <el-table
              border
              align="center"
              :data="groupItem.mustRotaryDep"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column
                prop="depName"
                label="科室"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                label="周期"
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
                  <el-input  v-model="scope.row.remark" placeholder="请输入内容"></el-input>
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
                    <col name="'el-table_1_column_'+index" :width="130">
                  </colgroup>

                  <tbody>
                  <tr v-for="(item,index) in groupItem.randomRotaryDep">
                    <td>
                      &nbsp;&nbsp;&nbsp;&nbsp;{{item.depName}}
                    </td>
                    <td class="valiTableStyle" align="center">
                      <el-form :model="{rotaryUserNum:item.rotaryUserNum}" ref="f" :rules="rules"  label-width="0" style="display: inline-block">
                        <el-form-item  prop="rotaryUserNum">
                      <el-input placeholder="请输入内容" style="width: 90%" v-model="item.rotaryUserNum"></el-input>
                        </el-form-item>
                      </el-form>
                    </td>
                    <td align="center">
                      <el-input placeholder="请输入内容" style="width: 90%" v-model="item.remark"></el-input>
                    </td>
                    <td class="valiTableStyle" v-show="index==0" :rowspan="groupItem.randomRotaryDep.length" align="center">
                      <el-form :model="{ts:item.ts}" ref="f" :rules="rules"  label-width="0" style="display: inline-block">
                        <el-form-item  prop="ts">
                      <el-input @change.native="valTsAndRandomNum(groupIndex,item.ts,item.optionalNum,groupItem.randomRotaryDep.length)" placeholder="请输入内容" v-model="item.ts" style="width: 50px"></el-input> 周
                        </el-form-item>
                      </el-form>
                    </td>
                    <td class="valiTableStyle" v-show="index==0" :rowspan="groupItem.randomRotaryDep.length" align="center">
                      <el-form :model="{ts:item.optionalNum}" ref="f" :rules="rules"  label-width="0" style="display: inline-block">
                        <el-form-item  prop="ts">
                      自选 <el-input @change.native="valTsAndRandomNum(groupIndex,item.ts,item.optionalNum,groupItem.randomRotaryDep.length)" placeholder="请输入内容" v-model="item.optionalNum" style="width: 50px"></el-input> 科
                        </el-form-item>
                      </el-form>
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
      props:['rules'],
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
          key :'rotaryUserNum',
          label :'可选人数',
        }
        ,{
          key :'remark',
          label :'备注',
        },
          {
          key :'titleSub',
          label :'周期',
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
        "outlines":[],
          outlineName:'',
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
        },

        //请求专业数据
        specialtyOptions:{
          multiple:false,    //是否多选
          url: api.specialty.path,
        },

        //保存大纲
        saveOutline:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
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
          "greatName":"",   //组分类
          "groupNo":"",     //组索引
          "isMustRotaryDep":"N",   //是否必选科室
          "depId":"",    //科室id
          "depName":"",  //科室名称
          "ts":"",       //周期数
          "remark":"",   //备注
          "rotaryUserNum":"",  //可选人数
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
        if(this.formValidate.outlineName==""){
            this.errorMess("请填写名称!");
            return;
        }
        if(this.formValidate.schoolName==""){
            this.errorMess("请选择学校!");
            return;
        }
        if(this.formValidate.specialty==""){
          this.errorMess("请选择专业!");
          return;
        }
        if(this.formValidate.gradeNum==""){
          this.errorMess("请选择年级!");
          return;
        }
        if(this.outlines.length==0){
          this.errorMess("请添加小组!");
          return;
        }

        let tempArr = [],valRandomArr=[],myFlag=true;
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
              valRandomArr.push({idx:i,ts:ts,randomNum:optionalNum,len:item["randomRotaryDep"].length});
            }else{
              item["randomRotaryDep"][k]["ts"] = ts;
              item["randomRotaryDep"][k]["optionalNum"] = optionalNum;
            }
            item["randomRotaryDep"][k]["greatName"] = item["greatName"];
          }
          if(item["mustRotaryDep"].length==0&&item["randomRotaryDep"].length==0){
            this.errorMess('您必须要填写:"必须轮转科室"!');
            myFlag = false;
            break;
          }
          tempArr = tempArr.concat(item["mustRotaryDep"]);
          tempArr = tempArr.concat(item["randomRotaryDep"]);
        }
        if(!myFlag) return;
        for(var i=0,item;i<valRandomArr.length;i++){
          item = valRandomArr[i];
          let flag = this.valTsAndRandomNum(item.idx,item.ts,item.randomNum,item.len);
          if(!flag){
            return;
            break;
          }
        }
        this.formValidate.gradeNum = this.conductDate(this.formValidate.gradeNum,"yyyy");
        this.formValidate.outlines = tempArr;
        //this.formValidate.outlines  greatName  mustRotaryDep  randomRotaryDep
        let isSubmit = this.submitForm("formValidate");
        //isSubmit = true;
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.saveOutline.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.saveOutline, isLoadingFun);
        }
      },


      /**
       * 验证轮转周期与自选是否匹配
       * @param idx {Number}  当前组所在索引
       * @param ts {Number}  周期数
       * @param radom  {Number}  任选其几
       * @param len  {Number}
       * */
      valTsAndRandomNum(idx,ts,randomNum,len){
        if(randomNum=="") return true;
        if(randomNum>len){
          this.errorMess(this.groupOtions[idx]+"自选规则："+randomNum+"不能大于自选轮转科室数量："+len);
          return false;
        }
        if(ts=="") return true;
        ts = parseInt(ts);
        randomNum = parseInt(randomNum);
        if(ts>=randomNum){
          return true;
        }else{
          this.errorMess(this.groupOtions[idx]+"您填写的周期数："+ts+" 与所填写的自选规则："+randomNum+"不能匹配!");
          return false;
        }
        /*let res = ts/randomNum
        if(String(res).indexOf(".")>-1){
          this.errorMess(this.groupOtions[idx]+"您填写的周期数："+ts+" 与所填写的自选规则："+randomNum+"不能匹配!");
          return false;
        }else{
            return true;
        }*/
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
        this.$emit('cancel','add');
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


