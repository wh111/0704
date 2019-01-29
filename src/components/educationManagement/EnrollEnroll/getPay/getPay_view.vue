<template>

  <div class="showWrapper">
    <el-form class="demo-form-inline" label-width="100px">
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="用户名称:" class="feildFontweight">
           {{data.buyerUserName}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="支付账户:" class="feildFontweight">
            {{data.buyerId}}
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="交易金额:" class="feildFontweight">
           {{data.amount}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="支付渠道:" class="feildFontweight">
            {{data.channel | channel}}
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="支付时间:" class="feildFontweight">
           {{data.timeEnd | formatDate('yyyy-MM-dd HH:mm:ss')}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="支付流水号:" class="feildFontweight">
            {{data.transactionId }}
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="订单号:" class="feildFontweight">
           {{data.orderNumber}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="支付状态:" class="feildFontweight">
            {{data.tradeState | tradeState }}
          </el-form-item>
        </el-col>
      </el-row >

    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],
    data (){
      return{
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        "data":{
////           "id":"id",
//          "subjectsId":"进修申请ID",
//          "orderNumber":"订单号",
//          "transactionId":"支付流水号",
//          "amount":"交易金额(分为单位)",
//          "tradeState":"DZF,YZF,ZFSB,GQ 支付状态",
//          "timeEnd":"支付时间",
//          "buyerId":"支付账户(支付宝账号 微信号等)",
//          "channel":"支付渠道(A alipay W webchat Y 银联)",
//          "buyerUserId":"支付用户ID",
//          "buyerUserName":"用户名称"
        },
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.get.path+this.operailityData.id,
            params:{
              type:'id',
            }
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
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.data = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
    }
  }
</script>
