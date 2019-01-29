<!--档案管理查看-->
<!--教学经历-->

<template>
  <div >
      <!--标题-->
      <el-row >
        <el-col :span="24" class="lose-margin2" style="text-align: center">
          <span class="table-headline ">教学经历</span>
        </el-col >
      </el-row >
      <div class="table-wrapper-border">
        <el-row :align="middle" class="table-row-oddBg">
          <el-col :span="4"><div class="table-row-right">是否获得教学职称：</div></el-col>
          <el-col :span="3"><div class="table-row">{{formValidate.hasTeachTitle}}</div></el-col>
          <el-col :span="3"><div class="table-row-right">教学职称：</div></el-col>
          <el-col :span="5"><div class="table-row">{{formValidate.teachTitle}}</div></el-col>
          <el-col :span="4"><div class="table-row-right">是否承担理论授课：</div></el-col>
          <el-col :span="5"><div class="table-row">{{formValidate.hasTheoryTeach}}</div></el-col>
        </el-row >

        <el-row :align="middle" class="table-row-evenBg">
          <el-col :span="4" class="table-row-right">是否临床带教：</el-col>
          <el-col :span="3" class="table-row">{{formValidate.hasClinic }}</el-col>
          <el-col :span="3" class="table-row-right">已毕业人数：</el-col>
          <el-col :span="5" class="table-row">其中实习生{{formValidate.graduatedTraineeNumber }}人,住院医{{formValidate.graduatedResidencyNumber }}人</el-col>
          <el-col :span="4" class="table-row-right">在培人数：</el-col>
          <el-col :span="5" class="table-row">其中实习生{{formValidate.trainingTraineeNumber }}人,住院医{{formValidate.trainingResidencyNumber }}人</el-col>
        </el-row >

        <el-row :align="middle" class="table-row-oddBg">
          <el-col :span="4"><div class="table-row-right">授课内容：</div></el-col>
          <el-col :span="20"><div class="table-row">{{formValidate.teachContent}}</div></el-col>
        </el-row >

        <el-row :align="middle" class="table-row-oddBg">
          <el-col :span="4"><div class="table-row-right">是否获得导师资格：</div></el-col>
          <el-col :span="3"><div class="table-row">{{formValidate.hasTeachQualified}}</div></el-col>
          <el-col :span="3"><div class="table-row-right">是否院士：</div></el-col>
          <el-col :span="5"><div class="table-row">{{formValidate.hasAcademician}}</div></el-col>
          <el-col :span="4"><div class="table-row-right" style="line-height: inherit">是否国务院学科评议组成员：</div></el-col>
          <el-col :span="5"><div class="table-row">{{formValidate.hasCouncilMember}}</div></el-col>
        </el-row >

        <el-row :align="middle" class="table-row-oddBg">
          <el-col :span="4"><div class="table-row-right">专业代码：</div></el-col>
          <el-col :span="3"><div class="table-row">{{formValidate.specialtyCode}}</div></el-col>
          <el-col :span="3"><div class="table-row-right">专业名称：</div></el-col>
          <el-col :span="5"><div class="table-row">{{formValidate.specialtyName}}</div></el-col>
          <el-col :span="4"><div class="table-row-right">培养单位：</div></el-col>
          <el-col :span="5"><div class="table-row">{{formValidate.trainCompany}}</div></el-col>
        </el-row >

        <el-row :align="middle" class="table-row-oddBg">
          <el-col :span="4"><div class="table-row-right">导师类别：</div></el-col>
          <el-col :span="3"><div class="table-row">{{formValidate.tutorType}}</div></el-col>
          <el-col :span="3"><div class="table-row-right">聘任时间：</div></el-col>
          <el-col :span="5"><div class="table-row">{{formValidate.hiredDate}}</div></el-col>
          <el-col :span="4"><div class="table-row-right">聘任学校：</div></el-col>
          <el-col :span="5"><div class="table-row">{{formValidate.hiredSchool}}</div></el-col>
        </el-row >
      </div>
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
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/archives/get/teach/'+this.dataId
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


