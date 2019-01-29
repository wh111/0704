<!--课程学习-->
<template>
  <div class="coursesStudyViews">
    <!-- 在线学习默认视图 -->
    <courses-study-index v-if="coursesStudyView === 'index'" @show="show" :operaility-data="operailityData"></courses-study-index>
    <courses-list v-if="coursesStudyView === 'coursesList'" @show="show" :operaility-data="operailityData"></courses-list>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import coursesStudyIndex from './coursesStudy_index'; // 在线学习首页
  import coursesList from '../coursesList/index'; // 课程列表
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        coursesStudyView: 'index',
        operailityData: '',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {},
      /**
       * 视图切换
       * view 切换的视图名称
       * dataObj 附带参数
       */
      show(view, dataObj) {
        this.coursesStudyView = view;
        this.operailityData = dataObj;
      },
    },
    created() {
      this.init();
    },
    mounted() {},
    components: {
      coursesStudyIndex,
      coursesList,
    }
  }

</script>

<style lang="scss">
  .coursesStudyViews {
    height: 100%;
  }

</style>
