<template>

  <div>
    <el-form ref="formValidate" :model="formValidate" :rules="rules"  class="demo-form-inline" label-width="100px" >

      <el-row >
        <el-col :span="16" :offset="4">
          <el-form-item label=" 标题:" prop="logTitle" >
            <el-input v-model="formValidate.logTitle" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >


      <el-row >
        <el-col :span="16" :offset="4">
          <el-form-item label="填写时间:" prop="editTime" >
            <el-date-picker
              style="width: 200px"
              v-model="formValidate.editTime"
              type="date"
              :editable="false"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="16" :offset="4">
          <el-form-item label="附件:" prop="fid" >
            <upload-photo @upladSuccess="upladSuccess"></upload-photo>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>
    <el-row >
      <el-col :span="14" :offset="6">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="save" :btnData="loadBtn"></load-btn>
          <load-btn @listenSubEvent="saveReportedEvent" :btnData="saveReported"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  import uploadPhoto from '../../../common/uploadPhotoWall.vue'
  import {scientificResearchLog as rules} from '../../rules.js'
  //当前组件引入全局的util
  let Util=null;
  export default {
      props:['operailityData','url'],
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        saveReported:{title:'上报',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          logTitle:'',  //科研日志标题
          editTime:'',  //填写时间(yyyy-MM-dd)
          fid:'',  //附件ID
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.scientificResearchLogAdd.path,
            method:'post',
            data:{},
          }
        },

        optionData:[]
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
//      let userInfo = this.$store.getters.getUserInfo;
//      let userType = userInfo.studentTypes;
//      this.listMessTitle.ajaxParams.url = this.url.userRotaryDeptlist + userType + '-' + userInfo.id;
      this.init();
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{

      updateListData(res) {
        let data = res.data;
        if (!data) return;
        this.optionData = data;

      },
      /*
       * 保存或上报按钮会调用这个公共函数
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          let formValidate = this.getFormData(this.formValidate);
          formValidate = this.formDate(formValidate,['editTime'],'yyyy-MM-dd');
          this.addMessTitle.ajaxParams.data=formValidate;
          this.ajax(this.addMessTitle,isLoadingFun)
        }
      },

//      保存 改变url
      save(isLoadingFun){
        this.addMessTitle.ajaxParams.url = this.url.scientificResearchLogAdd.path;
        this.listenSubEvent(isLoadingFun);
      },

      //保存上报 改变url
      saveReportedEvent(isLoadingFun){
        this.addMessTitle.ajaxParams.url = this.url.scientificResearchLogAddSubmit.path;
        this.listenSubEvent(isLoadingFun);
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
        this.$emit('cancel',this.addMessTitle.type);
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
       * 组件初始化入口
       * */
      init(){
          //请求科室数据
      },

      upladSuccess(a,b,files){
        let tempArr = [];
        for(let i=0;i<files.length;i++){
          let id = files[i].response.data;
          tempArr.push(id);
        }
        this.formValidate.fid = tempArr.join(',');

      }

    },
    components:{
      uploadPhoto
    }
  }
</script>
