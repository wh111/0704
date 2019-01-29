<template>

  <div class="volunteerActivity-view">

    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p ><span class="name">节日名称：</span><span>{{formValidate.holidayName}}</span></p>
      </el-col>

    </el-row >

    <el-row class="lose-margin2">
      <el-col :span="10" :offset="2">
        <p ><span class="name">开始时间：</span><span>{{formValidate.startDate}}</span></p>
      </el-col>
      <el-col :span="10">
        <p ><span class="name">结束时间：</span><span>{{formValidate.endDate}}</span></p>
      </el-col >
    </el-row >
    <br />
    <!---->
    <el-row  class="btn">
      <el-col :span="24" style="text-align: center">
        <el-button @click="cancel()">关闭</el-button>
      </el-col >
    </el-row >
  </div>
</template>
<script >
  export default {
    props: ['operailityData'],
    data (){
      return{

        //form表单bind数据
        formValidate: {
          "id":"",
          "holidayName":"",
          "startDate":"",
          "endDate":"",
          "status":"",
          "index":''

        },
        show:{},
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/holidaySet/get/'+this.operailityData.id,
          }
        }
      }
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
        this.formValidate = responseData.data;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
      cancel(){
        this.$emit('cancel','show')
      }

    }

  }
</script>
