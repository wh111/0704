<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/7/24
****--@author   gx
----------------------------------->
<template>
  <div>
    <rdy-dep-contrast style="height: 500px;" :isShowRt="rtId" :isRefresh="resizeSecond"></rdy-dep-contrast>
    <el-row>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
      <el-col :span="8" class="textCenter">
        <el-button @click="$emit('last')">上一步</el-button>
        <el-button @click="$emit('cancel')">完成</el-button>
      </el-col>
      <el-col  class="textCenter">&nbsp;</el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import rdyDepContrast from './rdyDepContrast_list.vue'
  //当前组件引入全局的util
  let Util = null;

  export default{
    props:['rtId','resizeSecond'],
    data() {
      return {}
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
    components: {

      rdyDepContrast
    }
  }
</script>
