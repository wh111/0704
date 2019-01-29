<template>

  <div class="volunteerActivity_view">

    <el-row  class="lose-margin2">
      <el-col :span="10" :offset="1">
        <span class="text-w"><strong>科室编号：</strong></span><span>11</span>
      </el-col>
      <el-col :span="10" :offset="2"><strong>科室名称：</strong> </el-col>
    </el-row >
    <el-row class="lose-margin2">
      <el-col :span="10" :offset="1">
        <strong>上级科室：</strong>
      </el-col>
      <el-col :span="10" :offset="2"><strong> 最大承载量：</strong></el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="10" :offset="1">
        <span><strong>科室主任：</strong></span>
      </el-col>
      <el-col :span="10" :offset="2"><strong>教学秘书：</strong></el-col>
    </el-row>
    <el-row class="lose-margin2">
      <el-col :span="5" :offset="1">
        <span><strong>护士长：</strong></span>
      </el-col>
    </el-row>
    <!---->
    <el-row  class="btn">
    <el-col :span="5" :offset="16">
      <Button type="primary" @click="confirm()">确定</Button>
    </el-col >
  </el-row >
  </div>
</template>
<script >

  export default {
    props: ['operailityData'],
    data (){
      return{
        formValidate: {
          name: '',
          school: '',
          status: ''
        },
        show:{},
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'oneDataSuccess',
          ajaxParams:{
//            url:'/role/get/'+this.operailityData.id,
            url:'/role/get/'
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
        let type = [];
        let data = responseData.data;
        type.push(data.type+"");
        this.formValidate = data;
        this.formValidate.type = type;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
      confirm(){
        this.$emit('cancel','show')
      }
    }

  }
</script>
