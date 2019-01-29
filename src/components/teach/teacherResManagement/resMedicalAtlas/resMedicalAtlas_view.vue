<!----------------------------------
****--医学图谱(normCourseTree_list)
****--@date     2017/8/4
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <div v-if="docImages.length>0">
      <viewPPT @showIntro="showIntro" :docImages="docImages">
        <h2 slot="header">{{formValidate.title}}</h2>
      </viewPPT>
      <div slot="content" style="margin: 0 auto; width: 1000px;">
        {{imgIntro[currIntro]}}
      </div>
    </div>
    <div v-else>
      还没有上传图片,请上传图!
    </div>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  import viewPPT from "../../../study/common/viewPPT.vue";
  import api from "./api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData"],
    data() {
      return {
        formValidate:{},
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url: api.detail.path+this.operailityData.id,
          }
        },
        docImages:[],
        imgIntro:[],
        currIntro:0
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        //初始化
        this.ajax(this.listMessTitle);
      },


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.formValidate=data;
        this.docImages = [];
        this.imgIntro = [];
        for(var i=0,item;i<data["atlasImgsDtoList"].length;i++){
          item = data["atlasImgsDtoList"][i];
          this.docImages.push(this.$store.state.envPath.http+item.img);
          this.imgIntro.push(item.remark);
        }
      },


      cancel(){
        this.$emit('cancel','show');
      },

      /**
      * 切换图片介绍
      * @param idx  当前选中图片的索引
      */
      showIntro(idx){
        this.currIntro = idx;
      },

    },
    created(){
      this.init();
    },
    computed: {
    },
    mounted(){},
    components: {
      viewPPT
    }
  }
</script>
<style>
  @import '../../../../assets/ambuf/css/manage_v1.0/swiper.css';
</style>

