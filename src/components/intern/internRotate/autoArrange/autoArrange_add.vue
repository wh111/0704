<!---自动排班--->
<template>
  <div class="arrangeTab" style="height: 700px;overflow: auto;">
    <el-tabs v-model="activeName"  @tab-click="handleClick">
      <el-tab-pane label="按分组排班" name="arrangeByGroup">
        <keep-alive>
          <by-group v-if="showFirstLab" @add="subCallback" :isInit="count"
                    style="height: 630px; ;overflow-y: auto;overflow-x: hidden;"></by-group>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="按人员排班" name="arrangeByUser">
        <keep-alive>
          <by-user v-if="showSecondLab" @add="subCallback" :isInit="count"
                   style="height: 630px; ;overflow-y: auto;overflow-x: hidden;"></by-user>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>

  .arrangeTab .el-tabs{
    position: relative;
    height: 100%;
  }
  .arrangeTab .el-tabs__content{
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
  import  byGroup from './arrangeByGroup/index.vue'
  import  byUser from './arrangeByUser/index.vue'
  export default {

    data(){
      return{
        activeName:'arrangeByGroup',
        currentTabIdx:"0",
        count:0,
        showFirstLab:true,
        showSecondLab:false,
      }
    },

    methods: {
      handleClick(tab, event) {
        this.currentTabIdx = tab.index;
        this.count++;
        if(this.currentTabIdx==0){
          this.showFirstLab=true;
          this.showSecondLab=false;
        }else{
          this.showFirstLab=false;
          this.showSecondLab=true;
        }
      },

      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *addMessTitle:{
       *    type:'add',
       *    successTitle:'添加成功!',
       *    errorTitle:'添加失败!',
       *    ajaxSuccess:'ajaxSuccess',
       *    ajaxError:'ajaxError',
       *    ajaxParams:{
       *      url:'/role/add',
       *      method:'post'
       *    }
       *    }
       * @param udata boolean 默认false  是否不需要刷新当前表格数据
       * */
      subCallback(target,title,updata){
        this.$emit("add",target,title,updata);
      },
    },
    components:{
      byGroup,byUser
    }


  }
</script>
