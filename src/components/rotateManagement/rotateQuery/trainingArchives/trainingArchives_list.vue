<!----------------------------------
****--培训档案
****--@date     2017/7/3
****--@author   gx
----------------------------------->
<template>
  <div style="height:100%;" >
    <RotaryManual  :studentTypes="studentTypes" ></RotaryManual>
    <!--<trainingFiles v-else :studentTypes="studentTypes" ></trainingFiles>-->
  </div>
</template>
<script>
    /*当前组件必要引入*/
    import RotaryManual from './trainingArchives_sxs-jxs.vue'  //实习生，进修生 （轮转手册）
    import trainingFiles from './trainingArchives_zyy-yjs.vue'  //研究生，住院医 档案管理
    //当前组件引入全局的util
    let Util = null;
    export default{
        data() {
            return {

              studentTypes:'',
            }
        },
        methods: {
            //初始化请求列表数据
            init(){


            },

        },
        created(){
//          this.init();
//          let userInfo = this.$store.getters.getUserInfo;
//          this.studentTypes =userInfo.studentTypes;
        },
        mounted(){

        },
        components: {
          RotaryManual,
          trainingFiles
        }
    }
</script>
