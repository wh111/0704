<!--档案管理修改-->
<!--教学经历-->

<template>
  <div >
    <teach-input :operailityData="formValidate" ref="teach"></teach-input>
    <!--<br />-->
    <!--<el-row >-->
      <!--<el-col :span="24" style="text-align: center">-->
        <!--<load-btn @listenSubEvent="saveCurrData" :btnData="loadBtn"></load-btn>-->
      <!--</el-col>-->
    <!--</el-row >-->
    <!--<br />-->
    <!--<div style="font-size: 1px;overflow: hidden;line-height: 1;border-top:1px solid #e3e8ee;margin: 12px 0;"></div>-->
    <!--<el-row>-->
      <!--<el-col :span="9" :offset="10">-->
        <!--<el-button type="primary" v-if="userInfo.archivesAuditStatus!='NOT_AUDIT'" @click="saveDataToParent">保存</el-button>-->
        <!--<load-btn  v-if="userInfo.archivesAuditStatus!='NOT_AUDIT'" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>-->
        <!--<span v-if="userInfo.archivesAuditStatus=='NOT_AUDIT'" style="margin-right: 10px;color: #FF4949;">您的档案信息正在审核中……</span>-->
        <!--<el-button  @click="cancel">取消</el-button>-->
      <!--</el-col>-->
    <!--</el-row >-->
  </div>
</template>

<script>
  import teachInput from '../archivesManagement_teach/input.vue';
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
//    props: ['dataId','initData','userInfo'],
    props: ['dataId'],
    data (){
      return{

        //保存按钮基本信息
        loadBtn:{title:'上报审核',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate:{
          "id":"",                         //数据Id
          "hasTeachTitle":"",              //是否获得教学职称
          "teachTitle":"",                 //教学职称
          "hasTheoryTeach":"",              // 是否承担理论授课
          "hasClinic":"",                   // 是否临床带教
          "graduatedTraineeNumber":"0",      // 已经毕业人数（实习生）
          "graduatedResidencyNumber":"0",     // 已经毕业人数（住院医）
          "trainingTraineeNumber":"0",         //在陪人数（实习生）
          "trainingResidencyNumber":"0",       //在陪人数（住院医）
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
          "archivesId":this.dataId                     //档案ID
        },
//当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'saveSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/modify/teach/'+this.dataId,
            method:'post',
            data:{}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          paramsData:'listUrl',
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
//        this.SuccessGetCurrData();
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      saveCurrData(isLoadingFun){
        let data = this.$refs.teach.getInputData();
        if(data) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
//          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.editMessTitle.ajaxParams.data = data;
//          this.$emit("setSaveData",this.editMessTitle.ajaxParams.data);
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },

      //保存成功后回调
      saveSuccess() {
        this.$emit("save",'teachingExperience');
      },


      saveDataToParent(){
//        this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
        this.editMessTitle.ajaxParams.data = this.$refs.teach.getInputData();
      },


      listenSubEvent(){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
//          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.editMessTitle.ajaxParams.data = this.$refs.teach.getInputData();
          this.$emit("setSaveData",this.editMessTitle.ajaxParams.data);
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


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;//responseData.data;
        let isObject = this.valDataType(data, "Object");
        if(isObject){
          this.formValidate = data;
        }
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        myData = this.formDate(myData,['hiredDate'],this.yearMonthData);
        return myData;
      },
    },
    components:{
      teachInput,
    }
  }
</script>


