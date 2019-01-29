<template>
  <div>
    <el-row>
      <el-form :inline="true" :model="formValidate" ref="formValidate" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="NO:" prop="invoiceNo">
              <el-input v-model="formValidate.invoiceNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="4">
            <div style="width: 200px;border: 1px solid #8391a5;padding: 4px;float: right;">
              交费后请将此回执单交回教育处,
              并将财务部出具的发票号码填写在
              下方“发票号码”栏中。
            </div>
          </el-col>
        </el-row>
        <el-col :span="18" :offset="3" class="printBPMain">
          <div class="printBPItem" v-for="(item,index) in payData" :key="index">
            <div class="printMain">
              <p>财务处：</p>
              <div class="printCon">
                请收
                <div>{{ item.workName }}</div>
                单位
                <div>{{ item.userName }}</div>
                同学进修费
                <div>{{ item.paymentAmount }}</div>
                元、住宿费
                <div>{{ item.totalZsCost }}</div>
                元及押金
                <div>{{ item.deposit }}</div>
                元；费用共计
                <div>{{ ((+item.paymentAmount) + (+(item.totalZsCost || 0)) + (+(item.deposit || 0))).toFixed(1) }}</div>
                元。
              </div>
              <div class="signature">
                <p>教育处</p>
                <p>日期：</p>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18" :offset="3">
          <el-form-item label="发票号码：NO:" prop="invoiceNo">
            <el-input v-model="formValidate.invoiceNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="18" :offset="3">
          <el-form-item label="缴费方式：" prop="parymentMethods">
            <el-checkbox v-model="formValidate.parymentMethods" true-label="CASH" falseLabel="TRANSFER">现金</el-checkbox>
            <el-checkbox v-model="formValidate.parymentMethods" true-label="TRANSFER" falseLabel="CASH">转账</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="13" :offset="11" align="right">
          <el-form-item label="缴费时间：" prop="paymentTime">
            <el-date-picker
              v-model="formValidate.paymentTime"
              type="date"
              placeholder="选择日期"
              @change="changePayTime">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="3">
          <el-form-item label="附件：" labelWidth="60px">
            <!--<span v-if="isGet" v-for="item in this.files">{{item.fileName}}</span>-->
            <uploadFile @setUploadFiles="setUploadFiles" :uploadFiles="formValidate.paymentFiles"></uploadFile>
          </el-form-item>
        </el-col>
        <el-col>
          <p style="margin-top: 20px;" align="center" >
            <load-btn v-if="isGet == false" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          </p>
        </el-col>
      </el-form>
      <!-- 操作按钮 -->

    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import uploadFile from '../../../../components/common/uploadFile';
  import {feeManagement_payment as rules} from '../../rules';

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        isGet:false,
        payData:[],
        formValidate: {
          invoiceNo: '',
          parymentMethods: '',
          paymentTime: '',
          fileIds: '',
          paymentFiles:[]
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'edit',
          successTitle: '缴费登记成功!',
          errorTitle: '缴费登记失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path + this.operailityData.subjectsId,
            method: api.add.method,
          }
        },
        //保存按钮基本信息
        loadBtn: {
          title: '交费登记',
          callParEvent: 'listenSubEvent'
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        if(this.operailityData.paymentStatus == 'Y'){
          this.isGet = true;
          this.getPaymentDate();
        }else {
          this.formValidate.invoiceNo = new Date().getTime()
        }
        this.getPayData()
      },
      getPayData() {
        let opt = {
          ajaxSuccess: res => this.payData = res.data || [],
          ajaxParams: {
            url: api.getPayZs.path + this.operailityData.subjectsId,
            method: api.getPayZs.method
          }
        };
        this.ajax(opt)
      },
      //获取交费登记
      getPaymentDate (){
        let id = this.operailityData.subjectsId;
        let opt = {
          ajaxSuccess: "getPaymentDateSuccess",
          ajaxError: () => this.errorMess('获取数据失败，请重试'),
          ajaxParams: {
            url: api.get.path + id,
            method: api.get.method,
          }
        };
        this.ajax(opt)
      },
      //获取交费登记回调函数
      getPaymentDateSuccess (res){
        this.formValidate = res.data;
        this.formValidate.paymentFiles = res.data.paymentFiles;
      },
      /*
   * 点击提交按钮 监听是否提交数据
   * @param isLoadingFun boolean  form表单验证是否通过
   * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
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
      changePayTime(val){
        this.formValidate.paymentTime = val
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },
      // 上传附件
      setUploadFiles(ids) {
        this.formValidate.fileIds = ids;
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      uploadFile
    }
  }
</script>
<style lang="scss">
  .printMain {
    &,
    p {
      line-height: 2.5;
      font-size: 14px;
    }
    & ~ .printMain {
      margin-top: 70px;
    }
    .printCon {
      min-height: 5em;
      text-indent: 2em;
      margin: 10px 0 30px 0;
      div {
        padding: 0 60px;
        border-bottom: 1px solid black;
        display: inline;
      }
    }
    .signature {
      text-align: right;
      p {
        padding-right: 120px;
      }
    }
  }
</style>
