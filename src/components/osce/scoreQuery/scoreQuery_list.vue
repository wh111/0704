<template>
  <!-- 考核安排 -->
  <div>
    <query-index v-if="scoreQueryActive === 'index'" @show="show"></query-index>
    <query-view v-if="scoreQueryActive === 'view'" :stitle="title" :sceneId="id" @show="show"></query-view>
  </div>
</template>

<script>
  import queryIndex from './scoreQuery_index'; // 列表数据
  import queryView from './scoreQuery_view'; // 查看
  export default {
    data () {
      return {
        id: 0, // 查看的场次id
        title: '-', // 场次标题
        scoreQueryActive: 'index' // 视图切换
      }
    },
    methods: {
      show (res) {
        this.id = res.id || 0;
        this.title = res.title || '';
        this.scoreQueryActive = res.view;
      }
    },
    components: {
      queryIndex,
      queryView
    }
  }

</script>

<style>


</style>
