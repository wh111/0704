<template>

  <div class="volunteerActivity_view">
    <el-form :model="formValidate" ref="formValidate" class="demo-form-inline" label-width="110px" >
    <el-row  class="lose-margin2">
      <el-col :span="10" :offset="1">
        <span class="text-w"><strong>科室编号：</strong></span><span>{{formValidate.code}}</span>
      </el-col>
      <el-col :span="10" :offset="2"><strong>科室名称：</strong><span>{{formValidate.name}}</span></el-col>
    </el-row >
    <el-row class="lose-margin2">
      <el-col :span="10" :offset="1">
        <span><strong>科室主任：</strong><span>{{formValidate.director}}</span></span>
      </el-col>
      <el-col :span="10" :offset="2"><strong>教学秘书：</strong><span>{{formValidate.secretary}}</span></el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="10" :offset="1">
        <span><strong>护士长：</strong><span>{{formValidate.nurse}}</span></span>
      </el-col>
    </el-row>
      <el-col :span="22" :offset="1">
        <span><strong>科室最大承载量:{{maxNum}}</strong>,&nbsp;&nbsp;&nbsp;&nbsp;其中:</span>
        <span><strong>实习生：</strong></span><span>{{formValidate.ssyCapacity}}人</span>&nbsp;&nbsp;
        <span><strong>研究生：</strong></span><span>{{formValidate.yjsCapacity}}人</span>&nbsp;&nbsp;
        <span><strong>住院医：</strong></span><span >{{formValidate.zyyCapacity}}人</span>&nbsp;&nbsp;
        <span><strong>进修生：</strong></span><span>{{formValidate.jxsCapacity}}人</span>
      </el-col >
      </el-row >
    </el-form>
    <br />
    <br />
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
          "name":"",
          "code":"",
          "directorId":"",
          "director":"",
          "secretaryId":"",
          "secretary":"",
          "nurseId":"",
          "nurse":"",
          "zyyCapacity":"",
          "ssyCapacity":"",
          "yjsCapacity":"",
          "jxsCapacity":"",
        },
        maxNum:"",
        listMessTitle:{
          ajaxSuccess:'oneDataSuccess',
          ajaxParams:{
            url:'/hospital/dept/get/'+this.operailityData,
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
      oneDataSuccess(responseData){
        let data = responseData.data;
        this.formValidate = data;
        this.maxNum = data.zyyCapacity+data.ssyCapacity+data.yjsCapacity+data.jxsCapacity;
      },


      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
      cancel(){
        this.$emit('cancel','show');
      }
    }

  }
</script>
