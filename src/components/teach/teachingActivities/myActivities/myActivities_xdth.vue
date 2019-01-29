<!--档案查看-->
<template>
  <div>
    <el-form   :model="formValidate" ref="formValidate" :rules="rules.myActivities" label-width="100px">
      <fieldset class="layui-elem-field ">
        <el-row>
          <el-col :span="8">
            <el-form-item label="课程名称:" prop="name1">
              {{data.activityName}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授课地点:" prop="name4">
              {{data.activitySite}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item label="参加主体对象:" prop="name1">
                  {{data.participantSubject | participantSubject}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="课程类型:" prop="name1">
              {{data.activityType}}
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="课程时间:" prop="name4">
              {{data.activityTime}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授课老师:" prop="name4">
              {{data.hostUserName}}
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="24">
            <el-form-item label="课程内容:" prop="name1">
              {{data.activityContent}}
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="24">
            <el-form-item label="课件资料:" prop="name7">
              <upload-file  :show="true" :uploadFiles="data.fileList"></upload-file>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="相关证明材料:" prop="name7">
              <upload-file  :show="true" :uploadFiles="data.activityFileList"></upload-file>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      </br>
      <fieldset class="layui-elem-field">
      <el-row>
        <el-col :span="24">
          <el-form-item label="心得体会:" prop="activityTips">
            <el-input type="textarea" :rows="6"  resize="none" v-model="formValidate.activityTips"></el-input>
          </el-form-item>

        </el-col>
      </el-row>



      <el-row>
        <el-col :span="24" >
          <el-form-item label="附件:" prop="name7">
            <upload-file  accept="png|jpg|jpeg|bmp|gif" :uploadFiles="data.activityTipsFileList"  @setUploadFiles="expenseFileEvent"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      </fieldset>

      <el-form-item style="text-align: center;padding-top: 10px">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
  import uploadPhotoWall from '../../../common/uploadPhotoWall.vue'
  export default {
      props:['operailityData','url','rules'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //获取到的数据
        "data":{

        },

        formValidate:{
          activityId:this.operailityData.id,      //教学活动ID
          activityTips:'',      //心得体会
          fileIds:'',
        },

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:this.url.teachActivityTips+'/'+this.operailityData.id,
            params:{}
          }
        },
        isAdd:true,
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'xdth',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.teachActivityModify+'/',
            method:'post'
          }
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'xdth',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.teachActivityAdd,
            method:'post'
          }
        },
      };

    },

    created(){
      this.init();
      let env = this.$store.getters.getEnvPath;
      this.http = env;
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
          let formValidate;
          if (!this.isAdd){
            formValidate = this.editMessTitle;
          }else {
            formValidate = this.addMessTitle;
          }
          formValidate.ajaxParams.data=this.getFormData(this.formValidate);
          this.ajax(formValidate,isLoadingFun)
        }
      },


      handleClick(tab, event) {
        //console.log(tab, event);
      },

      //通过get请求列表数据
      updateListData(responseData){
        this.data = responseData.data;
        if(responseData.data.activityTipsId){
            let data = responseData.data;
          this.isAdd=false;
          this.editMessTitle.ajaxParams.url = this.editMessTitle.ajaxParams.url+data.activityTipsId;
          if(data.activityTipsFileList){
              for(let i=0;i<data.activityTipsFileList.length;i++){
                data.activityTipsFileList[i].filePath  = '/api/file/download/'+ data.activityTipsFileList[i].fileId;
              }
          }
          this.formValidate.activityTips = data.activityTips;
        }

      },


      setUploadFiles(ids){
          this.formValidate.fileIds = ids;
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','xdth');
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = this.$util._.defaultsDeep({},data);
        return myData;
      },


      //获取文件来拼接 文件id字符串
      expenseFileEvent(ids){
        this.formValidate.fileIds = ids;
      },

    },
  };
</script>
