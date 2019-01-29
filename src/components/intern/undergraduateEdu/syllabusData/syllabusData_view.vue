<!----------------------------------
****--课程资料-修改上传(syllabusData_upload)
****--@date     2017/6/17
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-form :model="formValidate" :rules="formValidate" ref="formValidate" label-width="10px" class="demo-ruleForm">
      <el-row>
        <el-col :span="3" style="text-align: right;line-height: 30px;">课时</el-col>
        <el-col :span="20">
          <el-form-item label="">
            {{formValidate.courseTime}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" style="text-align: right;line-height: 30px;">时间段</el-col>
        <el-col :span="20">
          <el-form-item label="">
            {{formValidate.timeInfo}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" style="text-align: right;line-height: 30px;">课程内容</el-col>
        <el-col :span="20">
          <el-form-item label="">
            {{formValidate.courseContent}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" style="text-align: right;line-height: 30px;">课程类型</el-col>
        <el-col :span="20">
          <el-form-item label="">
            {{formValidate.courseType}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" style="text-align: right;line-height: 30px;">授课老师</el-col>
        <el-col :span="20">
          <el-form-item label="">
            {{formValidate.teachNames}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" style="text-align: right;line-height: 30px;">授课地点</el-col>
        <el-col :span="20">
          <el-form-item label="">
            {{formValidate.courseAddress}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" style="text-align: right;line-height: 30px;">相关证明材料</el-col>
        <el-col :span="20">
          <el-form-item label="">
            <upload-file :uploadFiles="formValidate.fileList" :show="true"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
        <el-col :span="8" class="textCenter"><el-button @click="cancel">关闭</el-button></el-col>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import selectCourse from './syllabusData_selectCourse.vue';
  import api from '../api';
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData"],
    data() {
      return {
        courseNames:"",
        formValidate: {
          /*"courseDataId":23,
          "courseContent":"111",
          "courseType":"见习",
          "courseTime":"2017-02-08",
          "courseDataState":"RELEASE",*/

          "courseDataId":'',
          "courseContent":"",
          "courseType":"",
          "teachNames":"",
          "courseAddress":"",
          "courseTime":"",
          "courseDataNote":"",
          "courseDataState":"",

          "fileList":[
            {
              "fileId":"",
              "fileName":"",
              "fileType":"",
              "fileUrl":""
            }
          ]
        },


        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:api.teacherCourseFileShow.path+"/"+this.operailityData.courseDataId,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.listMessTitle);
      },


      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.formValidate = data;
      },


      cancel(){
        this.$emit("cancel","show");
      },


    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
