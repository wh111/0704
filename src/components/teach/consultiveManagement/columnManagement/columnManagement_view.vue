<template>

  <div class="showWrapper leaveManagement-show">
    <el-form class="demo-form-inline">

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item  label="名称:" class="feildFontweight">
            {{data.name}}
          </el-form-item>
        </el-col >
        <el-col :span="10" :offset="2">
          <el-form-item label="父栏目:" class="feildFontweight">
            {{data.parentName}}
          </el-form-item>
        </el-col >

      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="排列顺序:" class="feildFontweight">
            {{data.moduleOrder}}

          </el-form-item>
        </el-col >

        <el-col :span="10" :offset="2">
          <el-form-item label="是否显示:" class="feildFontweight">
            {{data.isDisplay==1?'是':'否'}}

          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="是否为功能:" >
            {{data.isFunc=='YES'?'是':'否'}}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="是否图片新闻:" prop="isPictureNews">
            {{data.isPictureNews=='YES'?'是':'否'}}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="url:" class="feildFontweight">
            {{data.moduleUrl}}

          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="18" :offset="2">
          <div class="center">
            <span class="shiy-text">栏目简介</span>
            <div class="shiy">{{data.remark}}</div>
          </div>

        </el-col >
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
        showData:{},
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.moduleGet+this.operailityData.id,
          }
        },

        //获取的数据
        "data":{
          "id":"1",
          "name":"栏目名称",
          "parentId":"1",
          "parentName":"父栏目名称",
          "moduleUrl":"**/**/**.action",
          "moduleOrder":"1",
          "isDisplay":"1",
          "remark":"栏目简介"
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
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
          this.data = responseData.data;
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
