<template>
  <!-- 考核安排 -->
  <div>
    <keep-alive>
      <atm-index v-if="atmActive === 'index'" @show="show"></atm-index>
      <atm-view v-if="atmActive === 'view'" :stitle="title" :id="id" @show="show"></atm-view>
    </keep-alive>
  </div>
</template>

<script>
  import atmIndex from './attendanceMaintenance_index'; // 列表数据
  import atmView from './attendanceMaintenance_view'; // 查看
  export default {
    data() {
      return {
        id: 0, // 查看的场次id
        title: '-', // 场次标题
        atmActive: 'index', // 视图切换
      }
    },
    methods: {
      show(res) {
        this.id = res.id || 0;
        this.title = res.title || '';
        this.atmActive = res.view;
      }
    },
    components: {
      atmIndex,
      atmView
    }
  }

</script>

<style>


</style>
