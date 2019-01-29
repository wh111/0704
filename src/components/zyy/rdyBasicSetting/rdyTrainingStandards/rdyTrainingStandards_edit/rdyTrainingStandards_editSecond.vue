<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/7/24
****--@author   gx
----------------------------------->
<template>
    <div>
      <layout-tree style="height: 550px">
        <el-menu slot="left" style="height:inherit;;overflow:auto;" mode="vertical" default-active="0-0" class="el-menu-vertical-demo">
          <el-menu-item-group v-for="(item,i) in getRulesDepData" :key="i" :title="item[0]&&item[0].depPhase">
            <el-menu-item style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width:200px;"  v-for="(groupItem,index) in item" :key="index" @click="groupItemClick(groupItem)"  :index="i+'-'+index">{{groupItem.cdepName}}</el-menu-item>
          </el-menu-item-group>
        </el-menu>

        <div slot="right"  style="height:inherit;">
          <el-form  :model="formValidate" :rules="rdyTrainingStandardsSecond"  ref="formValidate1"  label-width="90px">
                <el-form-item label="培训目的:" prop="depsetPurpose">
                  <el-input :rows="5"  resize="none" type="textarea" v-model="formValidate.depsetPurpose" placeholder="请输入"></el-input>
                </el-form-item>
          </el-form>
          <div style="margin-bottom:5px">
            <el-button style="float: right" size="small" type="primary" @click="add()" icon="plus"></el-button>
          </div>
          </br>
          <el-table
            v-for="item in 1"
            :key="item"
            align="center"
            height="325"
            :data="formValidate.depRequirements"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;height: 100%">
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="70">
            </el-table-column>
            <el-table-column
              align="center"
              prop="deName"
              class-name="valiTableStyle"
              label="考核指标"
              show-overflow-tooltip>
              <template scope="scope">
                <el-form  :model="scope.row" :rules="rdyTrainingStandardsSecond" ref="formValidate"  label-width="90px">
                  <el-form-item  prop="deName" label-width="0">
                    <el-input v-model="scope.row.deName" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="deDetype"
              label="分类"
              class-name="valiTableStyle"
              width="150"
              show-overflow-tooltip>
              <template scope="scope">
                <el-form  :model="scope.row" :rules="rdyTrainingStandardsSecond" ref="formValidate"  label-width="0">
                  <el-form-item  prop="deDetype" label-width="0">
                    <el-select v-model="scope.row.deDetype" >
                      <el-option
                        v-for="item in disType"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                      </el-option>

                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="deShowtype"
              show-overflow-tooltip
              label="类型"
              class-name="valiTableStyle"
              align="center"
              width="150"
            >
              <template scope="scope">
                  <el-form  :model="scope.row" :rules="rdyTrainingStandardsSecond" ref="formValidate"  label-width="0">
                    <el-form-item  prop="deShowtype" label-width="0">
                      <el-select v-model="scope.row.deShowtype" >
                        <el-option label="文本" value="TEXT"></el-option>
                        <el-option label="表格"  value="TABLE"></el-option>
                      </el-select>
                    </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="deMasterDegree"
              show-overflow-tooltip
              label="掌握程度"
              class-name="valiTableStyle"
              align="center"
              width="150"
            >
              <template scope="scope">
                <el-form  :model="scope.row" :rules="rdyTrainingStandardsSecond" ref="formValidate"  label-width="0">
                  <el-form-item  prop="deMasterDegree" label-width="0">
                    <el-select v-model="scope.row.deMasterDegree" >
                      <el-option
                        v-for="item in deMasterDegreeData"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="deCountBasic"
              label="3年要求"
              class-name="valiTableStyle"
              show-overflow-tooltip
            >
              <template scope="scope">
                <el-form  :model="scope.row" :rules="rdyTrainingStandardsSecond" ref="formValidate"  label-width="90px">
                  <el-form-item  prop="deCountBasic" label-width="0">
                    <el-input v-model="scope.row.deCountBasic" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="deCountBasicSecond"
              label="2年要求"
              class-name="valiTableStyle"
              show-overflow-tooltip
            >

              <template scope="scope">
                <el-form  :model="scope.row" :rules="rdyTrainingStandardsSecond" ref="formValidate"  label-width="90px">
                  <el-form-item  prop="deCountBasicSecond" label-width="0">
                    <el-input v-model="scope.row.deCountBasicSecond" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="deCountBasicFirst"
              label="1年要求"
              class-name="valiTableStyle"
              show-overflow-tooltip
            >
              <template scope="scope">
                <el-form  :model="scope.row" :rules="rdyTrainingStandardsSecond" ref="formValidate"  label-width="90px">
                  <el-form-item  prop="deCountBasicFirst" label-width="0">
                    <el-input v-model="scope.row.deCountBasicFirst" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80">
              <template scope="scope">
                <el-button size="small"  type="danger" @click="remove(formValidate.depRequirements,scope.$index)" icon="close"></el-button>
              </template>
            </el-table-column>

          </el-table>
          </br>
          <el-row >
            <el-col :span="10" :offset="10">
              <div style="margin-left: 100px">
                <load-btn @listenSubEvent="saveSubEvent" :btnData="saveBtn"></load-btn>
              </div>
            </el-col>
          </el-row >

        </div>
      </layout-tree>
      <hr>
      </br>
      <el-row>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>

        <el-col :span="8" class="textCenter">
          <el-button @click="$emit('last')">上一步</el-button>
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
         </el-col>
        <el-col  class="textCenter">&nbsp;</el-col>
      </el-row>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import layoutTree from "../../../../common/layoutTree.vue";
    //引入--操作url的api
    import api from "../../api.js";

    import {rdyTrainingStandardsSecond} from "../../../rules";
    //当前组件引入全局的util
    let Util = null;
    export default{
        props:['rtId','resizeSecond'],
        data() {
            return {
              rdyTrainingStandardsSecond,
                rdId :'',
              //保存按钮基本信息
              saveBtn:{title:'提交',callParEvent:'listenSubEvent'},
              loadBtn:{title:'下一步',callParEvent:'listenSubEvent'},
              disType:[],  //分类名称数组
              formValidate:{
               /* "depsetPurpose":"培训计划",
                "cdepId":1,
                "cdepName":"科室名称",
                "depRequirements":[
                  {
                    "deId":'',
                    "deName":"考核名称",
                    "deType":"分类",
                    "deDetype":"指标类型(病种、技能、教学活动等类型)",
                    "deLeveltype":"基本较高要求",
                    "deShowtype":"页面显示类型(表格文本)",
                    "deCountBasic":"三年要求数量",
                    "deCountBasicSecond":"两年要求数量",
                    "deCountBasicFirst":"一年要求数量"
                  }
                ]*/
              },

              cdep:{
                cdepName:'',
                cdepId:'',
              },
              getRulesDepData:[],
              //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
              listMessTitle:{
                ajaxSuccess:'updateListData',
                ajaxParams:{
                  url:api.getRulesDep.path+this.rtId,
                  params:{}
                }
              },
              //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
              getMessTitle:{
                ajaxSuccess:'getRulesDepSuccess',
                ajaxParams:{
                  url:api.getRulesDepRequirement.path+this.rtId+'/',
                  params:{}
                }
              },

              getDisType:{
                ajaxSuccess:'getDisTypeSuccess',
                ajaxParams:{
                  url:api.disType.path,
                  params:{}
                }
              },
              getDeMasterDegree:{
                ajaxSuccess:'getDeMasterDegreeSuccess',
                ajaxParams:{
                  url:'/dictionary/getByCode/ROTARY_MASTER_DEGREE',
                  params:{}
                }
              }
            }
        },
        methods: {
          //初始化请求列表数据
          init(){
            this.ajax(this.listMessTitle);
            this.ajax(this.getDeMasterDegree);
          },

          listenSubEvent(){
              this.$emit('next');
          },
          getDisTypeSuccess(res){
            let data = res.data;
            if(!data)return;
            data = data.child;
            this.disType = data;
          },


          //获取掌握程度
          getDeMasterDegreeSuccess(res){
            let data = res.data;
            if(!data)return;
            data = data.child;
            this.deMasterDegreeData = data;

          },

          //提交保存
          saveSubEvent(isLoadingFun){
            let isSubmit = this.submitForm("formValidate");
            if(isSubmit) {
              if (!isLoadingFun) isLoadingFun = function (){};
              isLoadingFun(true);
              let saveMessTitle={
                  ajaxSuccess:'saveSuccess',
                  ajaxError:'ajaxError',
                  errorTitle:'保存失败',
                  ajaxParams:{
                    url:api.rulesDepRequirementAddOrEdit.path+this.rtId+'-'+this.rdId,
                    jsonString:true,
                    method:'post',
                    data:this.formValidate,
                  }
                };
            this.ajax(saveMessTitle,isLoadingFun);
            }
          },

          /*
           * 点击提交按钮 监听是否验证通过
           * @param formName string  form表单v-model数据对象名称
           * @return flag boolean   form表单验证是否通过
           * */
          submitForm(formName){
            let flag = true;
            for(let i =0;i< this.$refs[formName].length; i++){
              this.$refs[formName][i].validate((valid) => {
                if(!valid) {
                  flag= false;
                }
              });
            }
            this.$refs[formName+'1'].validate((valid) => {
              if (!valid) {
                flag = false;
              }
            });

            return flag;
          },


          //保存成功回调
          saveSuccess(res){
                this.successMess('修改成功')
          },


          //查看细则下科室设置
          updateListData(res){
            let data = res.data;
            if(!data) return;
            let tempArr = [];
            for(let i in data){
              let index = i.split('_')[1]-1;
              tempArr[index] = [];
              for(let k=0 ;k<data[i].mustRotaryDep.length;k++){
                tempArr[index].push(data[i].mustRotaryDep[k]);
              }
              for(let l=0 ;l<data[i].randomRotaryDep.length;l++){
                tempArr[index].push(data[i].randomRotaryDep[l]);
              }
            }
            for(let l=0;l<tempArr.length;l++){
              let item = tempArr[l];
              if(!item){
                tempArr.splice(l,1)
                l--
              }
            }
            this.groupItemClick(tempArr[0][0]);
            this.getRulesDepData = tempArr;
          },

          getRulesDepSuccess(res){
              let data = res.data;
              if(!data || data==0) {
                data={
                  "depsetPurpose":"",
                  "cdepId":this.cdep.cdepId,
                  "cdepName":this.cdep.cdepName,
                  "depRequirements":[
                    {
                      "deId":'',
                      "deName":"",
                      "deType":"",
                      "deDetype":"",
                      "deLeveltype":"基本要求",
                      "deShowtype":"",
                      "deCountBasic":"",
                      "deCountBasicSecond":"",
                      "deCountBasicFirst":"",
                      deMasterDegree:"",
                    }
                  ]
                }
              }
              this.formValidate = data;
          },



          groupItemClick(item){
            this.rdId = item.rdId;
            this.cdep.cdepName=item.cdepName;
            this.cdep.cdepId=item.cdepId;
            this.getMessTitle.ajaxParams.url = api.getRulesDepRequirement.path+this.rtId+'-'+item.rdId;
            this.ajax(this.getMessTitle);
          },

          //增加列表项
          add(){
            this.formValidate.depRequirements.push({
              "deId":'',
              "deName":"",
              "deType":"",
              "deDetype":"",
              "deLeveltype":"基本要求",
              "deShowtype":"",
              "deCountBasic":"",
              "deCountBasicSecond":"",
              "deCountBasicFirst":"",
              deMasterDegree:"",
            })

          },

          //移除列表数据
          remove(depRequirements,index){
            depRequirements.splice(index,1);
          }
        },
        created(){
            this.init();
          this.ajax(this.getDisType);
        },
        mounted(){
        },
        components: {
          layoutTree
        },
      watch:{
        resizeSecond(){
            this.init()
        }
      },
    }
</script>
