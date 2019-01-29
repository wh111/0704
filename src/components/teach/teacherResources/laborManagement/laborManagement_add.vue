<template>

  <div class="editForm">
    <el-form ref="formValidate"  :model="formValidate"  :rules="rules"  class="demo-form-inline" label-width="100px">
      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名:" class="feildFontweight"  prop="userName">
            <el-input  placeholder="请输入姓名"  v-model="formValidate.userName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="10" >
          <el-form-item label="证件号:" class="feildFontweight" prop="cardNo">
            <el-input placeholder="请输入证件号" v-model="formValidate.cardNo"></el-input>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="经办人:" class="feildFontweight" prop="jbrName">
            <el-input placeholder="请输入经办人" v-model="formValidate.jbrName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="10" >
          <el-form-item label="金额:" class="feildFontweight" prop="money" required>
            <el-input placeholder="请输入金额" v-model="formValidate.money"></el-input>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="支付时间:" class="feildFontweight" prop="payTime">
              <el-date-picker
                v-model="formValidate.payTime"
                type="datetime"
                placeholder="选择日期时间" @change="changeDate">
              </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="10" >
          <el-form-item label="类型:" class="feildFontweight" >
            <el-radio-group v-model="formValidate.types">
              <el-radio label="1" >院内人员</el-radio>
              <el-radio label="0" >院外人员</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="用途:" class="feildFontweight">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="formValidate.yt"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>
    <el-row >
      <el-col :span="16" :offset="2">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  import api from './api';
  import {laborManagement as rules} from '../../rules';
  //当前组件引入全局的util
  let Util=null;
  export default {
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        //form表单bind数据
        formValidate: {
          userId:'',
          userName: '', // 姓名
          cardNo: '', // 证件号
          types: '0', // 0院内1院外
          jbrId: '', // 经办人id
          jbrName:'',// 经办人姓名
          money: '', // 金额
          payTime: '', // 支付时间
          yt: '', // 用途
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:api.add.path,
            method:api.add.method
          }
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      let userInfo = this.$store.getters.getUserInfo;
      this.formValidate.jbrName = userInfo.name;
      this.formValidate.jbrId = userInfo.id;
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
      //this.init();
    },
    methods:{
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data=this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle,isLoadingFun)
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
      changeDate(val){
        this.formValidate.payTime = val
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //this.ajax(this.listMessTitle)
      },
    }
  }
</script>

<style lang="scss">
  @import"../../../../assets/ambuf/css/manage_v1.0/editForm";
</style>
