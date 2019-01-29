<template>

  <div>
    <el-form ref="formValidate" :model="formValidate" :rules="delayGiven"  class="demo-form-inline" label-width="140px" >
      <!--<el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="科室名称:" prop="podId">
            {{formValidate.depName}}
            &lt;!&ndash;<el-select @change="changeSltVal" v-model="formValidate.podId" placeholder="请选择" >
              <el-option  v-for="item in optionData" :key="item.id" :label="item.depName" :value="item.depId+'-'+item.depName+'-'+item.podId">
              </el-option>
            </el-select>&ndash;&gt;
          </el-form-item>
        </el-col>
      </el-row>-->

      <!--<el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="轮转开始日期:" >
            {{formValidate.rtStartTime==''?'请选择科室':formValidate.rtStartTime}}
          </el-form-item>
        </el-col>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="轮转结束日期:" >
            {{formValidate.rtEndTime==''?'请选择科室':formValidate.rtEndTime}}
          </el-form-item>
        </el-col>
        </el-col>
      </el-row>-->
      <!--<el-row>
        <el-col :span="22" :offset="2">
          <date-group :dateGroup="{text:'',startDate:formValidate.rtStartTime,endDate:formValidate.rtEndTime}" style="display:inline-block;">
            <el-form-item label="轮转开始日期：" prop="rtStartTime">
              <el-date-picker v-model="formValidate.rtStartTime" :editable="false" type="date" placeholder="选择入科开始日期" :picker-options="pickerOptions0" @change="handleStartTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="轮转结束日期：" prop="rtEndTime">
              <el-date-picker v-model="formValidate.rtEndTime" :editable="false" type="date" placeholder="选择入科结束日期" :picker-options="pickerOptions1" @change="handleEndTime"></el-date-picker>
            </el-form-item>
          </date-group>
        </el-col>
      </el-row>-->

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="相关证明材料:" >
            <upload-file :uploadFiles="formValidate.delayGivenFiles" @setUploadFiles="expenseFileEvent"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="延期说明:" prop="note">
            <el-input v-model="formValidate.note" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row >
      <el-col :span="10" :offset="6">
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
  import {delayGiven} from '../../rules.js'
  //当前组件引入全局的util
  let Util=null;
  export default {
    props:['operailityData','url'],
    data (){
      return{
        delayGiven,
        //保存按钮基本信息
        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        saveReported:{title:'上报',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          "depId":"",  //科室ID
          "depName":"",  //科室名称
          "rtStartTime":"",  //手术名称
          "rtEndTime":"",  //手术日期
          "note":"",  //备注
          "podId":"",  //轮转ID
          "fileIds":""  ,//附件IDs
          delayGivenFiles:[],
        },
        getData:{

        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.delayGivenModify.path+this.operailityData.id,
            method:this.url.delayGivenModify.method,
            data:{},
          }
        },

        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url:this.url.delayGivenGet.path+this.operailityData.id, //向后台请求数据的地址

          }
        },
        optionData:[],
        optionObjData:{
          //"item.depId-item.depName-item.podId":""
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      let userInfo = this.$store.getters.getUserInfo;
      let userType = userInfo.studentTypes;
      //初始化optionData
      let setOptionData = {
        ajaxSuccess: (res) => {
          let data = res.data;
          if (!data) return;
          this.optionData = data;
        },
        errorTitle: '获取科室名称数据失败!',
        ajaxParams: {
          url: this.url.userRotaryByUserId.path + userType + '-' + userInfo.id,
        }
      }
      this.ajax(setOptionData);
      this.init();
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{

      updateListData(res) {
        let data = res.data;
        if (!data) return;
        this.getData = data;
        for(var i=0,item;i<data.length;i++){
          item = data[i]
          this.optionObjData[item.depId+'-'+item.depName+'-'+item.podId]=item;
        }
        this.formValidate = this.getFormValidate(this.formValidate,data);

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
          if(formValidate.podId){
            let deps = formValidate.podId.split('-');
            formValidate.depId = deps[0];
            formValidate.depName = deps[1];
            formValidate.podId = deps[2];
          }
          formValidate = this.formDate(formValidate,['surgeryTime'],'yyyy-MM-dd');
          this.editMessTitle.ajaxParams.data=formValidate;
          this.ajax(this.editMessTitle,isLoadingFun)
        }
      },

      //当选择的科室值发生改变是调用
      changeSltVal(val){
        let obj = this.optionObjData[val];
        this.formValidate.rtStartTime = obj.beginTime;
        this.formValidate.rtEndTime = obj.endTime;

      },

      expenseFileEvent(ids){
        this.formValidate.fileIds = ids;
      },


      //修改 改变url
      save(isLoadingFun){
        this.editMessTitle.ajaxParams.url = this.url.delayGivenModify.path;
        this.listenSubEvent(isLoadingFun);
      },

      //修改上报 改变url
      saveReportedEvent(isLoadingFun){
        this.editMessTitle.ajaxParams.url = this.url.delayGivenModifySubmit.path;
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
        this.$emit('cancel',this.editMessTitle.type);
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
        this.ajax(this.listMessTitle)
      },

    }
  }
</script>

