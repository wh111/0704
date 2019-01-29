<!----------------------------------
****--PPT预览(viewDoc)
****--@date     2017/8/9
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
<div>
  <div style="text-align: center;padding: 10px;">
    <slot name="header"></slot>
  </div>
  <div class="swiper-img-body">
    <div class="swiper-img-box">
      <div class="swiper-img-left">
        <swiper :options="swiperOption1" ref="mySwiper1">
          <!-- slides -->
          <swiper-slide v-for="(item,index) in imagesList" :key="index">
            <img width="100%" height="500" :src="item.src" />
          </swiper-slide>
          <!-- Optional controls -->
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
      <div class="swiper-img-right">
        <swiper :options="swiperOption2" :class="{' gallery-thumbs':true}" ref="mySwiper2">
          <!-- slides -->
          <swiper-slide v-for="(item,index) in imagesList" :key="index">
            <img width="100%" height="120" style="margin-top: 3px;" :src="item.src" />
          </swiper-slide>
          <!-- Optional controls -->
          <div class="swiper-scrollbar"   slot="scrollbar"></div>
        </swiper>
      </div>
    </div>
  </div>
  <div style="text-align: center;padding: 10px;">
    <slot name="content"></slot>
  </div>
</div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["docImages"],
    data() {
      let that = this;
      return {
        imagesList:[],
        currIdx:0,
        swiperOption1: {
          // NotNextTick is a component's own property, and if notNextTick is set to true, the component will not instantiate the swiper through NextTick, which means you can get the swiper object the first time (if you need to use the get swiper object to do what Things, then this property must be true)
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          // swiper configs 所有的配置同swiper官方api配置
          prevButton:'.swiper-button-prev',
          nextButton:'.swiper-button-next',
          height:400,
          // if you need use plugins in the swiper, you can config in here like this
          // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
          debugger: true,
          mousewheelControl : true,
          // swiper callbacks
          // swiper的各种回调函数也可以出现在这个对象中，和swiper官方一样
          onTransitionStart(swiper){
            //console.log(swiper)
            that.$emit("showIntro",swiper.activeIndex);
          },
          // more Swiper configs and callbacks...
          // ...
        },
        swiperOption2: {
          // NotNextTick is a component's own property, and if notNextTick is set to true, the component will not instantiate the swiper through NextTick, which means you can get the swiper object the first time (if you need to use the get swiper object to do what Things, then this property must be true)
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          // swiper configs 所有的配置同swiper官方api配置
          //autoplay: 3000,
          direction : 'vertical',
          spaceBetween: 10,
          centeredSlides: true,
          slidesPerView: 'auto',
          touchRatio: 0.2,
          slideToClickedSlide: true,
          mousewheelControl : true,
          //prevButton:'.swiper-button-prev',
          //nextButton:'.swiper-button-next',
          height:100,
          // if you need use plugins in the swiper, you can config in here like this
          // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
          debugger: true,
          // swiper callbacks
          // swiper的各种回调函数也可以出现在这个对象中，和swiper官方一样
          onTransitionStart(swiper){
            //console.log(swiper)
            that.$emit("showIntro",swiper.activeIndex);
          },
          // more Swiper configs and callbacks...
          // ...
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        for(var i=0;i<this.docImages.length;i++){
          this.imagesList.push({src:this.docImages[i]});
        }

      },

    },
    created(){
      this.init();
    },
    // you can find current swiper instance object like this, while the notNextTick property value must be true
    // 如果你需要得到当前的swiper对象来做一些事情，你可以像下面这样定义一个方法属性来获取当前的swiper对象，同时notNextTick必须为true
    computed: {
      swiperLeft() {
        return this.$refs.mySwiper1.swiper
      },
      swiperRight() {
        return this.$refs.mySwiper2.swiper
      },
    },
    mounted(){
      //this.swiper.slideTo(3, 1000, false)
      this.swiperLeft.params.control = this.swiperRight;
      this.swiperRight.params.control = this.swiperLeft;
    },
    components: {}
  }
</script>
<style>
  @import '../../../assets/ambuf/css/manage_v1.0/swiper.css';
</style>
