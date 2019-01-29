<!----------------------------------
****--@name     第一步：设置轮转科室
****--@role     ${*}
****--@date     2017/7/24
****--@author   gx
----------------------------------->
<!---设置轮转科室-添加--->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate"  class="demo-form-inline" label-width="120px" >
      <el-row >
        <el-col :span="18" :offset="3">
          <el-form-item label="培训标准名称:" prop="rtName">
            {{formValidate.rtName}}
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="9" :offset="3">
          <el-form-item label="基地名称:" prop="jdName">
            {{formValidate.jdName}}
          </el-form-item>
        </el-col >
        <el-col :span="9" v-if="rtModelType=='YJS'">
          <el-form-item style="width:300px" label="培训方向:">
            {{formValidate.rtProclass}}
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col  :span="18" :offset="3">
          <el-form-item label="培训简介:" prop="rtIntroduce">
            {{formValidate.rtIntroduce}}
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col  :span="18" :offset="3">
          <el-form-item label="培训目标:" prop="rtTarget">
            {{formValidate.rtTarget}}
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col  :span="18" :offset="3" >
          <el-form-item label="培训方法:" prop="rtMethod">
            {{formValidate.rtMethod}}
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col  :span="18" :offset="3" >
          <el-form-item label="备注:" prop="rtAdmrank">
            {{formValidate.rtAdmrank}}
          </el-form-item>
        </el-col >
      </el-row >
    </el-form>
    <br />
    <div class="el-form">
      <el-row v-if="outlines.length>0" :gutter="10">
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="18">
          <div style="margin: 8px 0;" v-for="(groupItem,groupIndex) in outlines" :key="groupIndex" class="form-fieldset-wrapper">
            <div class="form-fieldset-del">
            </div>
            <fieldset style="min-height:90px;">
              <legend style="font-size:16px">&nbsp;&nbsp;{{groupOtions[groupIndex]}}&nbsp;&nbsp;</legend>
              <div class="cal-schoolTit">
                必须轮转科室
              </div>
              <el-table
                border
                align="center"
                :data="groupItem.mustRotaryDep[0]"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column
                  prop="depName"
                  label="科室"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  label="培训周期"
                  prop="ts"
                  align="center">
                  <template scope="scope">
                    {{scope.row.ts}} 月
                  </template>
                </el-table-column>
              </el-table>
              <br />
              <div v-for="(randomItem,randomIndex) in  groupItem.randomRotaryDep">
              <div class="cal-schoolTit">
                可选轮转科室
              </div>
              <br />
              <div style="overflow: auto;margin: 0 auto" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
                <table :width="'100%'">

                  <colgroup  v-for="(item,index) in noMustHeader">
                    <col :name="'el-table_1_column_'+index" :width="150">
                  </colgroup>
                  <thead>
                  <tr>
                    <th class="cell" v-for="(item,index) in noMustHeader">
                      {{item.label}}
                    </th>
                  </tr>
                  </thead>
                </table>
                <div v-if="randomItem.length>0" class="el-table__body-wrapper" style="max-height:400px;overflow-x: hidden;overflow-y: auto;">
                  <table   :width="'100%'">
                    <colgroup  v-for="(item,index) in noMustHeader">
                      <col name="'el-table_1_column_'+index" :width="150">
                    </colgroup>
                    <tbody  class="add-scope">
                    <tr v-for="(item,index) in randomItem">
                      <td>
                        &nbsp;&nbsp;&nbsp;&nbsp;{{item.depName}}
                      </td>
                      <td v-show="index==0" :rowspan="randomItem.length" align="center">
                        {{groupItem.ts[randomIndex]}} 月
                      </td>
                      <td v-show="index==0" :rowspan="randomItem.length" align="center">
                        {{groupItem.optionalNum[randomIndex]}}
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="el-table__empty-block" v-else><span class="el-table__empty-text">暂无数据</span></div>
              </div>
              </div>
            </fieldset>
          </div>
        </el-col>
        <el-col :span="3">&nbsp;</el-col>
      </el-row>
      <el-row :gutter="10" v-else>
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="18"><div class="cal-schoolTit" style="border: 1px solid #ececec;padding: 20px;"><span class="el-table__empty-text">还没有阶段</span></div></el-col>
        <el-col :span="3">&nbsp;</el-col>
      </el-row>
    </div>
    <br />
    <el-row :gutter="10">
      <el-col :span="3">&nbsp;</el-col>
      <el-col :span="18">
      </el-col>
      <el-col :span="3">&nbsp;</el-col>
    </el-row>
    <br />
    <div v-if="ishide"></div>
    <el-row>
      <el-col :span="10" class="textCenter">&nbsp;</el-col>
      <el-col :span="4" class="textCenter"><load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn></el-col>
      <el-col :span="10" class="textCenter">&nbsp;</el-col>
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
  import add from "../rdyTrainingStandards_setDep.vue";
  //引入--操作url的api
  import api from "../../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props: ['rules', 'rtId', 'rtModelType'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn:{title:'下一步',callParEvent:'listenSubEvent'},
        ishide:false,
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
        },
          {
            key :'ts',
            label :'培训周期',
          },
          {
            key :'depRandomNum',
            label :'任选其几',
          },
        ],

        noMustBody:[],

        //form表单bind数据
        formValidate: {
          "rtId":'',
          "rtName":"",  //培训标准名称
          "rtProclass":"",  //专业   ,从基地获取，是基地里的培训方向
          "rtSchlength":"",  //学历
          "rtAdmrank":"",   //备注
          "rtMethod":"",      //培训方法
          "rtIntroduce":"",     //培训简介
          "rtTarget":"",        //培训目标
          "rtChechRea":"",      //教学、科研能力培训
          "rtOtherContent":"",    //其他内容
          "rtType":"0",          //指标类型
          "rtrulesType":"西医",       //西医/中医
          "jdName":"",          //基地名
          "rtModelType":"ZYY",     //细则对应模块
          "jdId":"",            //基地ID
          outlines:[],
        },
        currGroupIndex:"",
        tabType:"",
        groupNo:'',
        //组格式化组
        groupOtions:[
          "第一阶段","第二阶段","第三阶段","第四阶段","第五阶段","第六阶段","第七阶段","第八阶段","第九阶段","第十阶段","第十一阶段","第十二阶段","第十三阶段","第十四阶段","第十五阶段","第十六阶段","第十七阶段","第十八阶段","第十九阶段","第二十阶段"
        ],
        groupTemplate:{
          "mustRotaryDep":[[]],
          "randomRotaryDep": [[]],
          ts:[''],
          optionalNum:[''],
        },
        outlines: [],
        jDData:[],
        //获取基地数组
        getJd :{
          ajaxSuccess:'getJdData',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:api.BaseManageGetList.path
          },
        },
        //获取数据
        getOutline :{
          ajaxSuccess:'rulesgetGetData',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:api.rulesgetGet.path
          },
        },

        //
        saveOutline:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'saveOutlineSuccess',
          ajaxError:'ajaxError',
          error:'saveError',
          ajaxParams:{
            url:api.rulesAddOrEdit.path,
            jsonString:true,
            method:api.rulesAddOrEdit.method,
          },
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        this.ajax(this.getJd);
        this.getOutline.ajaxParams.url = api.rulesgetGet.path+this.rtId
        this.ajax(this.getOutline);
      },


      //当存在rtId时获取细则
      rulesgetGetData(res){
          let data = res.data;
          if(!data)return;
          this.outlines = this.conductOutLine(data.outlines);
          data.outlines = [];
          this.formValidate = data;

      },

      conductOutLine(data){
          if(data==0 || !data)return [];
          let tempArr = []

        for(let key in data){
          let index = key.split('_')[1]-1;
          let item =  data[key];
          let obj = {
            "mustRotaryDep":[],
            "randomRotaryDep": [[]],
            ts:[],
            optionalNum:[],
          };
          //添加标准科室
          for(let i=0;i<item.mustRotaryDep.length;i++){
            item.mustRotaryDep[i].depId = item.mustRotaryDep[i].cdepId;
            item.mustRotaryDep[i].depName = item.mustRotaryDep[i].cdepName;
          }
          obj.mustRotaryDep.push(item.mustRotaryDep);
          //添加轮转科室
          let randomRotaryDep =[];
          let ts=[];
          let optionalNum=[];
          for(let i=0;i<item.randomRotaryDep.length;i++){
            let randomRotaryIndex = item.randomRotaryDep[i].depGroupNo-1;
            item.randomRotaryDep[i].depId = item.randomRotaryDep[i].cdepId;
            item.randomRotaryDep[i].depName = item.randomRotaryDep[i].cdepName;
            if(!randomRotaryDep[randomRotaryIndex]){
              randomRotaryDep[randomRotaryIndex] = [];
              ts[randomRotaryIndex] = item.randomRotaryDep[i].ts;
              optionalNum[randomRotaryIndex] = item.randomRotaryDep[i].depRandomNum;
            }
            randomRotaryDep[randomRotaryIndex].push(item.randomRotaryDep[i])
          }
          obj.ts = ts;
          obj.randomRotaryDep = randomRotaryDep;
          obj.optionalNum = optionalNum;
          tempArr[index]=obj;
        }
        for (let l=0;l<tempArr.length;l++){
          let item = tempArr[l];
          if(!item){
            tempArr[l] =  {
              "mustRotaryDep":[[]],
              "randomRotaryDep": [[]],
              ts:[''],
              optionalNum:[''],
            }
          }
        }
        return tempArr;
      },

      //获取基地集合
      getJdData(res){
        let data = res.data;
        if(!data)return;
        this.jDData = data;

      },

      /**
       * 添加组列表---filter添加的数据
       */
      filterAddDepData(data){
          let type = this.tabType=='mustRotaryDep'? 'Y':'N';
         let tempArr = [];
         for (let i=0;i<data.length;i++){
            let {depId,depName} = data[i];
            let  template = this.randomTemplate(type);
           template =Object.assign(template,data[i]) ;
           template.cdepId = depId;
           template.cdepName = depName;
           tempArr.push(template);
         }
          this.outlines[this.currGroupIndex][this.tabType][this.groupNo] = tempArr;
      },


      //添加可轮转科室
      randomItemAdd(item,groupItem){
        item.push([]);
        groupItem.ts.push('');
        groupItem.optionalNum.push('');
      },
      //移除可轮转科室
      randomItemRemove(item,index,groupItem){
        item.splice(index,1);
        groupItem.ts.splice(index,1);
        groupItem.optionalNum.splice(index,1);
      },

      /**
       * 添加组列表----科室
       */
      randomTemplate(type){
        let template = {
          rdId:'',
          "depPhase":"",  //科室阶段
          "depPhaseNum":'',    ///阶段ID
          "depGroupNo":'',        // 组号
          "isMustRotaryDep":type,     // Y 必须轮转 N 任选
          "cdepId":'',           // 标准科室ID
          "cdepName":"",      // 标准科室名称
          "ts":'',                 // 周期
          "depOrder":'', // 科室顺序
          "depRandomNum":'' // 任选时有值 任选其几
        };
        return template;
      },


      /**
       * 打开设置科室弹窗
       * @param currGroupIndex {number}  当前组的索引
       * @param tabType {string}   哪一类表格数据  必填 mustRotaryDep   自选 randomRotaryDep
       */
      openSetDepWin(currGroupIndex,tabType,groupNo){
        this.groupNo = groupNo;
        this.currGroupIndex = currGroupIndex;
        this.tabType = tabType;
        this.operailityData = this.outlines[currGroupIndex][tabType][this.groupNo];
        this.openModel("setDep");
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
          this.showMess("最对可以添加二十个阶段!");
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
      delGroupItem(item,index){
        item.splice(index,1);
        this.ishide =  !this.ishide;  //因为删除可选科室不改变页面，添加一个标签来使页面重新渲染
      },



      saveError(res){
        let title = this.formValidate.rtId ? '修改失败' : '保存失败';
        this.errorMess(title);

      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        this.$emit('next');

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
    },
  }
</script>


