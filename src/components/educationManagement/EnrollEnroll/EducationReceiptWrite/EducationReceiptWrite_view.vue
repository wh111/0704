<!----------------------------------
****--进修回执填写(EducationReceiptWrite_add)
****--@date     2017/9/14
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div style="width: 100%;height: 100%;">
    <h2 class="engageNotice-title">来院进修回执单</h2>
    <div class="engageNotice-content" style="height: 90%">
      <el-row>
        <el-col :span="22" :offset="2" >
          <div class="cal-schoolTit">进修人：<div class="myBtLine">{{showData.userName}}</div></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="2" style="text-indent: 2em">
          <div class="cal-schoolTit">进修单位：<div class="myBtLine">{{showData.workName}}</div>，进修时间：<div class="myBtLine">{{showData.studyTime=='HALF_YEAR'?'半年':'一年'}}</div>，报到时间：<div class="myBtLine">{{showData.checkInTime}}</div> 需要交款 <div class="myBtLine">{{showData.paymentAmount}}</div> 元。</div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :span="22" :offset="2">
          <div class="cal-schoolTit">汇款账号：1236464643123113</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22" :offset="2">
          <div class="cal-schoolTit">开户行：1236464643123113</div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :span="22" :offset="2">
          <el-form v-if="showData.paymentReceipt == '-1'">
            <el-form-item>已放弃进修</el-form-item>
            <el-form-item label="放弃说明：">{{ showData.receiptContent || '未填写' }}</el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style lang="scss">
  .engageNotice-title{
    color: #000000;
    text-align: center;
    padding:20px;
  }
  .engageNotice-content{
    width: 90%;
    margin: 0 auto;
    border: 1px solid rgb(224, 230, 237);
    padding: 20px;
    background: #F9FAFC;
    overflow: auto;
    .cal-schoolTit{
      line-height:36px;
    }
  }
  .myBtLine{
    border-bottom: 1px solid #000000;
    padding:0 60px;
    min-width: 100px;
    display: inline;
    vertical-align: middle;
  }
</style>
<script>
/*当前组件必要引入*/
import api from "./api.js";
export default{
  props: {
    userId:{
      type: Number,
      default: "",
    },
  },
  data() {
    return {
      //保存按钮基本信息
      loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
      checked: false,
      isShow:false,
      showData:{
        /*"subjectsId":"进修申请ID",
         "userId":"用户ID",
         "userName":"人员姓名",
         "workName":"进修单位",
         "studyTime":"进修时间(HALF_YEAR 半年 A_YEAR一年)",
         "checkInTime":"报到时间",
         "paymentAmount":"缴费金额",
         "paymentTime":"缴费时间",
         "paymentReceipt":"进修回执状态", 1已填回执  0未填回执
         "hasCompletedReceipt":"缴费方式('CASH' 现金,'TRANSFER'转账)"*/
      },
      listMessTitle:{
        ajaxSuccess:'updateListData',
        ajaxParams:{
          url: api.get.path+this.userId,
          params:{}
        }
      },
    }
  },
  methods: {
    //初始化请求列表数据
    init(){
      this.ajax(this.listMessTitle);
    },

    updateListData(responseData){
      this.showData = responseData.data;
    },

  },
  created(){
    this.init();
  },
}
</script>
