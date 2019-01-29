<template>

  <div >
    <el-form ref="formValidate" inline :model="formValidate" :rules="rules" class="demo-form-inline" label-width="110px" >

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="节日名称：" prop="holidayName" style="width: 520px" >
            <el-input v-model="formValidate.holidayName" style="width: 410px" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="时间：" prop="startDate">
            <el-date-picker
              v-model="formValidate.startDate"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              @change="handleStartTime">
            </el-date-picker>
          </el-form-item>
          <span style="line-height: 35px;font-size: 16px">到</span>
          <el-form-item  lable-width="0" prop="endDate">
            <el-date-picker
              v-model="formValidate.endDate"
              align="right"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions1"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
        </el-col >
      </el-row >

    </el-form>

    <el-row >
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  import {holidays as rules} from '../rules';
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        //form表单bind数据
        formValidate: {
          setType: '',
          roleIds: '',
          holidayName: '',
          startDate: '',
          endDate: '',
          status: '',

        },

        //当前组件提交(eidt)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxParams:{
            url:'/holidaySet/modify/'+this.operailityData.id,
            method:'put'
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/holidaySet/get/'+this.operailityData.id,
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
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle, isLoadingFun);
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
       * @param responseData JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        this.formValidate = responseData.data;
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
        this.formDate(myData,['startDate','endDate'],this.yearMonthData);
        return myData;
      },

    }
  }
</script>
