<!--档案查看-->
<template>
  <div>
    <el-form :model="data" ref="formValidate" :rules="this.$store.state.rules.authority" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="课程名称:" prop="name1">
            {{data.activityName}}
          </el-form-item>
          <el-form-item label="课程类型:" prop="name1">
            {{data.activityType}}
          </el-form-item>
          <el-form-item label="日期:" prop="activityTime">
            {{data.activityTime}}
          </el-form-item>
          <el-form-item label="应到人数:" prop="activityTime">
            {{data.shouldUserCount}}
          </el-form-item>
          <el-form-item label="课程内容:" prop="activityTime">
            {{data.activityContent}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授课地点:" prop="name4">
            {{data.activitySite}}
          </el-form-item>
          <el-form-item label="授课老师:" prop="name5">
            {{data.hostUserName}}
          </el-form-item>
          <el-form-item label="上课时间:" prop="name6">
            {{data.activityTimeInfo}}
          </el-form-item>
          <el-form-item label="签到人数:" prop="name6">
            {{data.actuallyUserCount}}
          </el-form-item>
          <el-form-item label="参加主体对象:" >
            {{data.participantSubject |participantSubject}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="课件资料:" prop="name7">
            <upload-file :uploadFiles="data.fileList" :unAccept="true"
                         message="不限格式"
                         @setUploadFiles="expenseFileEvent"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    props:["operailityData",'url'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        activeName: 'first',
        isShowUpload:true,

        //获取到的数据
        "data":{
//          participantSubject:'ALL' //参加主体对象（默认ALL）(新增2017-11-13)(SXS-实习生、YJS-研究生、ZYY-住院医、JXS-进修生、ALL所有类型)
        },

        formValidate:{
          fileIds:'',
          id:this.operailityData.id
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'uploadingCourseware',
          successTitle:'上传成功!',
          errorTitle:'上传失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.teachctivityModifyfile+'/'+this.operailityData.id,
            method:'post'
          }
        },


        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:this.url.teachctivityGet+'/'+this.operailityData.id,
            params:{}
          }
        },
      };
    },
    created(){
      this.init();
    },
    methods: {
      init(){
        this.ajax(this.listMessTitle)
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");

        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);

          this.editMessTitle.ajaxParams.data=this.getFormData(this.formValidate)
          this.ajax(this.editMessTitle,isLoadingFun)
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



      updateListData(res){
          let data = res.data;
          if(!data) return;
        this.data = res.data;

      },


      handleClick(tab, event) {
        //console.log(tab, event);
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.editMessTitle.type);
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = this.$util._.defaultsDeep({},data);
        return myData;
      },

      //上传课件接收id
      uploadFiles(ids){
          this.formValidate.fileIds = ids;
      },

      //获取文件来拼接 文件id字符串
      expenseFileEvent(ids){
        this.formValidate.fileIds = ids;
      },
    }
  };
</script>
