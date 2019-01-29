<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <index-view v-if="activeView === 'index'" @show="show"></index-view>
    <user-view v-else :id="id" :title="title" @show="show" :rowData="rowData"></user-view>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import indexView from './bedsideExamine_index.vue';
  import userView from './user/user_list.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        id: 0, // 查看的场次id
        title: '-', // 场次标题
        activeView: 'index', // 视图切换
        rowData: null, // 用户信息
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

      },
      // 视图切换
      show(res) {
        this.id = res.id || 0;
        this.title = res.title || '';
        this.rowData = res.rowData || null;
        this.activeView = res.view;
      }
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      indexView,
      userView
    }
  }

</script>
