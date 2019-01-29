<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <!--<el-row>-->
          <!--<el-col :span="12">-->
            <!--<el-form-item label="NO:" prop="invoiceNo">-->
              <!--{{ formValidate.invoiceNo }}-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="8" :offset="4">-->
            <!--<div style="width: 200px;border: 1px solid #8391a5;padding: 4px;float: right;">-->
              <!--交费后请将此回执单交回教育处,-->
              <!--并将财务部出具的发票号码填写在-->
              <!--下方“发票号码”栏中。-->
            <!--</div>-->
          <!--</el-col>-->
        <!--</el-row>-->
        <el-col :span="18" :offset="3" class="printBPMain">
          <div class="printBPItem" v-for="(item,index) in payData" :key="index">
            <div class="printMain">
              <p>财务处：</p>
              <div class="printCon">
                转账流水号
                <div>{{formValidate.transactionId}}</div>
                请收
                <div>{{ item.workName }}</div>
                医院
                <div>{{ item.userName }}</div>
                医师进修费
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
        <!--<el-col :span="18" :offset="3">-->
          <!--<el-form-item label="发票号码：NO:" prop="invoiceNo">-->
            <!--{{ formValidate.invoiceNo }}-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="18" :offset="3">
          <el-form-item label="缴费方式：" prop="parymentMethods">
            {{ formValidate.parymentMethods | parymentMethods }}
          </el-form-item>
        </el-col>
        <el-col :span="18" :offset="3">
          <el-form-item label="缴费时间：" prop="paymentTime">
            {{ formValidate.paymentTime }}
          </el-form-item>
        </el-col>
        <!--<el-col :span="21" :offset="3">-->
          <!--<el-form-item label="附件：" labelWidth="60px">-->
            <!--<uploadFile :uploadFiles="formValidate.paymentFiles" :show="true"></uploadFile>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      </el-form>
      <!-- 操作按钮 -->

    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import uploadFile from '../../../../components/common/uploadFile';

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        payData:[],
        formValidate: {
          invoiceNo: '',
          parymentMethods: '',
          paymentTime: '',
          fileIds: '',
          transactionId:'',
          paymentFiles:[]
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getPaymentDate();
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
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      uploadFile
    },
    filters:{
      parymentMethods(val){
        let opt = {
          CASH:"现金",
          TRANSFER:"转账"
        };
        return opt[val] || val
      }
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
