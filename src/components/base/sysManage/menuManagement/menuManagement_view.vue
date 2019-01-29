<template>

  <div class="volunteerActivity-view">

    <el-row class="lose-margin2">
      <el-col :span="10" :offset="2">
        <p ><span class="name">菜单名称：</span><span>{{formValidate.name}}</span></p>
      </el-col>
      </el-col >
      <el-col :span="10">
        <p ><span class="name">菜单代码：</span><span>{{formValidate.identity}}</span></p>
      </el-col >
    </el-row >

    <el-row class="lose-margin2">
      <el-col :span="10" :offset="2">
        <p ><span class="name">图标：</span><span>{{formValidate.icon}}</span></p>
      </el-col >
      </el-col >
      <el-col :span="10">
        <p ><span class="name">显示顺序：</span><span>{{formValidate.sequence}}</span></p>
      </el-col >
    </el-row >

    <el-row class="lose-margin2">
      <el-col :span="20" :offset="2">
        <p ><span class="name">URL：</span><span>{{formValidate.url}}</span></p>
      </el-col>
      </el-col >
    </el-row >

    <!---->
    <el-row  class="btn">
    <el-col :span="20" :offset="2" style="text-align: center">
      <Button @click="cancel()">关闭</Button>
    </el-col >
  </el-row >
  </div>
</template>
<script >
  import util from "../../../../libs/util";
  const getList = util.getList;
  const url = 'data1.json'
  export default {
    props: ['operailityData'],
    data (){
      return{
        //form表单bind数据
        formValidate: {
          "id":this.operailityData.id,
          "name":"",
          "identify":"",
          "icon":"",
          "parentId":this.operailityData.parentId,
          "sequence":"",
          "url":"",
          "remark":"",
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'oneDataSuccess',
          ajaxParams:{
            url:'/menu/get/'+this.operailityData.id,
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
