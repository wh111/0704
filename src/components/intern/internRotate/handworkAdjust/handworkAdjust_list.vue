<!----------------------------------
****--@name     按组微调
****--@role     ${*}
****--@date     2018/7/2
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal" style="height:100%;">
    <el-tabs v-model="activeName">
      <el-tab-pane label="按人微调" name="user"></el-tab-pane>
      <el-tab-pane label="按组微调" name="group"></el-tab-pane>
    </el-tabs>
    <byPerson v-if="activeName==='user'"></byPerson>
    <byGroup v-if="activeName==='group'"></byGroup>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  //引入--微调--组件
  import byGroup from './byGroup/handworkAdjust_byGroup.vue';
  import byPerson from './byPerson/handworkAdjust_byPerson.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        activeName: 'user'
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }
      },
    },
    created () {
      this.init();
    },

    mounted () {
    },
    components: {
      //当前组件引入的子组件
      byGroup, byPerson
    }

  }
</script>
