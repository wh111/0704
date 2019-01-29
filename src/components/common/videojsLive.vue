<!----------------------------------
****--直播视频播放器(video)
****--@date     2017/8/7
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div ref="videoWrapper" style="height: 100%" class="videojsLive">
    <video-player class="vjs-custom-skin" :options="playerOptions" @ready="playerReadied"></video-player>
  </div>
</template>
<style lang="scss">
  .videojsLive {
    .video-player {
      height: 100%;
      .video-js[tabindex="-1"] {
        height: 100%;
      }
    }
  }
</style>
<script>
  // hls plugin
  require('videojs-contrib-hls/dist/videojs-contrib-hls')
  export default {
    props: ["liveUrl"],
    data() {
      return {
        playerOptions: {
          // videojs and plugin options
          sources: [{
            withCredentials: false,
            type: "application/x-mpegURL",
            src: this.liveUrl,
          }],
          autoplay: true,
          height: 100,
          controlBar: {
            timeDivider: false,
            durationDisplay: false
          },
          flash: {hls: {withCredentials: false}},
          html5: {hls: {withCredentials: false}},
          poster: "/static/image/videoPoster.png"
        }
      }
    },
    methods: {
      playerReadied(player) {
        var hls = player.tech({IWillNotUseThisInPlugins: true}).hls
        player.tech_.hls.xhr.beforeRequest = function (options) {
          return options
        }
      }
    },
    mounted() {
      this.$nextTick(function () {
        let videoPlayer = this.$refs.videoWrapper;
        let parHt = videoPlayer.parentNode.offsetHeight;
        this.playerOptions.height = parHt;
      })
    },
  }
</script>
