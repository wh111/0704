<template>

  <div class="showWrapper">
    <el-form class="demo-form-inline">

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名:" class="feildFontweight">
            {{ showData.userName }}
          </el-form-item>
        </el-col>

        <el-col :span="10" >
          <el-form-item label="证件号:" class="feildFontweight">
            {{ showData.cardNo || '-' }}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="经办人:" class="feildFontweight">
            {{ showData.jbrName }}
          </el-form-item>
        </el-col>

        <el-col :span="10" >
          <el-form-item label="金额:" class="feildFontweight">
            {{ showData.money }}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="支付时间:" class="feildFontweight">
            {{ showData.payTime }}
          </el-form-item>
        </el-col>

        <el-col :span="10" >
          <el-form-item label="类型:" class="feildFontweight">
            {{ showData.types | laborUserType }}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="用途:" class="feildFontweight">
            {{ showData.yt }}
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>

  </div>
</template>
<script>
  import api from './api';
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        showData:{},

        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:api.get.path+this.operailityData.id,
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
        this.showData = responseData.data;
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


      //课时费标准点击
      classFee(){
          this.classFeeModal = true;
      },
    },
  }
</script>
<style>
  .showWrapper{
    height: 100%;
    padding: 20px;
    border: 1px solid #eee;
  }
  .feildFontweight{
    font-weight: bold;
  }
</style>
