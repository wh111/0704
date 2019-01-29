<!--档案管理查看-->
<!--教学经历-->

<template>
  <div >
    <el-form ref="formValidate" :model="formValidate"  class="demo-form-inline" label-width="110px" >
      <!--标题-->
      <el-row >
        <el-col :span="10" :offset="10" class="lose-margin2">
          <span class="table-headline ">教学经历</span>
        </el-col >
      </el-row >
      <!--内容-->
      <el-row>
        <el-col :span="22" :offset="1">

          <el-row :gutter="10" class="table-back-one">
            <el-col :span="8" class="table-dividing">
              <el-form-item label="是否获得教学职称：" >
                {{formValidate.hasTeachTitle }}
              </el-form-item>
            </el-col>
            <el-col :span="8" class="table-dividing">
              <el-form-item label="教学职称：" >
                {{formValidate.teachTitle }}
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="是否承担理论授课：" >
                {{formValidate.hasTheoryTeach }}
              </el-form-item>
            </el-col>
          </el-row >

          <el-row :gutter="10" class="table-back-two">
            <el-col :span="8" class="table-dividing">
              <el-form-item label="是否临床带教：" >
                {{formValidate.hasClinic }}
              </el-form-item>
            </el-col>
            <el-col :span="8" class="table-dividing">
              <el-form-item label="已毕业人数:"  >
                其中实习生{{formValidate.graduatedTraineeNumber }}人,住院医{{formValidate.graduatedResidencyNumber }}人
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="在培人数:"  >
                其中实习生{{formValidate.trainingTraineeNumber }}人,住院医{{formValidate.trainingResidencyNumber }}人
              </el-form-item>
            </el-col>
          </el-row >

          <el-row :gutter="10" class="table-back-one">
            <el-col :span="24" >
              <el-form-item label="授课内容:" >
                {{formValidate.teachContent }}
              </el-form-item>
            </el-col>
          </el-row >

          <el-row :gutter="10" class="table-back-two">
            <el-col :span="8" class="table-dividing">
              <el-form-item label="是否获得导师资格：" >
                {{formValidate.hasTeachQualified }}
              </el-form-item>
            </el-col>
            <el-col :span="8" class="table-dividing">
              <el-form-item label="是否院士:" prop="duties" >
                {{formValidate.hasAcademician }}
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="是否国务院学科评议组成员:" prop="duties" >
                {{formValidate.hasCouncilMember }}
              </el-form-item>
            </el-col>
          </el-row >

          <el-row :gutter="10"  class="table-back-two">
            <el-col :span="8" class="table-dividing">
              <el-form-item label="专业代码：" >
                {{formValidate.specialtyCode }}
              </el-form-item>
            </el-col>
            <el-col :span="8" class="table-dividing">
              <el-form-item label="专业名称:" prop="duties" >
                {{formValidate.specialtyName }}
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="培养单位:" prop="duties" >
                {{formValidate.trainCompany }}
              </el-form-item>
            </el-col>
          </el-row >

          <el-row :gutter="10"  class="table-back-two">
            <el-col :span="8" class="table-dividing">
              <el-form-item label="导师类别：" >
                {{formValidate.tutorType  }}
              </el-form-item>
            </el-col>
            <el-col :span="8" class="table-dividing">
              <el-form-item label="聘任时间:" prop="duties" >
                {{formValidate.hiredDate }}
              </el-form-item>
            </el-col>
            <el-col :span="8" >
              <el-form-item label="聘任学校:" prop="duties" >
                {{formValidate.hiredSchool}}
              </el-form-item>
            </el-col>
          </el-row >

            <div>
          <!--<el-row :gutter="10" class="table-back-two-d">-->
            <!--<el-col  :span="3" >-->
              <!--<p style="width: 100px">导师类别</p>-->
            <!--</el-col>-->
            <!--<el-col :span="20" >-->
              <!--<el-row class="table-back-two" style="border-top: none">-->
                <!--<el-col :span="6" class="table-dividing">-->
                  <!--<el-form-item label="硕导：" >-->
                  <!--</el-form-item>-->
                <!--</el-col>-->
                <!--<el-col :span="10" class="table-dividing">-->
                  <!--<el-form-item label="聘任时间：" >-->
                    <!--{{formValidate.trainingTraineeNumber}}-->
                  <!--</el-form-item>-->
                <!--</el-col>-->
                <!--<el-col :span="8" >-->
                  <!--<el-form-item label="聘任学校：" >-->
                    <!--{{formValidate.trainingTraineeNumber}}-->
                  <!--</el-form-item>-->
                <!--</el-col>-->
              <!--</el-row>-->

              <!--<el-row class="table-back-two">-->
                <!--<el-col :span="6" class="table-dividing">-->
                  <!--<el-form-item label="硕导：" >-->

                  <!--</el-form-item>-->
                <!--</el-col>-->
                <!--<el-col :span="10" class="table-dividing">-->
                  <!--<el-form-item label="聘任时间：" >-->
                    <!--{{formValidate.trainingTraineeNumber}}-->
                  <!--</el-form-item>-->
                <!--</el-col>-->
                <!--<el-col :span="8" >-->
                  <!--<el-form-item label="聘任学校：" >-->
                    <!--{{formValidate.trainingTraineeNumber}}-->
                  <!--</el-form-item>-->
                <!--</el-col>-->
              <!--</el-row>-->

</div>

            </el-col>


          </el-row >


        </el-col>
      </el-row>
    </el-form>
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
        //form表单bind数据
        formValidate:{
          "id":"",                         //数据Id
          "hasTeachTitle":"",              //是否获得教学职称
          "teachTitle":"",                 //教学职称
          "hasTheoryTeach":"",              // 是否承担理论授课
          "hasClinic":"",                   // 是否临床带教
          "graduatedTraineeNumber":"",      // 已经毕业人数（实习生）
          "graduatedResidencyNumber":"",     // 已经毕业人数（住院医）
          "trainingTraineeNumber":"",         //在陪人数（实习生）
          "trainingResidencyNumber":"",       //在陪人数（住院医）
          "teachContent":"",                  //授课内容
          "hasTeachQualified":"",             //是否获得导师资格
          "hasAcademician":"",                // 是否院士
          "hasCouncilMember":"",              // 是否国务院学科评议组成员
          "specialtyCode":"",                 //专业代码
          "specialtyName":"",                 //专业名称
          "trainCompany":"",                  //培养单位
          "tutorType":"",                     // 导师类别 硕导、博导
          "hiredDate":"",                     // 聘任时间
          "hiredSchool":"",                   // 聘任学校
          "archivesId":""                     //档案ID
        },

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          paramsData:'/archives/get/basic/',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'' +
            'archives/get/teach/'+this.dataId
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
        this.tableData = data;
      },



    }
  }
</script>


