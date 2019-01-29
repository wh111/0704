<template>
  <!-- 添加门禁卡 -->
  <div>
    <object ref="MWRFATL" style="width: 0px; height: 0px"
            codeBase="rf35.cab#version=1,0,0,1"
            classid="CLSID:8C11E03B-3F3E-4457-A5A1-B9ECEC5FDA80"></object>
    <div style="color: #ff0000">{{msg}}</div>
    <el-row>
      <el-col :span="6" :offset="1"><img :src="operailityData.userPhoto || '//iph.href.lu/100x100'"></el-col>
      <el-col :span="15" :offset="1">
        <el-form label-width="68px" :model="formValidate" ref="formValidate" :rules="rules" onsubmit="return false">
          <el-form-item label="姓名：">{{ formValidate.userName }}</el-form-item>
          <el-form-item label="卡号：" prop="cardNum">
            <el-input v-model="formValidate.cardNum"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col align="center">
        <el-button type="success" @click="readCard">读卡</el-button>
        <!-- <el-button type="primary">保存</el-button> -->
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from './api';
  import {
    accessControlManage as rules
  } from '../../rules'; // 表单验证规则
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
        formValidate: {
          userId: this.operailityData.userId,
          userName: this.operailityData.userName,
          cardNum: '',
        },
        addMessTitle: {
          type: 'add',
          successTitle: '保存成功!',
          errorTitle: '保存失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method
          }
        },
        msg:"",
        flag:true,
      }
    },
    computed:{
      mwrfatlObj(){
        return this.$refs.MWRFATL;
      }
    },
    mounted(){
      this.$nextTick(function(){
        if(this.flag){
          this.flag = false;
          this.Connect();
        }
      })
    },
    beforeDestroy(){
      let MWRFATL = this.mwrfatlObj;
      let iRet = MWRFATL.CloseReader();
      if(iRet){
        this.showReadMsg("断开设备失败!");
      }else{
        this.showReadMsg("断开设备成功!");
      }
    },
    methods: {
      // 读卡
      readCard() {
        /*this.ajax({
          ajaxSuccess: res => {
            if (res.data) {
              this.successMess('读卡成功');
              this.formValidate.cardNum = res.data;
            }
          },
          ajaxError: res => this.errorMess('读卡失败'),
          ajaxParams: {
            url: api.readCard.path,
            method: api.readCard.method
          }
        })*/
        this.Scard();
      },

      //链接卡
      Connect()
      {
        let MWRFATL = this.mwrfatlObj;
        if(!MWRFATL){
          this.showReadMsg("电脑端未链接读卡器!");
          return;
        }
        let version = MWRFATL.openReader(0,9600);
        if(version.indexOf("失败")>-1){
          this.showReadMsg("读卡失败,请尝试重新插拔USB!");
        }else{
          MWRFATL.ReaderBeep(30);
        }
        //msg.value = version +"\n";
      },

      //寻卡
      Scard()
      {
        let MWRFATL = this.mwrfatlObj;
        let CardNumber = MWRFATL.openCard(0);
        if(CardNumber.indexOf("错误")>-1){
          this.showReadMsg("请重新放置卡后再读卡!");
          return;
        }
        this.formValidate.cardNum = this.parseNum(CardNumber);
        //msg.value =msg.value + CardNumber +"\n";
      },

      //转换读卡数为16进制
      parseNum(num){
        num = num.toString();
        let str1 = num.substring(0, 2);
        let str2 = num.substring(2, 4);
        let str3 = num.substring(4, 6);
        let head = parseInt("0x"+str3,16);
        let last = parseInt("0x"+str2+str1,16);
        //if(head < 100){
          //num = parseInt(head+"0"+last);
        //}else {
          num = parseInt(head+""+last);
        //}
        return num;
      },

      //读卡信息提示
      showReadMsg(msg){
        this.msg = msg;
        setTimeout(()=>{
          this.msg = "";
        },2000);
      },


      /*
       * 点击保存按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },
    },
  }

</script>

<style>
  /* 添加门禁卡 */

</style>
