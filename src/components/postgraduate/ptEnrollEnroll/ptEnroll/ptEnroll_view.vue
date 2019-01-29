<!--
****--@name    报名表（查看）
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-form :model="formValidate" :rules="formValidate" ref="formValidate" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名:">
            {{formValidate.name}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="性别:">
            {{formValidate.sex | typeText}}
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="2">
          <el-form-item label="学生编号:">
            {{formValidate.studentId}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="年级:">
            {{formValidate.boundary}}
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="2">
          <el-form-item label="手机号码:">
            {{formValidate.phone}}
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="专业方向:">
            {{formValidate.major}}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="专业代码:">
            {{formValidate.majorCode}}
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="身份证号:">
            {{formValidate.idNumber}}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="邮箱:">
            {{formValidate.email}}
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="学位:">
            {{formValidate.degree | typeText}}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="学校:">
            {{formValidate.schoolName}}
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="毕业学校:">
            {{formValidate.graduateSchoolName}}
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="2">
          <el-form-item label="培训类型:">
            {{formValidate.traininType | typeText}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="英语成绩:">
            {{formValidate.englishScore}}
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="2">
          <el-form-item label="政治成绩:">
            {{formValidate.politicsScore}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="专业课成绩:">
            {{formValidate.professionalCourseScore}}
          </el-form-item>
        </el-col>

        <el-col align="center">
          <el-button @click="cancel">关闭</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'url'],
    data () {
      return {
        courseNames: '',
        formValidate: {
          schoolName: '',//学校
          name: '',//姓名
          sex: '',//性别
          idNumber: '',//身份证号
          phone: '',//学校
          email: '',//邮箱
          majorCode: '',//专业代码
          major: '',//专业方向
          traininType: '',//培养类型（硕士/博士）
          englishScore: '',//英语成绩
          politicsScore: '',//政治成绩
          professionalCourseScore: '',//学校
          graduateSchoolName: '',//毕业学校
          studentId: '',//考生编号
          degree: ''//学位
        },

        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.get.path + '/' + this.operailityData.id
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.ajax(this.listMessTitle);
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;
        this.formValidate = data;
      },

      cancel () {
        this.$emit('cancel', 'show');
      }

    },
    created () {
      Util = this.$util;
      this.init();
    },
    mounted () {
    },
    components: {}
  };
</script>
