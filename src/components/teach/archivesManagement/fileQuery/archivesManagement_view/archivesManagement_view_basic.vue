<!--档案管理查看-->
<!--基本情况-->

<template>

  <div >
    <el-form ref="formValidate" :model="formValidate"  class="demo-form-inline" label-width="110px" >
      <!--标题-->
      <el-row >
        <el-col :span="10" :offset="10" class="lose-margin2">
          <span class="table-headline ">基本情况</span>
        </el-col >
      </el-row >
      <!--内容-->
      <el-row>
        <el-col :span="22" :offset="1">
          <el-row :gutter="10">
            <el-col :span="19"  >
              <el-row :gutter="10" class="table-back-one">
                <el-col :span="8" >
                  <el-form-item label="姓名：">
                    {{formValidate.name}}
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="性别：" prop="sex" >
                    {{formValidate.sex}}
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="民族：" prop="nation" >
                    {{formValidate.nation}}
                  </el-form-item>
                </el-col>
              </el-row >

              <el-row :gutter="10" class="table-back-two">
                <el-col :span="8" >
                  <el-form-item label="出生年月：" prop="birth" >
                    {{formValidate.birth}}
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="学制：" prop="length" >
                    {{formValidate.length}}
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="政治面貌：" prop="political" >
                    {{formValidate.political}}
                  </el-form-item>
                </el-col>
              </el-row >

              <el-row :gutter="10" class="table-back-one">
                <el-col :span="8" >
                  <el-form-item label="最高学历：" prop="highestEdu" >
                    {{formValidate.highestEdu}}
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="专业：" prop="specialty" >
                    {{formValidate.specialty}}
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="毕业学校：" prop="school" >
                    {{formValidate.school}}
                  </el-form-item>
                </el-col>
              </el-row >
              <el-row :gutter="10" class="table-back-two">
                <el-col :span="8" >
                  <el-form-item label="QQ：" prop="qq" >
                    {{formValidate.qq}}
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="邮箱：" prop="email" >
                    {{formValidate.email}}
                  </el-form-item>
                </el-col>
                <el-col :span="8" >
                  <el-form-item label="办公电话：" prop="telephone" >
                    {{formValidate.telephone}}
                  </el-form-item>
                </el-col>
              </el-row >
            </el-col >

            <el-col :span="5" class="table-back-header">
              <div style="text-align: center">
                <img class="headerUrl" :src="formValidate.headPhoto" style="width: 100%" />
              </div>
            </el-col>

          </el-row >
              <el-row :gutter="10" class="table-back-one">
                <el-col :span="11">
                  <el-form-item label="年级：" prop="grade" >
                    {{formValidate.grade}}
                  </el-form-item>
                </el-col>
                <el-col :span="11" >
                  <el-form-item label="籍贯：" prop="origin" >
                    {{formValidate.origin}}
                  </el-form-item>
                </el-col>
              </el-row >
              <el-row :gutter="10" class="table-back-two">
                <el-col :span="11" >
                  <el-form-item label="参加工作时间：" prop="jobTime" >
                    {{formValidate.jobTime}}
                  </el-form-item>
                </el-col>
                <el-col :span="11" >
                  <el-form-item label="职务：" prop="duties" >
                    {{formValidate.duties}}
                  </el-form-item>
                </el-col>
              </el-row >

              <el-row :gutter="10" class="table-back-one">
                <el-col :span="11" >
                  <el-form-item label="是否执业医师：" prop="doctor" >
                    {{formValidate.doctor}}
                  </el-form-item>
                </el-col>
                <el-col :span="11" >
                  <el-form-item label="医师资格级别：" prop="doctorLevel" >
                    {{formValidate.doctorLevel}}
                  </el-form-item>
                </el-col>
              </el-row >

              <el-row :gutter="10" class="table-back-two">
                <el-col :span="11" >
                  <el-form-item label="身份证号码：" prop="idNumber" >
                    {{formValidate.idNumber}}
                  </el-form-item>
                </el-col>
                <el-col :span="11" >
                  <el-form-item label="手机号码：" prop="mobile" >
                    {{formValidate.mobile}}
                  </el-form-item>
                </el-col>
              </el-row >

              <el-row :gutter="10" class="table-back-one">
                <el-col :span="11" >
                  <el-form-item label="紧急联系人：" prop="emgContact" >
                    {{formValidate.emgContact}}
                  </el-form-item>
                </el-col>
                <el-col :span="11" >
                  <el-form-item label="紧急联系人电话：" prop="emgContactMobile" label-width="130px">
                    {{formValidate.emgContactMobile}}
                  </el-form-item>
                </el-col>
              </el-row >
              <el-row :gutter="10" class="table-back-two-d">
                <el-col :span="11" >
                  <el-form-item label="现住地址：" prop="address" >
                    {{formValidate.address}}
                  </el-form-item>
                </el-col>
                <el-col :span="11" >
                  <el-form-item label="邮编：" prop="postCode" >
                    {{formValidate.postCode}}
                  </el-form-item>
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
        formValidate: {
          deptId:'',  //部门id
          name:'',  //姓名
          sex:'',   //性别
          nation:'',  //民族
          birth:'',  //出生日期
          origin:'',  //籍贯
          political:'',   //政治面貌
          highestEdu:'',   //最高学历
          specialty:'',   //专业
          school:'',   //毕业学校
          jobTime:'',   //参加工作时间，年月，例如：199011
          grade:'',   //年级
          group:'',   //班级
          length:'',   //学制
          duties:'',   //职务
          doctor:'',   //是否执业医师:是、否
          doctorLevel:'',   //医师资格级别(职业、助理、无)
          idNumber:'',   //身份证号码
          mobile:'',    //手机号
          emgContact:'',   //紧急联系人
          emgContactMobile:'',   //紧急联系人电话
          qq:'',//qq
          email:'',//邮箱
          telephone:'',//办公电话
          address:'',//现住地址
          postCode:'',//邮编
          headPhoto:''//头像地址
        },

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/archives/get/basic/'+this.dataId
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
        let data = responseData.data;
        this.formValidate = data;
      },



    }
  }
</script>

