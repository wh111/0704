<!----------------------------------
****--课程资料-修改上传(syllabusData_upload)
****--@date     2017/6/17
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-form :model="formValidate" :rules="formValidate" ref="formValidate" label-width="10px" class="demo-ruleForm">
      <el-row>
        <el-col :span="3" style="text-align: right;line-height: 30px;">相关证明材料</el-col>
        <el-col :span="20">
          <el-form-item label="">
            <upload-file :uploadFiles="formValidate.fileList" @setUploadFiles="addFileEvent"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" style="text-align: right;line-height: 30px;">备  注</el-col>
        <el-col :span="20">
          <el-form-item label="" prop="desc">
            <el-input type="textarea" v-model="formValidate.courseDataNote"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
        <el-col :span="4" class="textCenter"><load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn></el-col>
        <el-col :span="4" class="textCenter"><el-button @click="cancelUpload">取消</el-button></el-col>
        <el-col :span="8" class="textCenter">&nbsp;</el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api';
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData"],
    data() {
      return {
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        /*--按钮button--*/
        addId:{
          id:'add',
          title:'添加'},
        courseNames:"",
        formValidate: {
          courseTimeRecordIds:'',
          courseArrangeIds:'',
          courseDataNote:'',
          fileIds:'',
        },


        //当前已经选择的课程内容
        setCourseData:"",

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'uploadEdit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.teacherCourseFileEdit.path+"/"+this.operailityData.courseDataId,
            method:'put',
          },
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
        console.log(this.operailityData)
        this.ajax(this.listMessTitle);
      },


      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.formValidate = data;
      },


      //上传附件
      addFileEvent(ids){
        this.formValidate.fileIds = ids;
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(this.formValidate.fileIds==""){
          this.showMess("请上传课程资料!");
          return;
        }
        isSubmit = true;
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle)
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



      cancelUpload(){
        this.$emit("cancel","uploadEdit");
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
      }

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
