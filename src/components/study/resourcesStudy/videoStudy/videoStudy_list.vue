<!----------------------------------
****--视频学习(videoStudy_list)
****--@date     2017/8/7
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
<div class="showContent">
  <showList v-if="look == 'index'" :initData="initData" @show="show"></showList>
  <showVideo v-if="look == 'show'" :operaility-data="operailityData" @search="search" @show="show"></showVideo>
</div>
</template>
<script>
/*当前组件必要引入*/
import showList from './videoStudy_index.vue';
import showVideo from './videoStudy_view.vue';
//当前组件引入全局的util
let Util = null;
export default{
  data() {
    return {
      look: "index",
      operailityData:"",
      initData:{
        name:"",
      }
    }
  },
  methods: {
    //初始化请求列表数据
    init(){

    },
    /**
     * 要显示那个组件
     * @param type {String} 要是的组件判断值:index  show
     * @param obj  {Object} 要传递给显示视频展示页面的值
     */
    show(type,obj){
      this.look = type;
      this.operailityData = obj;
    },

    search(type,obj){
      this.initData = obj;
      this.look = type;
    }
  },
  created(){
    this.init();
  },
  mounted(){
  },
  components: {
    showList,
    showVideo
  }
}
</script>
<style>
  @import "../../../../assets/ambuf/css/videoStudy/default.css";
</style>
