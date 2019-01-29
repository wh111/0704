<template>
  <div>
    <el-row >
      <el-col :span="18" :offset="2">
        <div class="cal-schoolTit" >专业名称：{{formValidate.major}}</div>
      </el-col>
    </el-row >
    <el-row >
      <el-col :span="18" :offset="2">
        <div class="cal-schoolTit" >专业代码：{{formValidate.majorCode}}</div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import api from "../api.js";
  let Util=null;
  export default {
    props:["operailityData"],
    data (){
      return{


        //存储已选择的科室
        depData:[],


        //form表单bind数据
        formValidate: {
          "major":"",
          "majorCode":""
        },


        //获取当前基地的详细信息
        getListDetail:{
          ajaxSuccess:"SuccessGetCurrData",
          ajaxParams:{
            url:api.ptMajorGet.path+this.operailityData.id,
          }
        },
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
        this.ajax(this.getListDetail);

      },

      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        if(!Util.isEmptyObject(data)){
          this.formValidate = data;
        }
      },

      cancel(){
         this.$emit("cancel","show")
      }


    },
    components:{}
  }
</script>
