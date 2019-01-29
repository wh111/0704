<!----------------------------------
****--视频介绍(introduce)
****--@date     2017/8/7
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div class="video-introduce-title">
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="介绍">
        <div class="video-introduce-content">{{content}}</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
/*当前组件必要引入*/

//当前组件引入全局的util
let Util = null;
export default{
    props:{
      content:{
        type:String,
        default:"",
      }
    },
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
        //初始化请求列表数据
        init(){

        },

    },
    created(){
        this.init();
    },
    mounted(){
    },
    components: {}
}
</script>
<style>
  @import "../../../assets/ambuf/css/videoStudy/default.css";
</style>
