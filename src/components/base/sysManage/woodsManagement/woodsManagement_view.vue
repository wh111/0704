<template>

  <div >
    <el-row >
      <el-col :span="18" :offset="2">
        <div class="cal-schoolTit" >名称：{{formValidate.jdName}}</div>
      </el-col>
    </el-row >
    <el-row >
      <el-col :span="9" :offset="2">
        <div class="cal-schoolTit">培训方向：{{formValidate.jdProclass}}</div>
      </el-col>

      <el-col :span="9" >
        <div class="cal-schoolTit" >基地主任：{{formValidate.jdZrUsername}}</div>
      </el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :span="18" :offset="2">
        <div class="el-form">
          <fieldset>
            <legend style="font-size:16px"> 基地科室 &nbsp;&nbsp;</legend>

            <span v-for="(item,index) in depData" class="userName"><em class="nameText">{{item.depName}}</em></span>

          </fieldset>
        </div>
      </el-col>
    </el-row>

    <el-row class="but-space">
      <el-col :span="9" :offset="10">
        <el-button  @click="cancel">关闭</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    props:["operailityData"],
    data (){
      return{


        //存储已选择的科室
        depData:[],


        //form表单bind数据
        formValidate: {
          "jdName":"",
          "jdProclass":"",
          "jdZrUsername":"",
          "jdZrUserid":"",
          "jdContent":"",
          "jdDep":[
            {
              "depId":"",
              "depName":""
            }
          ]
        },


        //获取当前基地的详细信息
        getListDetail:{
          ajaxSuccess:"SuccessGetCurrData",
          ajaxParams:{
            url:"/rotaryBasis/BaseManage/get/"+this.operailityData.jdId,
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
          this.depData = data["jdDep"];
        }
      },

      cancel(){
         this.$emit("cancel","show")
      }


    },
    components:{}
  }
</script>
