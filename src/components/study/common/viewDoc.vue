<!----------------------------------
****--word预览(viewDoc)
****--@date     2017/8/9
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
<div>
  <div style="text-align: center;padding: 10px;">
    <slot name="header"></slot>
  </div>
  <div class="swiper-doc-body">
    <div v-for="(item,index) in imagesList" :key="index" class="swiper-doc-box">
      <img width="100%" :src="item">
      <div class="swiper-doc-pageNum">当前第 {{index+1}} 页</div>
    </div>
  </div>
  <div style="text-align: center;padding: 10px;">
    <slot name="content"></slot>
  </div>
</div>
</template>
<style>
  .swiper-doc-body{
    width: 1000px;
    margin: 0 auto;
    /*padding: 20px;
    background: #e6e6e6;*/
  }
  .swiper-doc-box{
    margin: 18px;
    padding: 20px;
    border: 1px solid #efefef;
    box-shadow: 0 0 4px 0 rgba(195,195,195,0.50);
  }
  .swiper-doc-pageNum{
    text-align: center;
    padding: 20px 0 0 0;
  }
</style>
<script>
/*当前组件必要引入*/

//当前组件引入全局的util
let Util = null;
export default{
  props:["docImages"],
  data() {
    return {
      imagesList:[
        "/static/swiper-img/nature1.jpg",
        "/static/swiper-img/nature2.jpg",
        "/static/swiper-img/nature3.jpg",
        "/static/swiper-img/nature4.jpg",
        "/static/swiper-img/nature5.jpg",
      ],
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
  mounted(){},
  components: {}
}
</script>
