<template>
    <div class="departments" style="height: 100%">
    <el-tabs v-model="activeName"  @tab-click="handleClick">
      <el-tab-pane label="院内科室管理" name="nosocomial">
        <keep-alive>
        <nosocomial v-if="showFirstLab" :isInit="currentTabIdx" style="height: 100%;"></nosocomial>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="标准科室管理" name="standard">
        <keep-alive>
        <standard v-if="showSecondLab" style="height: 100%;"></standard>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    </div>
</template>
<style>

  .departments .el-tabs{
    position: relative;
    height: 100%;
  }
  .departments .el-tabs__content{
    position: absolute;
    left: 0;
    right: 0;
    top:65px;
    bottom: 0;
  }
  .departments .el-tab-pane{
    height: 100%;
  }
</style>
<script>
  import  nosocomial from './nosocomial/nosocomial_list.vue'
  import  standard from './standard/standard_list.vue'
  export default {

      data(){
          return{
            activeName:'nosocomial',
            currentTabIdx:"0",
            showFirstLab:true,
            showSecondLab:false,
          }
      },

    methods: {
      handleClick(tab, event) {
        this.currentTabIdx = tab.index;
        if(this.currentTabIdx==0){
          this.showFirstLab=true;
          this.showSecondLab=false;
        }else{
          this.showFirstLab=false;
          this.showSecondLab=true;
        }
      }
    },
    components:{
      nosocomial,standard

    }


  }
</script>
