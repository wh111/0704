<!----------------------------------
****--查看-病历库(resCaseLibrary_add)
****--@date     2017/8/4
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <div style="text-align: center;padding: 10px;">
      <h2>临床病理解剖学</h2>
    </div>
    <div class="swiper-doc-body">
      <div v-for="(item,index) in imagesList" :key="index" class="swiper-doc-box">
        <img width="100%" :src="item">
        <div class="swiper-doc-pageNum">{{index+1}}</div>
      </div>
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
    border: 1px solid #c6c6c6;
    background: #ffffff;
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
    mounted(){
    },
    components: {}
  }
</script>
