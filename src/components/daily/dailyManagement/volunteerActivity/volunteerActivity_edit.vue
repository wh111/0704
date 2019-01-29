<template>

  <div >
    <el-form :model="formValidate"  ref="formValidate" :rules="rules"  class="demo-form-inline"  label-width="100px" >

      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label="活动主题" prop="volunteSubject">
            <el-input v-model="formValidate.volunteSubject"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label="时间" prop="beginTime">
            <el-date-picker
              v-model="formValidate.beginTime"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              @change="handleStartTime"
            >
            </el-date-picker>
            到
            <el-date-picker
              v-model="formValidate.endTime"
              align="right"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions1"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label="活动地点" prop="place">
            <el-input v-model="formValidate.place"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label="活动口号" prop="slogan">
            <el-input v-model="formValidate.slogan"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label="活动目的" prop="aim">
            <el-input type="textarea" resize="none" :rows="14" v-model="formValidate.aim"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label="活动内容" prop="substance">
            <el-input type="textarea" resize="none" :rows="9" v-model="formValidate.substance"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label="活动步骤" >
            <el-input type="textarea" resize="none" :rows="9" v-model="formValidate.step"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label="注意事项" >
            <el-input type="textarea" resize="none" :rows="7" v-model="formValidate.matterNeedingAttention"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label="人员分工" >
            <el-input type="textarea" resize="none" :rows="7" v-model="formValidate.divisionOfLabor"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label="招募对象" >
            <el-input type="textarea" resize="none" :rows="7" v-model="formValidate.recruits"></el-input>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label=" 相关图片" >
            <upload-photo :fileList="formValidate.pictureList" @upladSuccess="photoSuccess"   ></upload-photo>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="19" :offset="2">
          <el-form-item label="  相关证明材料" >
            <upload-file :uploadFiles="fileList" @setUploadFiles="addFileEvent"  ></upload-file>
          </el-form-item>
        </el-col >
      </el-row >
    </el-form>

    <el-row >
      <el-col :span="24" style="text-align: center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  import {volunteerActivity as rules} from '../rules'
  import config from "../../../../config/config.js";
  import uploadPhoto from '../../../common/uploadPhotoWall.vue';
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        //form表单bind数据
        "formValidate":{
          "divisionOfLabor":"", //人员分工
          "aim":"",                 //活动目的
          "volunteSubject":"",  //活动主题
          "substance":"",           //活动内容
          "matterNeedingAttention":"",  //注意事项
          "maxNum":"",
          "minNum":"",
          "step":"",              //活动步骤
          "id":'',
          "place":"",           //活动地点
          "beginTime":"",     //开始时间
          "endTime":"",        //结束时间
          "slogan":"",              //活动口号
          "recruits":"",         //招录对象
//          fileIds:"",
//          imgs:"",
        },
        pictureList:[],   //图片数据；
        fileList:[],   //附件数据；
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功',
          errorTitle:'修改失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            url:'volunteering/modify/'+this.operailityData.id,
            method:'put',
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'volunteering/get/'+this.operailityData.id,
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if(!this.formValidate.endTime){
            this.errorMess('结束时间必填');
            return;
          }
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.formDate(this.getFormData(this.formValidate),['beginTime','endTime'],this.yearMonthData);
          this.ajax(this.editMessTitle, isLoadingFun)
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
        //处理图片数据

        let data = responseData.data;
        if(!data)return;
        let imgs =[];
        data.pictureList= data.pictureList || [];
        data.pictureList.map(item=>{
            item.url= config.urlPrefix + '/file/download/'+item.fileId;
          item.response = {};
          item.response.data = item.fileId;
          imgs.push(item.fileId);
        });
        this.fileList = data.fileList;
        data.imgsimg = imgs.join(',');
        this.formValidate = data;

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
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },


      //添加资料
      addFileEvent(ids){
        this.formValidate.fileIds = ids;
      },


      //上传图片成功
      photoSuccess(arr,index,list){
        let ids = [];
        list.map(item=>{
          ids.push(item.response.data)
        });
        this.formValidate.imgs =ids.join(',')
      },
    },
    components:{
      uploadPhoto,
    }
  }
</script>
