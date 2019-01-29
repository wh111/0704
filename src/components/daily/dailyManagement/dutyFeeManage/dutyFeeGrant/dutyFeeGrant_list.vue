<!----------------------------------
****--@name     值班费发放
****--@role     ${*}
****--@date     2018/1/19
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="夜班" name="yb">
        <keep-alive>
          <detail v-if="activeName=='yb'" activeName="yb"></detail>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="节假日值班" name="jjr">
        <keep-alive>
          <detail v-if="activeName=='jjr'" activeName="jjr"></detail>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="高温补贴" name="gwbt">
        <keep-alive>
          <detail v-if="activeName=='gwbt'" activeName="gwbt"></detail>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="其他" name="qt">
        <keep-alive>
          <detail v-if="activeName=='qt'" activeName="qt"></detail>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import detail from './detail.vue'
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        activeName: 'yb',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

      },
      handleClick(tab, event) {

      }

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {detail}
  }
</script>
