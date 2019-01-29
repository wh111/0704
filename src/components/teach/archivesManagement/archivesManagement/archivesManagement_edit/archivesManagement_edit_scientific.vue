<!--档案管理修改-->
<!--科研信息-->

<template>

  <div >
    <!--标题-->
    <el-row >
      <el-col :span="24" class="lose-margin2" style="text-align: center;">
        <span class="table-headline ">科研信息</span>
      </el-col >
    </el-row >
    <!--内容-->
    <el-form   ref="formValidate" label-width="100px" class="demo-ruleForm archivesEdit">

      <el-row >
        <el-col :span="24" class="lose-margin2">
          <fieldset class="layui-elem-field layui-field-title">
            <legend>本人从事的主要研究方向的特点、意义及其水平</legend>
            <div class="layui-field-box">
              <el-form-item prop="subject">
                <el-input v-model="secientData.secient.directionInfo"  type="textarea" :rows="5"  resize="none"></el-input>
              </el-form-item>
            </div>
          </fieldset>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="24" class="lose-margin2">
          <fieldset class="layui-elem-field layui-field-title">
            <legend>学术团体任职情况</legend>
            <div class="layui-field-box">
              <el-form-item prop="subject">
                <el-input v-model="secientData.secient.groupWorkInfo" type="textarea" :rows="5"  resize="none"></el-input>
              </el-form-item>
            </div>
          </fieldset>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="24" class="lose-margin2">
          <fieldset class="layui-elem-field layui-field-title">
            <legend>在国内外核心期刊上发表学术论文情况</legend>
            <div class="layui-field-box">
              <el-row>
                <el-col :span="24" >
                  <el-table
                    align="center"
                    :data="secientData.paperList"
                    tooltip-effect="dark"
                    highlight-current-row
                    style="width: 100%">
                    <el-table-column
                      prop="subject"
                      label="论文题目">
                      <template scope="scope">
                        <el-form-item prop="subject">
                          <el-input style="width: 100%;" v-model="scope.row.subject"  placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="刊物名称">
                      <template scope="scope">
                        <el-form-item prop="name">
                          <el-input style="width: 100%;" v-model="scope.row.name"  placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="country"
                      label="刊物国家">
                      <template scope="scope">
                        <el-form-item prop="country">
                          <el-input style="width: 100%;" v-model="scope.row.country"  placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="includedInfo"
                      label="收录情况">
                      <template scope="scope">
                        <el-form-item prop="includedInfo">
                          <el-input style="width: 100%;" v-model="scope.row.includedInfo"  placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="volume"
                      label="卷期">
                      <template scope="scope">
                        <el-form-item prop="volume">
                          <el-input style="width: 100%;" v-model="scope.row.volume"  placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="tops"
                      label="排名">
                      <template scope="scope">
                        <el-form-item prop="tops">
                          <el-input style="width: 100%;" v-model="scope.row.tops"  placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140px" align="left">
                      <template scope="scope">
                        <el-button size="small" type="danger" @click="delRow(scope.$index,'paperList')" v-if="secientData.paperList.length > 1">删除</el-button>
                        <el-button size="small" type="success" @click="addRow('paperList')" v-if="scope.$index == secientData.paperList.length - 1">添加</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </fieldset>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="24" class="lose-margin2">
          <fieldset class="layui-elem-field layui-field-title">
            <legend>出版专著教材情况（注：在书名后面注明教材或者专著）</legend>
            <div class="layui-field-box">
                  <el-row>
                    <el-col :span="24" >
                      <el-table
                        align="center"
                        :data="secientData.treatiseList"
                        tooltip-effect="dark"
                        highlight-current-row
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="name"
                          label="名称">
                          <template scope="scope">
                            <el-form-item prop="name">
                              <el-input style="width: 100%;" v-model="scope.row.name"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="type"
                          label="类别">
                          <template scope="scope">
                            <el-form-item prop="type">
                              <el-input style="width: 100%;" v-model="scope.row.type"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="company"
                          label="出版单位">
                          <template scope="scope">
                            <el-form-item prop="company">
                              <el-input style="width: 100%;" v-model="scope.row.company"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="date"
                          label="日期">
                          <template scope="scope">
                            <el-form-item prop="date">
                              <el-date-picker
                                v-model="scope.row.date"
                                type="date"
                                placeholder="选择日期"
                                style="width: 100%;"
                              >
                              </el-date-picker>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="tops"
                          label="排名">
                          <template scope="scope">
                            <el-form-item prop="tops">
                              <el-input style="width: 100%;" v-model="scope.row.tops"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140px" align="left">
                          <template scope="scope">
                            <el-button size="small" type="danger" @click="delRow(scope.$index,'treatiseList')" v-if="secientData.treatiseList.length > 1">删除</el-button>
                            <el-button size="small" type="success" @click="addRow('treatiseList')" v-if="scope.$index == secientData.treatiseList.length - 1">添加</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
            </div>
          </fieldset>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="24" class="lose-margin2">

          <fieldset class="layui-elem-field layui-field-title">
            <legend>成功获奖情况</legend>
            <div class="layui-field-box">
                  <el-row>
                    <el-col :span="24" >
                      <el-table
                        align="center"
                        :data="secientData.prizeList"
                        tooltip-effect="dark"
                        highlight-current-row
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="name"
                          label="成果名称">
                          <template scope="scope">
                            <el-form-item prop="name">
                              <el-input style="width: 100%;" v-model="scope.row.name"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="department"
                          label="颁发部门">
                          <template scope="scope">
                            <el-form-item prop="department">
                              <el-input style="width: 100%;" v-model="scope.row.department"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="level"
                          label="等级">
                          <template scope="scope">
                            <el-form-item prop="level">
                              <el-input style="width: 100%;" v-model="scope.row.level"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="finishDate"
                          label="完成日期">
                          <template scope="scope">
                            <el-form-item prop="finishDate">
                              <el-date-picker
                                v-model="scope.row.finishDate"
                                type="date"
                                placeholder="选择日期"
                                style="width: 100%;"
                              >
                              </el-date-picker>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="certificateNo"
                          label="证书号">
                          <template scope="scope">
                            <el-form-item prop="certificateNo">
                              <el-input style="width: 100%;" v-model="scope.row.certificateNo"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="tops"
                          label="排名">
                          <template scope="scope">
                            <el-form-item prop="tops">
                              <el-input style="width: 100%;" v-model="scope.row.tops"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140px" align="left">
                          <template scope="scope">
                            <el-button size="small" type="danger" @click="delRow(scope.$index,'prizeList')" v-if="secientData.prizeList.length > 1">删除</el-button>
                            <el-button size="small" type="success" @click="addRow('prizeList')" v-if="scope.$index == secientData.prizeList.length - 1">添加</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>

            </div>
          </fieldset>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="24" class="lose-margin2">
          <fieldset class="layui-elem-field layui-field-title">
            <legend>完成的科研项目</legend>
            <div class="layui-field-box">
                  <el-row>
                    <el-col :span="24" >
                      <el-table
                        align="center"
                        :data="secientData.projectList"
                        tooltip-effect="dark"
                        highlight-current-row
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="name"
                          label="项目名称">
                          <template scope="scope">
                            <el-form-item prop="name">
                              <el-input style="width: 100%;" v-model="scope.row.name"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="taskSource"
                          label="任务来源">
                          <template scope="scope">
                            <el-form-item prop="taskSource">
                              <el-input style="width: 100%;" v-model="scope.row.taskSource"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="finishType"
                          label="完成形式">
                          <template scope="scope">
                            <el-form-item prop="finishType">
                              <el-input style="width: 100%;" v-model="scope.row.finishType"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="date"
                          label="完成日期">
                          <template scope="scope">
                            <el-form-item prop="date">
                              <el-date-picker
                                v-model="scope.row.date"
                                type="date"
                                placeholder="选择日期"
                                style="width: 100%;"
                              >
                              </el-date-picker>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="company"
                          label="鉴定验收单位">
                          <template scope="scope">
                            <el-form-item prop="company">
                              <el-input style="width: 100%;" v-model="scope.row.company"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="result"
                          label="主要结论">
                          <template scope="scope">
                            <el-form-item prop="result">
                              <el-input style="width: 100%;" v-model="scope.row.result"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>

                        <el-table-column
                          prop="tops"
                          label="排名">
                          <template scope="scope">
                            <el-form-item prop="tops">
                              <el-input style="width: 100%;" v-model="scope.row.tops"  placeholder="请输入内容"></el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140px" align="left">
                          <template scope="scope">
                            <el-button size="small" type="danger" @click="delRow(scope.$index,'projectList')" v-if="secientData.projectList.length > 1">删除</el-button>
                            <el-button size="small" type="success" @click="addRow('projectList')" v-if="scope.$index == secientData.projectList.length - 1">添加</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
            </div>
          </fieldset>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="24" class="lose-margin2">
          <fieldset class="layui-elem-field layui-field-title">
            <legend>目前承担的主要项目</legend>
            <div class="layui-field-box">
              <el-row>
                <el-col :span="24" >
                  <el-table
                    align="center"
                    :data="secientData.shoulderList"
                    tooltip-effect="dark"
                    highlight-current-row
                    style="width: 100%">
                    <el-table-column
                      prop="name"
                      label="项目名称及下达编号">
                      <template scope="scope">
                        <el-form-item prop="name">
                          <el-input style="width: 100%;" v-model="scope.row.name"  placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </template>

                    </el-table-column>
                    <el-table-column
                      prop="projectType"
                      label="项目类别">
                      <template scope="scope">
                        <el-form-item prop="projectType">
                          <el-input style="width: 100%;" v-model="scope.row.projectType"  placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="taskSource"
                      label="任务来源">
                      <template scope="scope">
                        <el-form-item prop="taskSource">
                          <el-input style="width: 100%;" v-model="scope.row.taskSource"  placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="date"
                      label="起讫时间">
                      <template scope="scope">
                        <el-form-item prop="tops">
                          <el-date-picker
                            v-model="scope.row.date"
                            type="date"
                            placeholder="选择日期"
                            style="width: 100%;"
                          >
                          </el-date-picker>
                        </el-form-item>
                      </template>

                      </el-date-picker>
                    </el-table-column>
                    <el-table-column
                      prop="price"
                      label="科研经费（万元）">
                      <template scope="scope">
                        <el-form-item prop="price">
                          <el-input style="width: 100%;" v-model="scope.row.price"  placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="shoulderTask"
                      label="本人承担任务">
                      <template scope="scope">
                        <el-form-item prop="shoulderTask">
                          <el-input style="width: 100%;" v-model="scope.row.shoulderTask"  placeholder="请输入内容"></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140px" align="left">
                      <template scope="scope">
                        <el-button size="small" type="danger" @click="delRow(scope.$index,'shoulderList')" v-if="secientData.shoulderList.length > 1">删除</el-button>
                        <el-button size="small" type="success" @click="addRow('shoulderList')" v-if="scope.$index == secientData.shoulderList.length - 1">添加</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </fieldset>
        </el-col >
      </el-row >
    </el-form>
    <el-row >
      <el-col :span="24" style="text-align: center;">
        <load-btn @listenSubEvent="saveCurrData" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['dataId'],
    data (){
      return{

        //保存按钮基本信息
        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        //表格数据
        dataTemplate:{
          "paperList":{
            //paperList 在国内外核心期刊发表学术论文情况
            "subject":"",  //论文题目
            "name":"",  //刊物名称
            "country":"",  //刊物国际
            "includedInfo":"",  //收录情况
            "volume":"",  //卷期
            "tops":"",  //排名
          },
          "treatiseList":{
            //treatiseList 出版专著教材情况
            "name":"",  //名称
            "type":"",  //类别
            "company":"",  //出版单位
            "date":"",  //日期
            "tops":"",  //排名

          },
          "prizeList":{
            //prizeList 成果获奖情况
            "name":"",  //成果名称
            "department":"",  //颁奖部门
            "level":"",  //等级
            "finishDate":"",  //完成日期
            "certificateNo":"",  //证书号
            "tops":"",  //排名
          },
          "projectList":{
            //projectList 完成的科研项目
            "name":"",  //项目名称
            "taskSource":"",  //任务来源
            "finishType":"",  //完成形式
            "date":"",  //完成日期
            "company":"",  //鉴定验收单位
            "result":"",  //主要结论
            "tops":"",  //排名

          },
          "shoulderList":{
            //shoulderList 目前承担的主要项目
            "name":"",  //项目名称及下达编号
            "projectType":"",  //项目类别
            "taskSource":"",  //项目来源
            "date":"",  //起讫时间
            "price":"",  //科研经费(万元)
            "shoulderTask":"", //本人承担任务
          }
        },
        secientData:{
          "secient":{
            "id":'',
            "archivesId":'',
            "directionInfo":'',
            "groupWorkInfo":''
          },
          "projectList":[
            {
              "id":'',
              "name":'',
              "taskSource":'',
              "finishType":'',
              "date":'',
              "company":'',
              "result":'',
              "tops":'',
              "archivesId":''
            },
            {
              "id":'',
              "name":'',
              "taskSource":'',
              "finishType":'',
              "date":'',
              "company":'',
              "result":'',
              "tops":'',
              "archivesId":''
            }
          ],
          "paperList":[
            {
              "id":'',
              "subject":'',
              "name":'',
              "country":'',
              "includedInfo":'',
              "volume":'',
              "tops":'',
              "archivesId":''
            },
            {
              "id":'',
              "subject":'',
              "name":'',
              "country":'',
              "includedInfo":'',
              "volume":'',
              "tops":'',
              "archivesId":''
            }
          ],
          "prizeList":[
            {
              "id":'',
              "name":'',
              "department":'',
              "level":'',
              "finishDate":'',
              "certificateNo":'',
              "tops":'',
              "archivesId":''
            },
            {
              "id":'',
              "name":'',
              "department":'',
              "level":'',
              "finishDate":'',
              "certificateNo":'',
              "tops":'',
              "archivesId":''
            }
          ],
          "treatiseList":[
            {
              "id":'',
              "name":'',
              "type":'',
              "company":'',
              "date":'',
              "tops":'',
              "archivesId":''
            },
            {
              "id":'',
              "name":'',
              "type":'',
              "company":'',
              "date":'',
              "tops":'',
              "archivesId":''
            }
          ],
          "shoulderList":[
            {
              "id":'',
              "name":'',
              "projectType":'',
              "taskSource":'',
              "date":'',
              "price":'',
              "shoulderTask":'',
              "archivesId":''
            },
            {
              "id":'',
              "name":'',
              "projectType":'',
              "taskSource":'',
              "date":'',
              "price":'',
              "shoulderTask":'',
              "archivesId":''
            }
          ]
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'add',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/save/asd/'+this.dataId,
            method:'post',
            jsonString:'jsonString',
            data:{}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/archives/list/asd/'+this.dataId
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      //初始化
      this.init();
    },
    mounted(){

    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.initMessTitle);
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      saveCurrData(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          let data = this.getFormData(this.secientData);

          data = this.decrease(data);
          data.projectList =this.formDate(data.projectList,['date'],this.yearMonthData);
          data.prizeList = this.formDate(data.prizeList,['finishDate'],this.yearMonthData);
          data.treatiseList = this.formDate(data.treatiseList,['date'],this.yearMonthData);
          data.shoulderList = this.formDate(data.shoulderList,['date'],this.yearMonthData);
          this.editMessTitle.ajaxParams.data = data;
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },


      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        if(data.secient===null){
          data.secient = {
            "archivesId":'',
            "directionInfo":'',
            "groupWorkInfo":''
          }
        }
        this.secientData = data;
        let that = this;
        Util._.forEach(this.dataTemplate,function (v,key) {
          that.setTableDatTemplate(key);
        })
      },


      //设置tableData默认值
      setTableDatTemplate(key){
        let dataTemplate = Util._.defaultsDeep({},this.dataTemplate[key]);
        let tableDataSub = this.secientData[key];
        tableDataSub.push(dataTemplate);
        tableDataSub[tableDataSub.length-1].index=tableDataSub.length-1;
      },


      /*
       * 点击添加按钮触发
       * */
      addRow(key){
        this.setTableDatTemplate(key);
      },


      // 删除
      delRow(index,key) {
        let tableDataSub = this.secientData[key];
        tableDataSub.length && tableDataSub.splice(index, 1)
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
      },

      //去掉空值
      decrease(myData){
        let valValue = [];
        let keyArr = [];
        Util._.forEach(this.dataTemplate,function (v,key) {
          keyArr.push(key);
          valValue.push(Util._.keysIn(v));
        })
        for(var i=0,item,tempArr;i<keyArr.length;i++){
          tempArr = [];
          item = myData[keyArr[i]];
          for(var k=0;k<item.length;k++){
            if(!this.objValIsEmpty(item[k],valValue[i])){
              tempArr.push(item[k]);
            }
          }
          myData[keyArr[i]] = tempArr;
        }
        return myData
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);

        return myData;
      },

    }
  }
</script>




