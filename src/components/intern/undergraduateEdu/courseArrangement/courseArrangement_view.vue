<template>

  <div class="showWrapper">
    <el-form class="demo-form-inline" label-width="100px">

      <div v-for="(item,index) in data">
        <div style="position: relative">
        </div>
        <el-row :gutter="20" class="row-bg">
          <el-col :span="9" :offset="2"><p><strong>科室:</strong>{{item.courseDep}} </p></el-col>
          <el-col :span="9"><p><strong>授课地点:</strong>{{item.courseAddress}} </p></el-col>
        </el-row>

        <el-row :gutter="20" class="row-bg">
          <el-col :span="9" :offset="2"><p><strong>年级:</strong>{{item.gradeNum}}  </p></el-col>
          <el-col :span="9"><p><strong>班级:</strong> {{item.classNum}} </p></el-col>
        </el-row>
        <el-row :gutter="20" class="row-bg">
          <el-col :span="9" :offset="2"><p><strong>授课时间:</strong>{{item.courseDate}}  </p></el-col>
          <el-col :span="9"><p><strong>时间段:</strong> {{item.timeInfo}} </p></el-col>
        </el-row>

        <el-row :gutter="20" class="row-bg">
          <el-col :span="9" :offset="2"><p><strong>授课类型:</strong> {{(item.courseType)}} </p></el-col>
          <el-col :span="9" ><p><strong>授课老师:</strong> {{item.teachName}} </p></el-col>
        </el-row>

        <el-row :gutter="20" class="row-bg">
          <el-col :span="9" :offset="2"><p><strong>授课内容:</strong>{{item.courseContent}}  </p></el-col>
          <el-col :span="9" ><p><strong>教学方法:</strong> {{item.courseMethod}} </p></el-col>
        </el-row>
        <br>
        <el-row  class="row-bg">
          <el-col :span="3" :offset="2"> <p><strong>相关资料:</strong> </p></el-col>
          <el-col :span="17"><upload-file  :show="true" :uploadFiles="item.fileList"></upload-file></el-col>
        </el-row>
        <br>
        <hr>
        <br>
      </div>
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
        "data":[
          {
            "courseDep":"",
            "courseContent":"",
            "courseType":"",
            "courseDate":"",
            "timeInfo":"",
            "gradeNum":"",
            "classNum":"",
            "teachName":"",
            "courseAddress":"",
            "fileList":[]
          }
        ],
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.manageGetCourse,
            params:{
              courseArrangeIds:this.operailityData.courseArrangeId,
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
