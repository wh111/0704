<template>
  <!--声像控制-->
  <div ref="content" id="content">
    <el-tabs v-model="hardwareActive">
      <el-tab-pane label="摄像机管理" name="video">
        <video-module v-if="hardwareActive == 'video'" :contenHeight="contenHeight"></video-module>
      </el-tab-pane>
      <el-tab-pane label="网络音箱管理" name="audio">
        <audio-module v-if="hardwareActive == 'audio'" :contenHeight="contenHeight"></audio-module>
      </el-tab-pane>
      <el-tab-pane label="读卡器管理" name="reader">
        <reader-module v-if="hardwareActive == 'reader'" :contenHeight="contenHeight"></reader-module>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import videoModule from './video/video_list'; // 摄像机
  import audioModule from './audio/audio_list'; // 网络音箱
  import readerModule from './reader/reader_list.vue'; // 读卡器
  export default {
    data() {
      return {
        contenHeight: 100,
        hardwareActive: 'video'
      }
    },
    methods: {
      // 获取内容部分高度
      getContentHeight() {
        this.contenHeight = this.$refs.content.parentNode.offsetHeight;
      }
    },
    components: {
      videoModule,
      audioModule,
      readerModule,
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContentHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, "resize", this.getContentHeight);
      })
    }
  }

</script>
