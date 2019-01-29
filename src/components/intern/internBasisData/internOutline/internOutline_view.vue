<!---实习大纲管理-查看--->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="22">
        <div class="cal-schoolTit" >
          名称:{{formValidate.outlineName||'--'}}&nbsp;&nbsp;&nbsp;&nbsp;
          学校:{{formValidate.schoolName}}&nbsp;&nbsp;&nbsp;&nbsp;
          专业:{{formValidate.specialty}}&nbsp;&nbsp;&nbsp;&nbsp;
          年级:{{formValidate.gradeNum}}&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </el-col>
    </el-row>
    <br />
    <div class="el-form">
      <el-row v-if="outlines.length>0" :gutter="10">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="22">
          <div style="margin: 8px 0;" v-for="(groupItem,groupIndex) in outlines" :key="groupIndex" class="form-fieldset-wrapper">
            <fieldset style="min-height:90px;">
              <legend style="font-size:16px">&nbsp;&nbsp;{{groupOtions[groupIndex]}}&nbsp;&nbsp;</legend>
              <div class="cal-schoolTit">
                必须轮转科室 &nbsp;&nbsp;&nbsp;&nbsp;
                组分类名称：{{groupItem.greatName}}
              </div>

              <el-table
                border
                ref="multipleTable"
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
                  label="周期"
                  align="center">
                  <template scope="scope">
                    {{scope.row.ts}}周
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备注"
                  align="center">
                </el-table-column>
              </el-table>

              <br />
              <div class="cal-schoolTit">
                自选轮转科室
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
                        {{item.rotaryUserNum}}
                      </td>
                      <td align="center">
                        {{item.remark}}
                      </td>
                      <td v-show="index==0" :rowspan="groupItem.randomRotaryDep.length" align="center">
                        {{item.ts}}周
                      </td>
                      <td v-show="index==0" :rowspan="groupItem.randomRotaryDep.length" align="center">
                        自选{{item.optionalNum}}科
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
    <el-row>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
      <el-col :span="8" class="textCenter"><el-button  @click="cancel">关闭</el-button></el-col>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
    </el-row>
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
    props: ['operailityData'],
    data() {
      return {
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



        //获取大纲详情
        getOutline:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.dgGet.path+"/"+this.operailityData["outlineId"],
          }
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
        obj["outlineName"] = data["outlineName"];
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
        this.formValidate = Object.assign(this.formValidate,obj);
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
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




