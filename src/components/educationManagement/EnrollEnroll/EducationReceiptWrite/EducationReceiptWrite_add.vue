<!----------------------------------
****--进修回执填写(EducationReceiptWrite_add)
****--@date     2017/9/14
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div style="width: 100%;height: 100%;">
    <template v-if="typeView=='engageNotice'" >
      <h2 class="engageNotice-title">来院进修回执单</h2>
      <div class="engageNotice-content" style="height: 90%">
        <el-row>
          <el-col :span="22" :offset="2">
            <div class="cal-schoolTit">进修人：
              <div class="myBtLine">{{showData.userName}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22" :offset="2" style="text-indent: 2em">
            <div class="cal-schoolTit">进修单位：
              <div class="myBtLine">{{showData.workName}}</div>
              ，进修时间：
              <div class="myBtLine">{{showData.studyTime == 'HALF_YEAR' ? '半年' : '一年'}}</div>
              ，报到时间：
              <div class="myBtLine">{{showData.checkInTime}}</div>
              需交进修费、住宿费合计
              <div class="myBtLine">{{showData.paymentAmount}}</div>
              元,杂支费用现场现金交付.
            </div>
          </el-col>
        </el-row>
        <br/>
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
        <br/>
        <template v-if="showData.hasCompletedReceipt == 'N'">
          <el-row>
            <el-col :span="22" :offset="2">
              <el-radio v-model="formValidate.type" label="0">在线支付进修费用</el-radio>
              <div  style="margin-top: 10px;display: block">
              <el-radio  v-model="formValidate.type" label="-1">放弃进修</el-radio>
              </div>
              <el-form :model="formValidate" ref="formValidate" :rules="rules">
                <el-form-item label="放弃说明：" v-if="formValidate.type == '-1'">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入内容"
                    v-model="formValidate.receiptContent"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <br/>
          <el-row>
            <el-col :span="24" style="text-align: center;">
              <load-btn v-if="showData.paymentReceipt==1" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-form v-if="showData.paymentReceipt == '-1'">
            <el-form-item>已放弃进修</el-form-item>
            <el-form-item label="放弃说明：">{{ showData.receiptContent || '未填写' }}</el-form-item>
          </el-form>
        </template>
      </div>
    </template>
    <template v-if="typeView == 'Payment'">
        <el-row style="margin:0 auto ;width: 300px" >
          <div style="font-size: 18px ;width: 90px;margin: 10px"><strong>支付方式 :</strong> </div>
          <el-col :span="21" :offset="3">
            <el-radio-group v-model="paymentReceipt.type">
              <!--<el-col :span="24" >-->
                <!--<el-radio label="A"><img src="/static/image/zfb.jpg" style="width: 150px;" alt="支付宝"></el-radio>-->
              <!--</el-col>-->
              <!--<el-col :span="24" style="margin-top: 10px">-->
                <!--<el-radio label="W">&nbsp;  <img src="/static/image/wx.jpg" style="width: 150px;" alt="微信"></el-radio>-->
              <!--</el-col>-->
              <el-col :span="24" style="margin-top: 10px">
                <el-radio label="Y"> &nbsp; &nbsp;  <img src="/static/image/yl.jpg" style="width: 150px;" alt="银联"></el-radio>
              </el-col>
            </el-radio-group>
          </el-col>
          <div style="text-align: center;margin-top: 30px">
            <el-button @click="paymentReceiptConfrim">确定</el-button>
          </div>
        </el-row>
    </template>
    <template v-if="typeView == 'thirdParty'">
        <el-row style="margin:0 auto ;width: 300px" >
          <div style="font-size: 18px ;width: 90px;margin: 10px"><strong>支付页面 :</strong> </div>
          <div style="text-align: center;margin-top: 30px">
            <el-button @click="thirdPartyConfrim('DZF')">待支付</el-button>
            <el-button @click="thirdPartyConfrim('YZF')">已支付</el-button>
            <el-button @click="thirdPartyConfrim('ZFSB')">支付失败</el-button>
            <el-button @click="thirdPartyConfrim('GQ')">失效</el-button>
          </div>
        </el-row>
    </template>
    <template v-if="typeView == 'PaymentSuccess'">
        <el-row  >
          <el-col :span="20">
           <!-- <div style=" margin:60px auto 30px;font-size: 18px ;width: 300px;color: #FB7637;text-align: center"><strong>{{ PayData.tradeState|trade}} </strong> </div>
            <div style="width: 300px;margin: 0 auto;font-size: 18px">
              <div style="margin:30px ;font-size: 16px ;" >
                <span>支付流水号：</span>
                <span>{{PayData.transactionId}}</span>
              </div>
              <div style="margin:30px;font-size: 16px ; ">
                <span>支付账号 ：</span>
                <span>{{PayData.sellerEmail}}</span>
              </div>
              <div style="margin:30px ;font-size: 16px ;">
                <span>支付金额 ：</span>
                <span>{{PayData.money}}</span>
              </div>
            </div>-->
            <div style=" margin:60px auto 0px;width: 400px;">
              <canvas id="myCanvas" width="400" height="250px" style="background-color:#fff">
                您的浏览器不支持canvas标签。
              </canvas>
            </div >
            <div style="text-align: center">
              <el-button v-if="['DZF','ZFSB','GQ'].includes(PayData.tradeState)" @click="againPayment">重新支付</el-button>
              <el-button v-else @click="downLoad">下载</el-button>
            </div>
          </el-col>

        </el-row>
    </template>

  </div>
</template>
<style lang="scss">
  .engageNotice-title {
    color: #000000;
    text-align: center;
    padding: 20px;
  }

  .engageNotice-content {
    width: 90%;
    margin: 0 auto;
    border: 1px solid rgb(224, 230, 237);
    padding: 20px;
    background: #F9FAFC;
    overflow: auto;
    .cal-schoolTit {
      line-height: 36px;
    }
  }

  .myBtLine {
    border-bottom: 1px solid #000000;
    padding: 0 60px;
    min-width: 100px;
    display: inline;
    vertical-align: middle;
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from "./api.js";
  import {EducationReceiptWrite as rules} from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'userId'],
    data() {
      return {
        rules,
        typeView:'engageNotice', // 类型默认是来院进修回执单界面
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        checked: false,
        formValidate: {
          type: '0', // 0 已填写 | -1放弃
          receiptContent: '', // 放弃说明
        },
        paymentReceipt:{ // 支付方式
          type:'A',
        },
        PayData:{}, //支付数据
        showData: {
//          /*"subjectsId":"进修申请ID",
//           "userId":"用户ID",
//           "userName":"人员姓名",
//           "workName":"进修单位",
//           "studyTime":"进修时间(HALF_YEAR半年 A_YEAR一年)",
//           "checkInTime":"报到时间",
//           "paymentAmount":"缴费金额",
//           "paymentTime":"缴费时间",
//           "paymentReceipt":"进修回执状态", 1已填回执  0未填回执
//           "hasCompletedReceipt":"缴费方式('CASH' 现金,'TRANSFER'转账)"*/
        },
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.get.path + this.userId,
            params: {}
          }
        },


        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '保存成功!',
          errorTitle: '保存失败!',
          ajaxSuccess: 'ajaxSuccessFun',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method,
          }
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        createPayMessTitle: {
          ajaxSuccess: 'createPaySuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.createPay.path+this.operailityData.subjectsId,
            method: api.createPay.method,
          }
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        payNotifyMessTitle: {
          ajaxSuccess: 'payNotifySuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.payNotify.path,
            method: api.payNotify.method,
          }
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        payResultMessTitle: {
          ajaxSuccess: 'payResultSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
//            url: api.payResult.path, // 下面定义
            method: api.payResult.method,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
//        this.ajax(this.listMessTitle);
        if (this.operailityData) {
          this.showData = this.operailityData
        }
      },
//
      updateListData(responseData) {
        let data = responseData.data;
        this.showData = data;
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
          if(this.formValidate.type == 0){
            this.typeView = 'Payment';
            return;
          }
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun);
        }
      },

      ajaxSuccessFun() {
        this.ajax(this.listMessTitle);
        this.showMess("回执单提交成功!");
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


      //点击支付方式按钮
      paymentReceiptConfrim(){
        this.ajax(this.createPayMessTitle)
      },

      //创建支付订单成功
      createPaySuccess(res){
        let data = res.data;
        this.PayData = data;
        this.typeView = 'thirdParty';
      },



      //第三方支付回调
      thirdPartyConfrim(type){
        let templateData = {
          orderNumber:this.PayData.orderNumber,
          tradeNo:"111",
          money:"800",
          sellerEmail:"18810994068",
          tradeState:type,
        }
        let tempObj;
        tempObj = this.PayData = Object.assign(this.PayData,templateData)
        this.payNotifyMessTitle.ajaxParams.data={
          orderNumber :tempObj.orderNumber,
          tradeNo :tempObj.tradeNo,
          money :tempObj.money,
          sellerEmail :tempObj.sellerEmail,
        }
        //发起支付
        this.ajax(this.payNotifyMessTitle);
      },

      //发起支付成功
      payNotifySuccess(res){
        //更新状态
        this.payResultMessTitle.ajaxParams.data={
          orderNumber:this.PayData.orderNumber,
          tradeState:this.PayData.tradeState,
        }
        this.payResultMessTitle.ajaxParams.url = api.payResult.path +this.PayData.orderNumber,
          //更新支付状态
        this.ajax(this.payResultMessTitle);
      },
      payResultSuccess(res){
        this.typeView = 'PaymentSuccess';
        //页面dom稳定后调用
        this.$nextTick(function () {

          let  canvas = document.getElementById("myCanvas");
          //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
          if(canvas.getContext){

            //获取对应的CanvasRenderingContext2D对象(画笔)
            let ctx = canvas.getContext("2d");

            let load =()=>{
              let  beauty = new Image();
              let url = '';
              if(['DZF','ZFSB','GQ'].includes(this.PayData.tradeState)){
                url = "/static/image/fail.png";
              }else {
                url = "/static/image/confirm.png";
              }
              beauty.src =url;
                beauty.onload = function(){
                  ctx.drawImage(beauty, 120, 27,30,30);
                };
            }
            load() // 画图
            ctx.fillStyle="#FFF";
             //画一个实体方块---fillrect(x,y,w,h);
            ctx.fillRect(0,0,400,250);
            //设置字体样式
            ctx.font = " bold 20px bolder 微软雅黑 ";
            //设置字体填充颜色
            ctx.fillStyle = "#FB7637";
            //从坐标点(50,50)开始绘制文字
            ctx.fillText(this.convert(this.PayData.tradeState), 160, 50);

            ctx.font = "  16px  微软雅黑";
            //设置字体填充颜色
            ctx.fillStyle = "#000";
            ctx.fillText('支付流水号：'+this.PayData.tradeNo, 110, 100);
            ctx.fillText('支付账号   ：'+this.PayData.sellerEmail, 110, 140);
            ctx.fillText('支付金额   ：'+this.PayData.money, 110, 180);
            //画图片

          }
        })
      },

      convert(type){
        let obj ={ //支付状态
          'DZF':'待支付',
            'YZF':'恭喜您，支付成功',
            'ZFSB':'支付失败',
            'GQ':'支付失效',
        }
        return obj[type] ||'';
      },


      //返回重新支付
      againPayment(){


        this.typeView = 'Payment';

      },
      downLoad(){
//        let downLoad =
        let type = 'jpg';
        let imgData = document.getElementById('myCanvas').toDataURL(type);

        //更改数据类型
        let  _fixType = function(type) {
          type = type.toLowerCase().replace(/jpg/i, 'jpeg');
          let r = type.match(/png|jpeg|bmp|gif/)[0];
          return 'image/' + r;
        };

        imgData = imgData.replace(_fixType(type),'image/octet-stream');
        //导出图片
        let saveFile = function(data, filename){
          let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
          save_link.href = data;
          save_link.download = filename;

          let event = document.createEvent('MouseEvents');
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          save_link.dispatchEvent(event);
        };

        // 下载后的问题名
        let filename = 'baidufe_' + (new Date()).getTime() + '.' + type;
        // download
        saveFile(imgData,filename);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
    },
    created() {
      Util = this.$util;
      this.init();
    },
    components: {}
  }
</script>
