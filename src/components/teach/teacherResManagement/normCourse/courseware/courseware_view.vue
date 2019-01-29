<template>
  <!-- 课件 - 查看 -->
  <div class="coursewareViewMain">
    <cw-list v-if="cwView === 'list'" @show="show" :showProgress="showProgress"></cw-list>
    <cw-player v-if="cwView === 'player'" :cwData="cwData" @show="show" :saveProgress="saveProgress"
               @updateView="updateView"></cw-player>
  </div>
</template>

<script>
  import cwList from './view/list'; // 课件列表
  import cwPlayer from './view/player'; // 课件查看
  export default {
    // 是否显示进度条
    props: ['showProgress', 'saveProgress'],
    data() {
      return {
        cwView: 'list',
        cwData: {
          // planIndex 第几课
          // type 课件类型
        },
      }
    },
    created() {
      console.log('2', this.saveProgress)
    },
    methods: {
      // 初始化
      show(view, data) {
        this.cwView = view;
        this.cwData = data;
      },

      //返回
      callBack() {
        this.cwView = 'list';
      },
      updateView() {
        this.$emit('updateView')
      },
    },
    components: {
      cwList,
      cwPlayer
    }
  }

</script>
