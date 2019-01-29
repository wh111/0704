<template>
  <!-- 预览时间表 -->
  <div class="examineInterval_preview">
    <student-time v-if="previewData.stationRoomList[0]" :headerList="previewData.stationRoomList" :tableList="previewData.timeList"></student-time>
    <p class="tips" v-else>没有可预览的时间表</p>
  </div>
</template>

<script>
  import studentTime from './examineIntervalTimeTable/examineIntervalTimeTable_student'; // 学生时间表
  export default {
    props: ['previewData'],
    components: {
      studentTime
    }
  };

</script>

<style lang="scss">
  .examineInterval_preview {
    min-height: 300px;
    max-height: 500px;
    overflow: auto;
    .tips {
      text-align: center;
      line-height: 300px;
    }
  }

</style>
