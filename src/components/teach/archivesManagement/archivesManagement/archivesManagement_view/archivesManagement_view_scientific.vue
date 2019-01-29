<!--档案管理查看-->
<!--科研信息-->

<template>

  <div >
    <!--标题-->
    <el-row >
      <el-col :span="24" class="lose-margin2" style="text-align: center">
        <span class="table-headline ">科研信息</span>
      </el-col >
    </el-row >
    <!--内容-->
    <!--<el-row >-->
      <!--<el-col :span="22" :offset="1" class="lose-margin2">-->
        <!--<fieldset class="layui-elem-field layui-field-title">-->
          <!--<legend>本人从事的主要研究方向的特点、意义及其水平</legend>-->
          <!--<div class="layui-field-box">-->
            <!--<el-input v-model="secientData.secient.directionInfo"  type="textarea" :rows="5" readonly resize="none"></el-input>-->
          <!--</div>-->
        <!--</fieldset>-->
      <!--</el-col >-->
    <!--</el-row >-->

    <!--<el-row >-->
      <!--<el-col :span="22" :offset="1" class="lose-margin2">-->
        <!--<fieldset class="layui-elem-field layui-field-title">-->
          <!--<legend>学术团体任职情况</legend>-->
          <!--<div class="layui-field-box">-->
            <!--<el-input v-model="secientData.secient.groupWorkInfo" type="textarea" :rows="5" readonly resize="none"></el-input>-->
          <!--</div>-->
        <!--</fieldset>-->
      <!--</el-col >-->
    <!--</el-row >-->

    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
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
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="刊物名称">
                  </el-table-column>
                  <el-table-column
                    prop="country"
                    label="刊物国家">
                  </el-table-column>
                  <el-table-column
                    prop="includedInfo"
                    label="收录情况">
                  </el-table-column>
                  <el-table-column
                    prop="volume"
                    label="卷期">
                  </el-table-column>
                  <el-table-column
                    prop="tops"
                    label="排名">
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </fieldset>
      </el-col >
    </el-row >

    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
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
                      </el-table-column>
                      <el-table-column
                        prop="type"
                        label="类别">
                      </el-table-column>
                      <el-table-column
                        prop="company"
                        label="出版单位">
                      </el-table-column>
                      <el-table-column
                        prop="date"
                        label="日期">
                      </el-table-column>
                      <el-table-column
                        prop="tops"
                        label="排名">
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
          </div>
        </fieldset>
      </el-col >
    </el-row >


    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">

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
                      </el-table-column>
                      <el-table-column
                        prop="department"
                        label="颁发部门">
                      </el-table-column>
                      <el-table-column
                        prop="level"
                        label="等级">
                      </el-table-column>
                      <el-table-column
                        prop="finishDate"
                        label="完成日期">
                      </el-table-column>
                      <el-table-column
                        prop="certificateNo"
                        label="证书号">
                      </el-table-column>
                      <el-table-column
                        prop="tops"
                        label="排名">
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>

          </div>
        </fieldset>
      </el-col >
    </el-row >



    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
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
                      </el-table-column>
                      <el-table-column
                        prop="taskSource"
                        label="任务来源">
                      </el-table-column>
                      <el-table-column
                        prop="finishType"
                        label="完成形式">
                      </el-table-column>
                      <el-table-column
                        prop="date"
                        label="完成日期">
                      </el-table-column>
                      <el-table-column
                        prop="company"
                        label="鉴定验收单位">
                      </el-table-column>
                      <el-table-column
                        prop="result"
                        label="主要结论">
                      </el-table-column>

                      <el-table-column
                        prop="tops"
                        label="排名">
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
          </div>
        </fieldset>
      </el-col >
    </el-row >

    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
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
                  </el-table-column>
                  <el-table-column
                    prop="projectType"
                    label="项目类别">
                  </el-table-column>
                  <el-table-column
                    prop="taskSource"
                    label="任务来源">
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="起讫时间">
                  </el-table-column>
                  <el-table-column
                    prop="price"
                    label="科研经费（万元）">
                  </el-table-column>
                  <el-table-column
                    prop="shoulderTask"
                    label="本人承担任务">
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </fieldset>
      </el-col >
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
        //医师资格级别
        options: [{
          value: '0',
          label: '职业'
        }, {
          value: '1',
          label: '助理'
        }, {
          value: '2',
          label: '无'
        }],

        courses: [{
          type: '',
          bizDict: ''
        }],
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        //表格数据
        secientData:{},
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          paramsData:'/archives/get/basic/',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'archives/list/asd/'+this.dataId
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
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let type = [];
        let data = responseData.data;
        this.secientData = data;
      },



    }
  }
</script>




